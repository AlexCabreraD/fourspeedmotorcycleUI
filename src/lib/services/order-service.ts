// Order processing service with configurable payment types
import { createWPSClient, WPSCart, WPSCartItem, WPSOrder } from '@/lib/api/wps-client';

export interface OrderConfig {
  payType: 'CC' | 'OO';
  ccLastFour?: string;
  defaultWarehouse?: string;
  defaultShipTo?: string;
  testMode?: boolean; // Add test mode flag
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface OrderItem {
  sku: string;
  quantity: number;
  price: number; // Customer-facing price
  dealerPrice: number; // WPS dealer cost
  name: string;
}

export interface OrderSubmissionResult {
  success: boolean;
  poNumber: string;
  orderNumber?: string;
  error?: string;
  wpsOrder?: WPSOrder;
}

// Configuration - Easy to change payment type
const ORDER_CONFIG: OrderConfig = {
  payType: 'OO', // Open Order - Net terms billing
  // payType: 'CC', // Credit Card - Auto charge
  // ccLastFour: '1234', // Only needed if using CC
  defaultWarehouse: 'ID', // Boise warehouse
  defaultShipTo: '1234567', // Your dealer ship-to number
  testMode: true, // Enable test mode by default
};

export class OrderService {
  private wpsClient;
  private config: OrderConfig;

  constructor(config: OrderConfig = ORDER_CONFIG) {
    this.wpsClient = createWPSClient();
    this.config = config;
  }

  // Generate unique PO number
  private generatePoNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `4SM-${timestamp}-${random}`;
  }

  // Convert cart items to WPS cart items
  private convertToWPSCartItems(items: OrderItem[]): WPSCartItem[] {
    return items.map(item => ({
      sku: item.sku,
      quantity: item.quantity,
      // Don't include customer pricing in WPS cart
      notes: `Customer Order - ${item.name}`,
    }));
  }

  // Create WPS cart from customer info and items
  private createWPSCart(
    poNumber: string, 
    customer: CustomerInfo, 
    items: OrderItem[]
  ): WPSCart {
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
      shipping_method: 'BEST', // Best Ground method
      pay_type: this.config.payType,
      cc_last_four: this.config.ccLastFour,
      comment1: 'Online Order - 4SpeedMotorcycle.com',
      comment2: `Customer: ${customer.email}`,
      items: this.convertToWPSCartItems(items),
    };
  }

  // Calculate totals
  calculateTotals(items: OrderItem[]) {
    const customerTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const dealerTotal = items.reduce((sum, item) => sum + (item.dealerPrice * item.quantity), 0);
    const profit = customerTotal - dealerTotal;

    return {
      customerTotal,
      dealerTotal,
      profit,
      profitMargin: customerTotal > 0 ? (profit / customerTotal) * 100 : 0,
    };
  }

  // Submit order to WPS
  async submitOrder(
    customer: CustomerInfo,
    items: OrderItem[]
  ): Promise<OrderSubmissionResult> {
    const poNumber = this.generatePoNumber();

    // Test mode - Mock successful order without calling WPS
    if (this.config.testMode) {
      console.log('TEST MODE: Simulating order submission');
      console.log('Customer:', customer);
      console.log('Items:', items);
      console.log('Cart Data:', this.createWPSCart(poNumber, customer, items));
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      };
    }

    try {
      // 1. Create WPS cart
      const cartData = this.createWPSCart(poNumber, customer, items);
      
      console.log('Creating WPS cart:', poNumber);
      const cartResponse = await this.wpsClient.createCart(cartData);
      
      if (!cartResponse.data) {
        throw new Error('Failed to create cart');
      }

      // 2. Add items to cart (if not included in cart creation)
      for (const item of this.convertToWPSCartItems(items)) {
        console.log('Adding item to cart:', item.sku);
        await this.wpsClient.addItemToCart(poNumber, item);
      }

      // 3. Submit cart as order
      console.log('Submitting order:', poNumber);
      const orderResponse = await this.wpsClient.createOrder(poNumber);

      if (!orderResponse.data) {
        throw new Error('Failed to create order');
      }

      return {
        success: true,
        poNumber,
        orderNumber: orderResponse.data.order_number,
        wpsOrder: orderResponse.data,
      };

    } catch (error) {
      console.error('Order submission failed:', error);
      
      // Cleanup: Try to delete cart if it was created
      try {
        await this.wpsClient.deleteCart(poNumber);
      } catch (cleanupError) {
        console.warn('Failed to cleanup cart:', cleanupError);
      }

      return {
        success: false,
        poNumber,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get order status
  async getOrderStatus(poNumber: string): Promise<WPSOrder | null> {
    // Test mode - Return mock order status
    if (this.config.testMode && poNumber.startsWith('4SM-')) {
      console.log('TEST MODE: Returning mock order status for', poNumber);
      return {
        order_number: `TEST-${Date.now()}`,
        po_number: poNumber,
        status: 'PROCESSING',
        total: '0.00',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as WPSOrder;
    }

    try {
      const response = await this.wpsClient.getOrder(poNumber);
      return response.data;
    } catch (error) {
      console.error('Failed to get order status:', error);
      return null;
    }
  }

  // Update configuration (for switching payment types)
  updateConfig(newConfig: Partial<OrderConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): OrderConfig {
    return { ...this.config };
  }

  // Validate order without submitting (dry run)
  async validateOrder(
    customer: CustomerInfo,
    items: OrderItem[]
  ): Promise<{ valid: boolean; errors: string[]; cartData?: WPSCart }> {
    const errors: string[] = []

    // Validate customer info
    if (!customer.name.trim()) errors.push('Customer name is required')
    if (!customer.email.trim()) errors.push('Email is required')
    if (!/\S+@\S+\.\S+/.test(customer.email)) errors.push('Invalid email format')
    if (!customer.address.line1.trim()) errors.push('Address is required')
    if (!customer.address.city.trim()) errors.push('City is required')
    if (!customer.address.state.trim()) errors.push('State is required')
    if (!customer.address.zip.trim()) errors.push('ZIP code is required')
    if (!/^\d{5}(-\d{4})?$/.test(customer.address.zip)) errors.push('Invalid ZIP code format')

    // Validate items
    if (!items || items.length === 0) {
      errors.push('At least one item is required')
    } else {
      items.forEach((item, index) => {
        if (!item.sku.trim()) errors.push(`Item ${index + 1}: SKU is required`)
        if (item.quantity <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
        if (item.price < 0) errors.push(`Item ${index + 1}: Price cannot be negative`)
        if (item.dealerPrice < 0) errors.push(`Item ${index + 1}: Dealer price cannot be negative`)
        if (!item.name.trim()) errors.push(`Item ${index + 1}: Name is required`)
      })
    }

    // Generate cart data for preview
    let cartData: WPSCart | undefined
    if (errors.length === 0) {
      const poNumber = `VALIDATE-${Date.now()}`
      cartData = this.createWPSCart(poNumber, customer, items)
    }

    return {
      valid: errors.length === 0,
      errors,
      cartData
    }
  }
}

// Export singleton instance with default config
export const orderService = new OrderService();

// Export function to create service with custom config
export const createOrderService = (config: OrderConfig) => new OrderService(config);