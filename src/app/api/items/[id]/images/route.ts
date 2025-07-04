import { NextRequest, NextResponse } from 'next/server'
import { createWPSClient, ImageUtils } from '@/lib/api/wps-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    
    // Create client with caching enabled
    const client = createWPSClient({ enableCaching: true })
    
    // Get the item with images
    const response = await client.getItem(id, { include: 'images' })
    
    if (!response.data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Item not found' 
        },
        { status: 404 }
      )
    }

    const item = response.data
    const images = ImageUtils.getAllImages(item)
    
    // Build different sized image URLs
    const processedImages = images.map(image => {
      const baseImage = {
        id: image.id,
        alt: image.alt || item.name,
        mime: image.mime,
        width: image.width,
        height: image.height,
        size: image.size
      }

      // Generate URLs for different sizes
      const urls = {
        thumbnail: ImageUtils.buildImageUrl(image, '200_max'),
        card: ImageUtils.buildImageUrl(image, '500_max'),
        detail: ImageUtils.buildImageUrl(image, '1000_max'),
        full: ImageUtils.buildImageUrl(image, 'full')
      }

      return {
        ...baseImage,
        urls
      }
    })

    // Get the style parameter for quick access
    const style = searchParams.get('style') as any
    const quickUrl = style && ImageUtils.getAvailableStyles().includes(style) 
      ? ImageUtils.getOptimizedImageUrl(item, style)
      : ImageUtils.getOptimizedImageUrl(item, 'card')

    return NextResponse.json({
      success: true,
      data: {
        item_id: item.id,
        item_name: item.name,
        has_images: ImageUtils.hasImages(item),
        image_count: images.length,
        primary_image_url: quickUrl,
        images: processedImages
      }
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch item images'
    const errorStatus = (error as any)?.status || 500
    
    console.error('Item Images API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: errorStatus }
    )
  }
}