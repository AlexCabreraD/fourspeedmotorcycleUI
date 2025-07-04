import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Create client with caching enabled (vehicle makes don't change often)
    const client = createWPSClient({ enableCaching: true })
    
    // Use query builder for flexible querying
    const query = client.createQuery()
    
    // Extract and apply parameters
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')
    
    if (limit) {
      query.pageSize(parseInt(limit))
    } else {
      query.pageSize(100) // Default page size for makes
    }
    
    if (search) {
      query.filterByName(search, 'con') // Contains search for make names
    }
    
    // Sort by name for consistent ordering
    query.sortByName('asc')
    
    const response = await client.getVehicleMakes(query.build())
    
    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch vehicle makes'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Vehicle Makes API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: errorStatus }
    )
  }
}