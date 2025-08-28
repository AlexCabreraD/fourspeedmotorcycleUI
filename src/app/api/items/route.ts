import { NextRequest, NextResponse } from 'next/server'

import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client = createWPSClient()

    // Convert Next.js search params to WPS API format
    const wpsParams: Record<string, string> = {}

    // Handle pagination
    if (searchParams.get('page[size]')) {
      wpsParams['page[size]'] = searchParams.get('page[size]')!
    }
    if (searchParams.get('page[cursor]')) {
      wpsParams['page[cursor]'] = searchParams.get('page[cursor]')!
    }

    // Handle sorting
    if (searchParams.get('sort[desc]')) {
      wpsParams['sort[desc]'] = searchParams.get('sort[desc]')!
    }
    if (searchParams.get('sort[asc]')) {
      wpsParams['sort[asc]'] = searchParams.get('sort[asc]')!
    }

    // Handle filtering
    if (searchParams.get('filter[status]')) {
      wpsParams['filter[status]'] = searchParams.get('filter[status]')!
    }
    if (searchParams.get('filter[list_price][gte]')) {
      wpsParams['filter[list_price][gte]'] = searchParams.get('filter[list_price][gte]')!
    }
    if (searchParams.get('filter[list_price][lte]')) {
      wpsParams['filter[list_price][lte]'] = searchParams.get('filter[list_price][lte]')!
    }
    if (searchParams.get('filter[brand_id]')) {
      wpsParams['filter[brand_id]'] = searchParams.get('filter[brand_id]')!
    }
    if (searchParams.get('filter[product_type]')) {
      wpsParams['filter[product_type]'] = searchParams.get('filter[product_type]')!
    }

    // Handle includes
    if (searchParams.get('include')) {
      wpsParams['include'] = searchParams.get('include')!
    }

    // Call WPS API
    const response = await client.getItems(wpsParams)

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
    })
  } catch (error) {
    console.error('Items API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
