import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    
    // Create client with caching enabled
    const client = createWPSClient({ enableCaching: true })
    
    // Use query builder for more flexible querying
    const query = client.createQuery()
    
    // Pagination
    const pageSize = searchParams.get('page')
    const cursor = searchParams.get('cursor')
    
    if (pageSize) {
      query.pageSize(parseInt(pageSize))
    } else {
      query.pageSize(20) // Default page size
    }
    
    if (cursor) {
      query.cursor(cursor)
    }
    
    // Sorting
    const sort = searchParams.get('sort')
    if (sort) {
      switch (sort) {
        case 'name_asc':
          query.sortByName('asc')
          break
        case 'name_desc':
          query.sortByName('desc')
          break
        case 'newest':
        case 'created_desc':
          query.sortByDate('created_at', 'desc')
          break
        case 'oldest':
        case 'created_asc':
          query.sortByDate('created_at', 'asc')
          break
        case 'updated_desc':
          query.sortByDate('updated_at', 'desc')
          break
        case 'updated_asc':
          query.sortByDate('updated_at', 'asc')
          break
        default:
          query.sortByName('asc')
      }
    } else {
      query.sortByName('asc')
    }

    // Enhanced filtering with support for multiple values
    
    // Product type filtering
    const productType = searchParams.get('product_type')
    if (productType) {
      const types = productType.split(',')
      if (types.length === 1) {
        query.filterByProductType(types[0])
      } else {
        // Multiple product types - use raw filter
        query.addRawFilter('product_type', types)
      }
    }
    
    // Brand filtering
    const brand = searchParams.get('brand_id') || searchParams.get('brand')
    if (brand) {
      const brandIds = brand.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      if (brandIds.length === 1) {
        query.filterByBrand(brandIds[0])
      } else if (brandIds.length > 1) {
        query.addRawFilter('brand_id', brandIds)
      }
    }
    
    // Price range filtering
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : undefined
      const max = maxPrice ? parseFloat(maxPrice) : undefined
      query.filterByPriceRange(min, max)
    }
    
    // Weight range filtering
    const minWeight = searchParams.get('min_weight')
    const maxWeight = searchParams.get('max_weight')
    if (minWeight || maxWeight) {
      const min = minWeight ? parseFloat(minWeight) : undefined
      const max = maxWeight ? parseFloat(maxWeight) : undefined
      if (min !== undefined) {
        query.addRawFilter('weight[gte]', min)
      }
      if (max !== undefined) {
        query.addRawFilter('weight[lte]', max)
      }
    }
    
    // Search functionality
    const search = searchParams.get('search')
    if (search) {
      query.filterByName(search, 'con')
    }
    
    // Availability filters
    if (searchParams.get('in_stock') === 'true') {
      query.filterByStatus('STK') // STK status means in stock
    }
    
    // Category-specific filters
    
    // Suspension filters
    const suspensionType = searchParams.get('suspension_type')
    if (suspensionType) {
      const types = suspensionType.split(',')
      // Map suspension types to product name patterns
      const namePatterns = types.map(type => {
        switch (type) {
          case 'fork_springs': return 'fork spring'
          case 'shock_absorbers': return 'shock'
          case 'suspension_kits': return 'suspension kit'
          case 'lowering_kits': return 'lowering'
          case 'raising_kits': return 'raising'
          default: return type
        }
      })
      if (namePatterns.length > 0) {
        query.addRawFilter('name[con]', namePatterns[0]) // Use first pattern for now
      }
    }
    
    // Diameter filter (for suspension/wheels)
    const diameter = searchParams.get('diameter')
    if (diameter) {
      const diameters = diameter.split(',')
      const namePattern = diameters.map(d => `${d}mm`).join('|')
      query.addRawFilter('name[con]', namePattern)
    }
    
    // Tire size filter
    const tireSize = searchParams.get('tire_size')
    if (tireSize) {
      const sizes = tireSize.split(',')
      const sizePattern = sizes.map(s => s.replace('_', '/')).join('|')
      query.addRawFilter('name[con]', sizePattern)
    }
    
    // Size filter (for apparel)
    const size = searchParams.get('size')
    if (size) {
      const sizes = size.split(',')
      if (sizes.length > 0) {
        query.addRawFilter('name[con]', sizes.join('|'))
      }
    }
    
    // Color filter
    const color = searchParams.get('color')
    if (color) {
      const colors = color.split(',')
      if (colors.length > 0) {
        query.addRawFilter('name[con]', colors.join('|'))
      }
    }

    // Include related data
    query.includeImages().includeBrand()

    // Get items for this taxonomy term
    const response = await client.executeQuery(`taxonomyterms/${id}/items`, query)
    
    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
      category_id: id,
      applied_filters: {
        product_type: productType,
        brand: brand,
        min_price: minPrice,
        max_price: maxPrice,
        min_weight: minWeight,
        max_weight: maxWeight,
        search,
        in_stock: searchParams.get('in_stock'),
        suspension_type: suspensionType,
        diameter,
        tire_size: tireSize,
        size,
        color
      },
      query_params: query.build() // For debugging
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category items'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Category Items API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: errorStatus }
    )
  }
}