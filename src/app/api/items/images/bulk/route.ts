import { NextRequest, NextResponse } from 'next/server'

import { createWPSClient, ImageUtils } from '@/lib/api/wps-client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { item_ids, style = 'card' } = body

    if (!Array.isArray(item_ids) || item_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'item_ids array is required',
        },
        { status: 400 }
      )
    }

    if (item_ids.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 50 items allowed per request',
        },
        { status: 400 }
      )
    }

    // Create client with caching enabled
    const client = createWPSClient({ enableCaching: true })

    // Get multiple items with images
    const response = await client.getMultipleItems(item_ids, { include: 'images' })

    if (!response.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'No items found',
        },
        { status: 404 }
      )
    }

    // Process images for each item
    const itemImages = response.data.map((item) => {
      const images = ImageUtils.getAllImages(item)
      const hasImages = ImageUtils.hasImages(item)

      const primaryImageUrl = hasImages
        ? ImageUtils.getOptimizedImageUrl(item, style as any, '/placeholder-product.svg')
        : '/placeholder-product.svg'

      const allImageUrls = hasImages ? ImageUtils.getItemImageUrls(item, '500_max') : []

      return {
        item_id: item.id,
        item_name: item.name,
        item_sku: item.sku,
        has_images: hasImages,
        image_count: images.length,
        primary_image_url: primaryImageUrl,
        all_image_urls: allImageUrls,
        // Include basic item info for convenience
        list_price: item.list_price,
        status: item.status,
        product_type: item.product_type,
      }
    })

    return NextResponse.json({
      success: true,
      data: itemImages,
      meta: {
        total_items: itemImages.length,
        items_with_images: itemImages.filter((item) => item.has_images).length,
        items_without_images: itemImages.filter((item) => !item.has_images).length,
        style_used: style,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bulk item images'
    const errorStatus = (error as any)?.status || 500

    console.error('Bulk Item Images API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: errorStatus }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Convert GET parameters to POST format
    const itemIdsParam = searchParams.get('item_ids')
    const style = searchParams.get('style') || 'card'

    if (!itemIdsParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'item_ids parameter is required (comma-separated list)',
        },
        { status: 400 }
      )
    }

    const item_ids = itemIdsParam
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id))

    if (item_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid item IDs provided',
        },
        { status: 400 }
      )
    }

    // Call the POST logic
    const mockRequest = {
      json: async () => ({ item_ids, style }),
    } as NextRequest

    return POST(mockRequest)
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to process bulk image request'

    console.error('Bulk Item Images GET Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
