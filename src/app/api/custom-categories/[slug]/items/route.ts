import { NextRequest, NextResponse } from 'next/server'

import { getCategoryBySlug } from '@/lib/constants/custom-categories'
import { CategoryFilterParams, CategoryFilterService } from '@/lib/services/category-filter-service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)

    // Verify category exists
    const category = getCategoryBySlug(slug)
    if (!category) {
      return NextResponse.json(
        { success: false, error: `Category '${slug}' not found` },
        { status: 404 }
      )
    }

    // Create filter service
    const filterService = new CategoryFilterService()

    // Parse filter parameters
    const filterParams: CategoryFilterParams = {}

    // Pagination
    const pageSize = searchParams.get('page')
    const cursor = searchParams.get('cursor')

    if (pageSize) {
      filterParams.pageSize = parseInt(pageSize)
    }

    if (cursor) {
      filterParams.cursor = cursor
    }

    // Sorting
    const sort = searchParams.get('sort')
    if (sort) {
      filterParams.sortBy = sort as any
    }

    // Product type filtering (override category defaults)
    const productType = searchParams.get('product_type')
    if (productType) {
      filterParams.productTypes = productType.split(',')
    }

    // Price range filtering
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    if (minPrice) {
      filterParams.minPrice = parseFloat(minPrice)
    }
    if (maxPrice) {
      filterParams.maxPrice = parseFloat(maxPrice)
    }

    // Search filtering
    const search = searchParams.get('search')
    const sku = searchParams.get('sku')
    if (search) {
      filterParams.search = search
    }
    if (sku) {
      filterParams.sku = sku
    }

    // Stock filtering
    if (searchParams.get('in_stock') === 'true') {
      filterParams.inStock = true
    }

    // Brand filtering - Note: WPS API uses brand_id, but we'll try to filter by brand name in the response
    const brands = searchParams.get('brands')
    if (brands) {
      // Store brand names for post-filtering since WPS API doesn't support brand name filtering directly
      filterParams.brandNames = brands.split(',')
    }

    // Date filtering
    const newArrivals = searchParams.get('new_arrivals_days')
    if (newArrivals) {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(newArrivals))
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'created_at[gte]': daysAgo.toISOString().split('T')[0],
      }
    }

    const recentlyUpdated = searchParams.get('recently_updated_days')
    if (recentlyUpdated) {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(recentlyUpdated))
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'updated_at[gte]': daysAgo.toISOString().split('T')[0],
      }
    }

    // Weight filtering
    const minWeight = searchParams.get('min_weight')
    const maxWeight = searchParams.get('max_weight')
    if (minWeight) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'weight[gte]': parseFloat(minWeight),
      }
    }
    if (maxWeight) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'weight[lte]': parseFloat(maxWeight),
      }
    }

    // Dimension filtering
    const minLength = searchParams.get('min_length')
    const maxLength = searchParams.get('max_length')
    const minWidth = searchParams.get('min_width')
    const maxWidth = searchParams.get('max_width')
    const minHeight = searchParams.get('min_height')
    const maxHeight = searchParams.get('max_height')

    if (minLength) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'length[gte]': parseFloat(minLength),
      }
    }
    if (maxLength) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'length[lte]': parseFloat(maxLength),
      }
    }
    if (minWidth) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'width[gte]': parseFloat(minWidth),
      }
    }
    if (maxWidth) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'width[lte]': parseFloat(maxWidth),
      }
    }
    if (minHeight) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'height[gte]': parseFloat(minHeight),
      }
    }
    if (maxHeight) {
      filterParams.additionalFilters = {
        ...filterParams.additionalFilters,
        'height[lte]': parseFloat(maxHeight),
      }
    }

    // Additional custom filters based on category type
    const additionalFilters: Record<string, any> = {}

    // Engine & Performance specific filters - no additional filters needed as WPS API doesn't support engine type descriptors

    // Wheels & Tires specific filters
    if (slug === 'wheels-tires') {
      const tireSize = searchParams.get('tire_size')
      if (tireSize) {
        const sizes = tireSize.split(',').map((s) => s.replace('_', '/'))
        additionalFilters['name[con]'] = sizes.join('|')
      }

      const wheelSize = searchParams.get('wheel_size')
      if (wheelSize) {
        const sizes = wheelSize.split(',').map((s) => `${s}"`)
        additionalFilters['name[con]'] = sizes.join('|')
      }
    }

    // Protective Gear specific filters
    if (slug === 'protective-gear') {
      const protectionType = searchParams.get('protection_type')
      if (protectionType) {
        const types = protectionType.split(',')
        additionalFilters['name[con]'] = types.join('|')
      }

      const size = searchParams.get('size')
      if (size) {
        const sizes = size.split(',')
        additionalFilters['name[con]'] = sizes.join('|')
      }
    }

    // Riding Apparel specific filters
    if (slug === 'riding-apparel') {
      const size = searchParams.get('size')
      if (size) {
        const sizes = size.split(',')
        additionalFilters['name[con]'] = sizes.join('|')
      }

      const color = searchParams.get('color')
      if (color) {
        const colors = color.split(',')
        additionalFilters['name[con]'] = colors.join('|')
      }

      const gender = searchParams.get('gender')
      if (gender) {
        const genders = gender.split(',')
        additionalFilters['name[con]'] = genders.join('|')
      }
    }

    // Suspension specific filters
    if (slug === 'suspension-handling') {
      const suspensionType = searchParams.get('suspension_type')
      if (suspensionType) {
        const types = suspensionType.split(',').map((type) => {
          switch (type) {
            case 'fork_springs':
              return 'fork spring'
            case 'shock_absorbers':
              return 'shock'
            case 'lowering_kits':
              return 'lowering'
            case 'raising_kits':
              return 'raising'
            default:
              return type
          }
        })
        additionalFilters['name[con]'] = types.join('|')
      }
    }

    if (Object.keys(additionalFilters).length > 0) {
      filterParams.additionalFilters = additionalFilters
    }

    // Execute the query
    const result = await filterService.getItemsForCategory(slug, filterParams)

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: {
        cursor: {
          current: null,
          prev: null,
          next: result.nextCursor,
          count: result.totalCount,
        },
      },
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      applied_filters: result.appliedFilters,
      total_count: result.totalCount,
      has_more: result.hasMore,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category items'
    const errorStatus = (error as any)?.status || 500

    console.error('Custom Category Items API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined,
      },
      { status: errorStatus }
    )
  }
}
