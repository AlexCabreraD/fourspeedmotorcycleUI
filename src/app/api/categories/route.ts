import { NextRequest, NextResponse } from 'next/server'
import { WPS_CATEGORIES } from '@/lib/constants/categories'
import { CUSTOM_CATEGORIES, getFeaturedCategories } from '@/lib/constants/custom-categories'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const level = searchParams.get('level')

    // Handle legacy requests
    if (level === 'main' || (!level && !searchParams.get('parent_id'))) {
      let categories = WPS_CATEGORIES
      
      if (type === 'featured') {
        const featured = getFeaturedCategories()
        categories = featured.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          itemCount: cat.itemCount,
          icon: cat.icon,
          gradient: cat.gradient
        }))
      }
      
      return NextResponse.json({
        success: true,
        data: categories,
        type: 'main_categories'
      })
    }
    
    // For any other requests, return our custom categories
    return NextResponse.json({
      success: true,
      data: WPS_CATEGORIES,
      type: 'custom_categories'
    })

  } catch (error: any) {
    console.error('Categories API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch categories',
        details: error.response || null
      },
      { status: error.status || 500 }
    )
  }
}