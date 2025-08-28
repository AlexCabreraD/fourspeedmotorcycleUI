import { NextRequest, NextResponse } from 'next/server'

import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client = createWPSClient()

    // Extract query parameters
    const params: Record<string, any> = {}

    // Pagination
    if (searchParams.get('page')) {
      params['page[size]'] = searchParams.get('page')
    }
    if (searchParams.get('cursor')) {
      params['page[cursor]'] = searchParams.get('cursor')
    }

    // Search filter
    if (searchParams.get('search')) {
      params['filter[name][con]'] = searchParams.get('search')
    }

    // Default page size for getting all brands
    if (!params['page[size]']) {
      params['page[size]'] = 1000
    }

    // Sort by name
    params['sort[asc]'] = 'name'

    const response = await client.getBrands(params)

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch brands'
    const errorStatus = (error as any)?.status || 500

    console.error('Brands API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: errorStatus }
    )
  }
}
