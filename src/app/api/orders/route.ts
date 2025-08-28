import { NextRequest, NextResponse } from 'next/server'

import { orderService } from '@/lib/services/order-service'

// GET /api/orders - Get orders (for admin or date range queries)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get('from_date')
    const toDate = searchParams.get('to_date')

    // If date range provided, get orders from WPS
    if (fromDate && toDate) {
      const orders = await orderService.getOrderStatus('') // This would need to be modified for bulk orders

      return NextResponse.json({
        success: true,
        data: orders,
      })
    }

    // For now, return empty array (could implement order history storage later)
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Order history not implemented yet',
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve orders',
      },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order (alternative to checkout form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerInfo, items } = body

    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer info and items are required',
        },
        { status: 400 }
      )
    }

    const result = await orderService.submitOrder(customerInfo, items)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          poNumber: result.poNumber,
          orderNumber: result.orderNumber,
          wpsOrder: result.wpsOrder,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
