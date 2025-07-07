import { NextRequest, NextResponse } from 'next/server'
import { CUSTOM_CATEGORIES, getFeaturedCategories } from '@/lib/constants/custom-categories'
import { CategoryFilterService } from '@/lib/services/category-filter-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const includeCounts = searchParams.get('include_counts') === 'true'

    let categories = CUSTOM_CATEGORIES
    
    // Filter categories based on type
    if (type === 'featured') {
      categories = getFeaturedCategories()
    }

    // If requested, add item counts to each category
    if (includeCounts) {
      const filterService = new CategoryFilterService()
      
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          try {
            // Get a quick count by fetching just 1 item
            const result = await filterService.getItemsForCategory(category.slug, {
              pageSize: 1
            })
            
            return {
              ...category,
              itemCount: result.totalCount
            }
          } catch (error) {
            console.warn(`Failed to get count for category ${category.slug}:`, error)
            return {
              ...category,
              itemCount: 0
            }
          }
        })
      )
      
      categories = categoriesWithCounts
    }

    return NextResponse.json({
      success: true,
      data: categories,
      type: type,
      count: categories.length
    })

  } catch (error: any) {
    console.error('Custom Categories API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch categories',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    )
  }
}