import { NextRequest, NextResponse } from 'next/server'

import { orderService } from '@/lib/services/order-service'

// GET /api/orders/config - Get current order configuration
export async function GET() {
  try {
    const config = orderService.getConfig()

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('Get config error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get configuration',
      },
      { status: 500 }
    )
  }
}

// PUT /api/orders/config - Update order configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { payType, ccLastFour, defaultWarehouse, defaultShipTo } = body

    // Validate payment type
    if (payType && !['CC', 'OO'].includes(payType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment type. Must be CC or OO',
        },
        { status: 400 }
      )
    }

    // Update configuration
    const updateData: any = {}
    if (payType) {
      updateData.payType = payType
    }
    if (ccLastFour) {
      updateData.ccLastFour = ccLastFour
    }
    if (defaultWarehouse) {
      updateData.defaultWarehouse = defaultWarehouse
    }
    if (defaultShipTo) {
      updateData.defaultShipTo = defaultShipTo
    }

    orderService.updateConfig(updateData)

    const updatedConfig = orderService.getConfig()

    return NextResponse.json({
      success: true,
      data: updatedConfig,
      message: 'Configuration updated successfully',
    })
  } catch (error) {
    console.error('Update config error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update configuration',
      },
      { status: 500 }
    )
  }
}
