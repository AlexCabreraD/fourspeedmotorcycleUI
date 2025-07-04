import { NextRequest, NextResponse } from 'next/server'
import { TaxonomyNavigationService } from '@/lib/api/taxonomy-service'
import { WPS_CATEGORIES } from '@/lib/constants/categories'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taxonomyService = new TaxonomyNavigationService()

    const level = searchParams.get('level')
    const parentId = searchParams.get('parent_id')

    if (level === 'main' || (!level && !parentId)) {
      // Return hardcoded WPS categories first, fall back to API if needed
      try {
        const mainCategories = await taxonomyService.getMainCategories()
        
        // If API returns data, use it, otherwise use hardcoded categories
        if (mainCategories && mainCategories.length > 0) {
          return NextResponse.json({
            success: true,
            data: mainCategories,
            type: 'main_categories'
          })
        }
      } catch (error) {
        console.warn('Taxonomy service failed, using hardcoded categories:', error)
      }
      
      // Fallback to hardcoded WPS categories
      return NextResponse.json({
        success: true,
        data: WPS_CATEGORIES,
        type: 'main_categories'
      })
    } else if (parentId) {
      // Get subcategories for a specific parent
      const structure = await taxonomyService.getTaxonomyStructure()
      const parent = structure.categoryMap.get(parseInt(parentId))
      
      if (!parent) {
        return NextResponse.json(
          { success: false, error: 'Parent category not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: parent.children || [],
        parent: parent,
        type: 'subcategories'
      })
    } else {
      // Get full taxonomy structure
      const structure = await taxonomyService.getTaxonomyStructure()
      
      return NextResponse.json({
        success: true,
        data: structure.mainCategories,
        root: structure.rootCategory,
        type: 'full_structure'
      })
    }

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