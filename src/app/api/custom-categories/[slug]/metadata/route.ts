import { NextRequest, NextResponse } from 'next/server'
import { CategoryFilterService } from '@/lib/services/category-filter-service'
import { getCategoryBySlug } from '@/lib/constants/custom-categories'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const filterService = new CategoryFilterService()
    const include = searchParams.get('include')?.split(',') || ['price_range']
    
    const metadata: any = {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        productTypeFilters: category.productTypeFilters
      }
    }


    // Get price range if requested
    if (include.includes('price_range')) {
      try {
        const priceRange = await filterService.getPriceRangeForCategory(slug)
        metadata.priceRange = priceRange
      } catch (error) {
        console.warn(`Failed to get price range for category ${slug}:`, error)
        metadata.priceRange = { min: 0, max: 1000 }
      }
    }

    // Get featured items if requested
    if (include.includes('featured_items')) {
      try {
        const featuredItems = await filterService.getFeaturedItemsForCategory(slug, 8)
        metadata.featuredItems = featuredItems
      } catch (error) {
        console.warn(`Failed to get featured items for category ${slug}:`, error)
        metadata.featuredItems = []
      }
    }

    return NextResponse.json({
      success: true,
      data: metadata
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category metadata'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Category Metadata API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
      },
      { status: errorStatus }
    )
  }
}