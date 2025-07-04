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

    const [productResponse, itemsResponse] = await Promise.all([
      client.getProduct(id, productParams),
      client.getProductItems(id, { include: 'inventory,images' })
    ])

    // Combine product data with items
    const productData = {
      ...productResponse.data,
      items: itemsResponse.data
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