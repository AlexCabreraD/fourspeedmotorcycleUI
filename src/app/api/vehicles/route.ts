import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Create client with caching enabled
    const client = createWPSClient({ enableCaching: true })
    
    // Use query builder for flexible querying
    const query = client.createQuery()
    
    // Extract and apply parameters
    const limit = searchParams.get('limit')
    const cursor = searchParams.get('cursor')
    const search = searchParams.get('search')
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const year = searchParams.get('year')
    
    if (limit) {
      query.pageSize(parseInt(limit))
    } else {
      query.pageSize(50) // Default page size
    }
    
    if (cursor) {
      query.cursor(cursor)
    }
    
    if (search) {
      query.filterByName(search, 'con') // Contains search
    }
    
    if (make) {
      query.addFilter('make', 'con', make)
    }
    
    if (model) {
      query.addFilter('model', 'con', model)
    }
    
    if (year) {
      query.addFilter('year', 'eq', parseInt(year))
    }
    
    // Sort by make, then model, then year
    query.sortBy('make', 'asc').sortBy('model', 'asc').sortBy('year', 'desc')
    
    const response = await client.getVehicles(query.build())
    
    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch vehicles'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Vehicles API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: errorStatus }
    )
  }
}