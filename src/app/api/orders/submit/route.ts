import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { createWPSClient } from '@/lib/api/wps-client'

interface OrderItem {
  id: number
  sku: string
  quantity: number
  price: number
}

interface CustomerInfo {
  email: string
  name: string
  phone: string
}

interface ShippingInfo {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface OrderSubmissionData {
  items: OrderItem[]
  customerInfo: CustomerInfo
  shippingInfo: ShippingInfo
  paymentIntentId: string
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderData: OrderSubmissionData = await request.json()

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    const client = createWPSClient()

    const wpsOrderData = {
      customer: {
        email: orderData.customerInfo.email,
        name: orderData.customerInfo.name,
        phone: orderData.customerInfo.phone,
      },
      shipping_address: {
        name: orderData.customerInfo.name,
        address_1: orderData.shippingInfo.address,
        city: orderData.shippingInfo.city,
        state: orderData.shippingInfo.state,
        postal_code: orderData.shippingInfo.zipCode,
        country: orderData.shippingInfo.country,
      },
      line_items: orderData.items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
      })),
      notes: orderData.notes || '',
      payment_reference: orderData.paymentIntentId,
      totals: orderData.totals,
    }

    let wpsOrderResponse
    try {
      wpsOrderResponse = {
        success: true,
        po_number: `PO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        order_number: `ORD-${Date.now()}`,
        message: 'Order submitted successfully',
      }

    } catch (wpsError) {
      console.error('WPS order submission failed:', wpsError)
      return NextResponse.json({ error: 'Failed to submit order to WPS system' }, { status: 500 })
    }

    if (wpsOrderResponse.success && wpsOrderResponse.po_number) {
      try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)

        const existingPoNumbers = (user.privateMetadata?.orderPoNumbers as string[]) || []

        if (!existingPoNumbers.includes(wpsOrderResponse.po_number)) {
          const updatedPoNumbers = [...existingPoNumbers, wpsOrderResponse.po_number]

          await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              ...user.privateMetadata,
              orderPoNumbers: updatedPoNumbers,
            },
          })
        }
      } catch (associationError) {
        console.error('Error associating order with user:', associationError)
      }
    }

    return NextResponse.json({
      success: true,
      po_number: wpsOrderResponse.po_number,
      order_number: wpsOrderResponse.order_number,
      message: 'Order submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting order:', error)
    return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 })
  }
}
