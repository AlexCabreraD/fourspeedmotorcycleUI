import { NextRequest, NextResponse } from 'next/server'

import { TaxonomyNavigationService } from '@/lib/api/taxonomy-service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const taxonomyService = new TaxonomyNavigationService()

    const categoryId = parseInt(id)
    const productType = searchParams.get('product_type') || undefined
    const includeItems = searchParams.get('include_items') === 'true'

    // Get category details
    const category = await taxonomyService.getCategoryWithItems(categoryId, includeItems)

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }

    // Get breadcrumb navigation
    const breadcrumb = await taxonomyService.getCategoryBreadcrumb(categoryId)

    // Get available product types for filtering
    const productTypes = await taxonomyService.getProductTypesInCategory(categoryId)

    // Get filtered items if requested
    let filteredData = null
    if (includeItems) {
      filteredData = await taxonomyService.getFilteredItems(categoryId, productType)
    }

    return NextResponse.json({
      success: true,
      data: {
        category,
        breadcrumb,
        productTypes,
        filteredItems: filteredData,
      },
    })
  } catch (error: any) {
    console.error('Category Detail API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch category details',
        details: error.response || null,
      },
      { status: error.status || 500 }
    )
  }
}
