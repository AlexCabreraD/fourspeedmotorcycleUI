import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/services/order-service'

// GET /api/orders/[poNumber] - Get specific order status
export async function GET(
  request: NextRequest,
  { params }: { params: { poNumber: string } }
) {
  try {
    const { poNumber } = params

    if (!poNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'PO number is required' 
        },
        { status: 400 }
      )
    }

    const order = await orderService.getOrderStatus(poNumber)

    if (order) {
      return NextResponse.json({
        success: true,
        data: order,
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve order' 
      },
      { status: 500 }
    )
  }
}