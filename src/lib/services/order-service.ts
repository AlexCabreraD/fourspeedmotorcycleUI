import { createWPSClient, WPSCart, WPSCartItem, WPSOrder } from '@/lib/api/wps-client'

export interface OrderConfig {
  payType: 'CC' | 'OO'
  ccLastFour?: string
  defaultWarehouse?: string
  defaultShipTo?: string
  testMode?: boolean
}

export interface CustomerInfo {
  name: string
  email: string
  phone?: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
  }
}

export interface OrderItem {
  sku: string
  quantity: number
  price: number // Customer-facing price
  dealerPrice: number // WPS dealer cost
  name: string
}

export interface OrderSubmissionResult {
  success: boolean
  poNumber: string
  orderNumber?: string
  error?: string
  wpsOrder?: WPSOrder
}

const ORDER_CONFIG: OrderConfig = {
  payType: 'OO',
  defaultWarehouse: 'ID',
  defaultShipTo: '1234567',
  testMode: true,
}

export class OrderService {
  private wpsClient
  private config: OrderConfig

  constructor(config: OrderConfig = ORDER_CONFIG) {
    this.wpsClient = createWPSClient()
    this.config = config
  }

  private generatePoNumber(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `4SM-${timestamp}-${random}`
  }

  private convertToWPSCartItems(items: OrderItem[]): WPSCartItem[] {
    return items.map((item) => ({
      sku: item.sku,
      quantity: item.quantity,
      notes: `Customer Order - ${item.name}`,
    }))
  }

  private createWPSCart(poNumber: string, customer: CustomerInfo, items: OrderItem[]): WPSCart {
    return {
      po_number: poNumber,
      ship_to: this.config.defaultShipTo,
      ship_name: customer.name,
      ship_address1: customer.address.line1,
      ship_address2: customer.address.line2,
      ship_city: customer.address.city,
      ship_state: customer.address.state,
      ship_zip: customer.address.zip,
      ship_phone: customer.phone,
      email: customer.email,
      warehouse: this.config.defaultWarehouse,
      shipping_method: 'BEST',
      pay_type: this.config.payType,
      cc_last_four: this.config.ccLastFour,
      comment1: 'Online Order - 4SpeedMotorcycle.com',
      comment2: `Customer: ${customer.email}`,
      items: this.convertToWPSCartItems(items),
    }
  }

  calculateTotals(items: OrderItem[]) {
    const customerTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const dealerTotal = items.reduce((sum, item) => sum + item.dealerPrice * item.quantity, 0)
    const profit = customerTotal - dealerTotal

    return {
      customerTotal,
      dealerTotal,
      profit,
      profitMargin: customerTotal > 0 ? (profit / customerTotal) * 100 : 0,
    }
  }

  async submitOrder(customer: CustomerInfo, items: OrderItem[]): Promise<OrderSubmissionResult> {
    const poNumber = this.generatePoNumber()

    if (this.config.testMode) {

      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        poNumber,
        orderNumber: `TEST-${Date.now()}`,
        wpsOrder: {
          order_number: `TEST-${Date.now()}`,
          po_number: poNumber,
          status: 'TEST',
          total: this.calculateTotals(items).dealerTotal.toString(),
        } as WPSOrder,
      }
    }

    try {
      const cartData = this.createWPSCart(poNumber, customer, items)

      const cartResponse = await this.wpsClient.createCart(cartData)

      if (!cartResponse.data) {
        throw new Error('Failed to create cart')
      }

      for (const item of this.convertToWPSCartItems(items)) {
        await this.wpsClient.addItemToCart(poNumber, item)
      }

      const orderResponse = await this.wpsClient.createOrder(poNumber)

      if (!orderResponse.data) {
        throw new Error('Failed to create order')
      }

      return {
        success: true,
        poNumber,
        orderNumber: orderResponse.data.order_number,
        wpsOrder: orderResponse.data,
      }
    } catch (error) {
      console.error('Order submission failed:', error)

      try {
        await this.wpsClient.deleteCart(poNumber)
      } catch (cleanupError) {
        console.warn('Failed to cleanup cart:', cleanupError)
      }

      return {
        success: false,
        poNumber,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getOrderStatus(poNumber: string): Promise<WPSOrder | null> {
    if (this.config.testMode && poNumber.startsWith('4SM-')) {
      return {
        order_number: `TEST-${Date.now()}`,
        po_number: poNumber,
        status: 'PROCESSING',
        total: '0.00',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as WPSOrder
    }

    try {
      const response = await this.wpsClient.getOrder(poNumber)
      return response.data
    } catch (error) {
      console.error('Failed to get order status:', error)
      return null
    }
  }

  updateConfig(newConfig: Partial<OrderConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  getConfig(): OrderConfig {
    return { ...this.config }
  }

  async validateOrder(
    customer: CustomerInfo,
    items: OrderItem[]
  ): Promise<{ valid: boolean; errors: string[]; cartData?: WPSCart }> {
    const errors: string[] = []

    if (!customer.name.trim()) {
      errors.push('Customer name is required')
    }
    if (!customer.email.trim()) {
      errors.push('Email is required')
    }
    if (!/\S+@\S+\.\S+/.test(customer.email)) {
      errors.push('Invalid email format')
    }
    if (!customer.address.line1.trim()) {
      errors.push('Address is required')
    }
    if (!customer.address.city.trim()) {
      errors.push('City is required')
    }
    if (!customer.address.state.trim()) {
      errors.push('State is required')
    }
    if (!customer.address.zip.trim()) {
      errors.push('ZIP code is required')
    }
    if (!/^\d{5}(-\d{4})?$/.test(customer.address.zip)) {
      errors.push('Invalid ZIP code format')
    }

    if (!items || items.length === 0) {
      errors.push('At least one item is required')
    } else {
      items.forEach((item, index) => {
        if (!item.sku.trim()) {
          errors.push(`Item ${index + 1}: SKU is required`)
        }
        if (item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
        }
        if (item.price < 0) {
          errors.push(`Item ${index + 1}: Price cannot be negative`)
        }
        if (item.dealerPrice < 0) {
          errors.push(`Item ${index + 1}: Dealer price cannot be negative`)
        }
        if (!item.name.trim()) {
          errors.push(`Item ${index + 1}: Name is required`)
        }
      })
    }

    let cartData: WPSCart | undefined
    if (errors.length === 0) {
      const poNumber = `VALIDATE-${Date.now()}`
      cartData = this.createWPSCart(poNumber, customer, items)
    }

    return {
      valid: errors.length === 0,
      errors,
      cartData,
    }
  }
}

export const orderService = new OrderService()

export const createOrderService = (config: OrderConfig) => new OrderService(config)
