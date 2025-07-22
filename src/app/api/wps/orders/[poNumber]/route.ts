import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

// GET: Retrieve a specific WPS order by PO number
export async function GET(
  request: NextRequest,
  { params }: { params: { poNumber: string } }
) {
  try {
    const { poNumber } = params

    if (!poNumber) {
      return NextResponse.json(
        { error: 'PO number is required' },
        { status: 400 }
      )
    }

    // Create WPS client and fetch order
    const wpsClient = createWPSClient()
    const orderResponse = await wpsClient.getOrder(poNumber)

    if (!orderResponse.success || !orderResponse.data) {
      return NextResponse.json(
        { 
          error: 'Order not found',
          details: 'The specified order could not be found in the WPS system'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: orderResponse.data
    })

  } catch (error) {
    console.error('Error fetching WPS order:', error)
    
    // Check if it's a 404 error from WPS
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { 
          error: 'Order not found',
          details: 'The specified order could not be found in the WPS system'
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to retrieve order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}