import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      query: searchQuery, 
      productType, 
      brandId, 
      minPrice, 
      maxPrice, 
      inStock, 
      dropShipEligible,
      pageSize = 20,
      cursor
    } = body

    // Create client with caching enabled
    const client = createWPSClient({ enableCaching: true })
    
    // Use query builder for advanced search
    const query = client.createQuery()

    // Add text search
    if (searchQuery?.trim()) {
      query.filterByName(searchQuery.trim(), 'con') // Contains search
    }

    // Add filters
    if (productType) {
      query.filterByProductType(productType)
    }
    if (brandId) {
      query.filterByBrand(parseInt(brandId))
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const min = minPrice ? parseFloat(minPrice) : undefined
      const max = maxPrice ? parseFloat(maxPrice) : undefined
      query.filterByPriceRange(min, max)
    }
    if (inStock) {
      query.filterByStatus('A') // Active status
    }
    if (dropShipEligible) {
      query.filterByDropShipEligible(true)
    }

    // Include related data and set pagination
    query.includeImages().includeBrand().pageSize(pageSize)
    
    if (cursor) {
      query.cursor(cursor)
    }

    // Sort by relevance (name match) and then by name
    query.sortByName('asc')

    // Execute search
    const response = await client.advancedSearch(query)
    
    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
      query_params: query.build(), // For debugging
      search_info: {
        total_filters: Object.keys(body).filter(key => body[key] && key !== 'pageSize' && key !== 'cursor').length,
        has_text_search: !!searchQuery?.trim(),
        cache_enabled: true
      }
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Advanced search failed'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Advanced Search API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : null
      },
      { status: errorStatus }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Convert GET parameters to the same format as POST
    const searchData = {
      query: searchParams.get('q') || searchParams.get('query'),
      productType: searchParams.get('product_type'),
      brandId: searchParams.get('brand_id'),
      minPrice: searchParams.get('min_price'),
      maxPrice: searchParams.get('max_price'),
      inStock: searchParams.get('in_stock') === 'true',
      dropShipEligible: searchParams.get('drop_ship_eligible') === 'true',
      pageSize: searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : 20,
      cursor: searchParams.get('cursor')
    }

    // Create client with caching enabled
    const client = createWPSClient({ enableCaching: true })
    
    // Use query builder for advanced search
    const query = client.createQuery()

    // Add text search
    if (searchData.query?.trim()) {
      query.filterByName(searchData.query.trim(), 'con') // Contains search
    }

    // Add filters
    if (searchData.productType) {
      query.filterByProductType(searchData.productType)
    }
    if (searchData.brandId) {
      query.filterByBrand(parseInt(searchData.brandId))
    }
    if (searchData.minPrice !== undefined || searchData.maxPrice !== undefined) {
      const min = searchData.minPrice ? parseFloat(searchData.minPrice) : undefined
      const max = searchData.maxPrice ? parseFloat(searchData.maxPrice) : undefined
      query.filterByPriceRange(min, max)
    }
    if (searchData.inStock) {
      query.filterByStatus('A') // Active status
    }
    if (searchData.dropShipEligible) {
      query.filterByDropShipEligible(true)
    }

    // Include related data and set pagination
    query.includeImages().includeBrand().pageSize(searchData.pageSize)
    
    if (searchData.cursor) {
      query.cursor(searchData.cursor)
    }

    // Sort by relevance (name match) and then by name
    query.sortByName('asc')

    // Execute search
    const response = await client.advancedSearch(query)
    
    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
      query_params: query.build(), // For debugging
      search_info: {
        total_filters: Object.values(searchData).filter(val => val && val !== 20).length, // Exclude default pageSize
        has_text_search: !!searchData.query?.trim(),
        cache_enabled: true
      }
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Advanced search failed'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Advanced Search API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: errorStatus }
    )
  }
}