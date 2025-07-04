import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const client = createWPSClient()

    // Extract query parameters
    const params: Record<string, any> = {}
    
    // Pagination
    if (searchParams.get('page')) params['page[size]'] = searchParams.get('page')
    if (searchParams.get('cursor')) params['page[cursor]'] = searchParams.get('cursor')
    
    // Filtering
    if (searchParams.get('brand')) params['filter[brand_id]'] = searchParams.get('brand')
    if (searchParams.get('category')) params['filter[category_id]'] = searchParams.get('category')
    if (searchParams.get('min_price')) params['filter[list_price][gt]'] = searchParams.get('min_price')
    if (searchParams.get('max_price')) params['filter[list_price][lt]'] = searchParams.get('max_price')
    if (searchParams.get('search')) params['filter[name][pre]'] = searchParams.get('search')
    if (searchParams.get('product_type')) params['filter[product_type]'] = searchParams.get('product_type')
    
    // Sorting - only use supported WPS API sort parameters
    const sort = searchParams.get('sort')
    if (sort) {
      switch (sort) {
        case 'name_asc':
          params['sort[asc]'] = 'name'
          break
        case 'name_desc':
          params['sort[desc]'] = 'name'
          break
        case 'newest':
        case 'created_desc':
          params['sort[desc]'] = 'created_at'
          break
        case 'oldest':
        case 'created_asc':
          params['sort[asc]'] = 'created_at'
          break
        case 'updated_desc':
          params['sort[desc]'] = 'updated_at'
          break
        case 'updated_asc':
          params['sort[asc]'] = 'updated_at'
          break
        case 'id_asc':
          params['sort[asc]'] = 'id'
          break
        case 'id_desc':
          params['sort[desc]'] = 'id'
          break
        // Remove unsupported price sorting for now
        case 'price_asc':
        case 'price_desc':
          // Fall back to name sorting since price sorting is not supported
          params['sort[asc]'] = 'name'
          break
        default:
          params['sort[asc]'] = 'name'
      }
    }

    // Includes - only use supported includes for products endpoint
    const includes = ['items.images', 'images'] // Products can include their items with images, and product images
    params.include = includes.join(',')

    // Default page size
    if (!params['page[size]']) {
      params['page[size]'] = 20
    }

    const response = await client.getProducts(params)
    
    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
      params: params // For debugging
    })

  } catch (error: any) {
    console.error('Products API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch products',
        details: error.response || null
      },
      { status: error.status || 500 }
    )
  }
}