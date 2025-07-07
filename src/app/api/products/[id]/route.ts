import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient } from '@/lib/api/wps-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = createWPSClient()

    // Get product details with all related data
    const productParams = {
      include: 'items,images,features'
    }

    // Get product and items with images
    const productResponse = await client.getProduct(id, productParams)
    const itemsResponse = await client.getProductItems(id, { include: 'images', 'page[size]': 50 })
    
    // Get brands for brand lookup
    const brandsResponse = await client.getBrands({ 'page[size]': 1000 })

    // Create brand lookup map
    const brandMap: Record<number, { id: number; name: string }> = {}
    if (brandsResponse.data) {
      brandsResponse.data.forEach((brand: { id: number; name: string }) => {
        brandMap[brand.id] = brand
      })
    }

    // Add brand data to items without modifying original structure
    const itemsWithBrands = itemsResponse.data.map(item => ({
      ...item,
      brand: item.brand_id && brandMap[item.brand_id] ? { data: brandMap[item.brand_id] } : undefined
    }))

    // Combine product data with items
    const productData = {
      ...productResponse.data,
      items: itemsWithBrands
    }

    return NextResponse.json({
      success: true,
      data: productData,
      meta: {
        product: productResponse.meta,
        items: itemsResponse.meta
      }
    })

  } catch (error: any) {
    console.error('Product Detail API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch product details',
        details: error.response || null
      },
      { status: error.status || 500 }
    )
  }
}