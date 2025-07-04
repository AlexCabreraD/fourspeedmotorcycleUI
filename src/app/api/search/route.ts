import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // 'products', 'items', or 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const client = createWPSClient()
    const trimmedQuery = query.trim()

    const searchParams_API: Record<string, any> = {
      'page[size]': limit,
      include: 'brand,images'
    }

    let results: any = {
      query: trimmedQuery,
      products: [],
      items: [],
      total: 0
    }

    if (type === 'products' || type === 'all') {
      try {
        const productSearch = await client.searchProducts(trimmedQuery, {
          ...searchParams_API,
          include: 'brand,images,items'
        })
        results.products = productSearch.data
      } catch (error) {
        console.warn('Product search failed:', error)
      }
    }

    if (type === 'items' || type === 'all') {
      try {
        const itemSearch = await client.searchItems(trimmedQuery, {
          ...searchParams_API,
          include: 'product,brand,images'
        })
        results.items = itemSearch.data
      } catch (error) {
        console.warn('Item search failed:', error)
      }
    }

    // Also search by SKU if query looks like a SKU
    if (trimmedQuery.match(/^[A-Za-z0-9\-]+$/)) {
      try {
        const skuSearch = await client.searchItemsBySku(trimmedQuery, {
          'page[size]': 10,
          include: 'product,brand,images'
        })
        
        // Add SKU results to items if not already present
        skuSearch.data.forEach((item: any) => {
          if (!results.items.find((existing: any) => existing.id === item.id)) {
            results.items.push(item)
          }
        })
      } catch (error) {
        console.warn('SKU search failed:', error)
      }
    }

    results.total = results.products.length + results.items.length

    // Sort results by relevance (exact matches first, then partial matches)
    const sortByRelevance = (items: any[], searchTerm: string) => {
      return items.sort((a, b) => {
        const aName = (a.name || '').toLowerCase()
        const bName = (b.name || '').toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        // Exact matches first
        if (aName === searchLower && bName !== searchLower) return -1
        if (bName === searchLower && aName !== searchLower) return 1
        
        // Starts with matches
        if (aName.startsWith(searchLower) && !bName.startsWith(searchLower)) return -1
        if (bName.startsWith(searchLower) && !aName.startsWith(searchLower)) return 1
        
        // Contains matches (default sort)
        return aName.localeCompare(bName)
      })
    }

    results.products = sortByRelevance(results.products, trimmedQuery)
    results.items = sortByRelevance(results.items, trimmedQuery)

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error: any) {
    console.error('Search API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Search failed',
        details: error.response || null
      },
      { status: error.status || 500 }
    )
  }
}