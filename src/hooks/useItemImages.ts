import { useCallback, useEffect, useState } from 'react'

import { ImageUtils, WPSItem } from '@/lib/api/wps-client'

interface ItemImageData {
  item_id: number
  item_name: string
  item_sku: string
  has_images: boolean
  image_count: number
  primary_image_url: string
  all_image_urls: string[]
}

interface UseItemImagesResult {
  imageData: Record<number, ItemImageData>
  loading: boolean
  error: string | null
  loadImages: (itemIds: number[], style?: string) => Promise<void>
  getImageUrl: (itemId: number, fallback?: string) => string
  hasImages: (itemId: number) => boolean
  clearCache: () => void
}

// Simple in-memory cache for image data
const imageCache = new Map<string, ItemImageData[]>()

export function useItemImages(): UseItemImagesResult {
  const [imageData, setImageData] = useState<Record<number, ItemImageData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadImages = useCallback(
    async (itemIds: number[], style: string = 'card') => {
      if (itemIds.length === 0) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Check cache first
        const cacheKey = `${itemIds.sort().join(',')}_${style}`
        const cached = imageCache.get(cacheKey)

        if (cached) {
          const newImageData = { ...imageData }
          cached.forEach((item) => {
            newImageData[item.item_id] = item
          })
          setImageData(newImageData)
          setLoading(false)
          return
        }

        // Filter out items we already have
        const missingIds = itemIds.filter((id) => !imageData[id])

        if (missingIds.length === 0) {
          setLoading(false)
          return
        }

        // Fetch images in batches of 50
        const batches = []
        for (let i = 0; i < missingIds.length; i += 50) {
          batches.push(missingIds.slice(i, i + 50))
        }

        const allResults: ItemImageData[] = []

        for (const batch of batches) {
          const response = await fetch('/api/items/images/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              item_ids: batch,
              style,
            }),
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()

          if (!data.success) {
            throw new Error(data.error || 'Failed to fetch images')
          }

          allResults.push(...data.data)
        }

        // Cache the results
        imageCache.set(cacheKey, allResults)

        // Update state
        const newImageData = { ...imageData }
        allResults.forEach((item) => {
          newImageData[item.item_id] = item
        })
        setImageData(newImageData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load images'
        setError(errorMessage)
        console.error('Error loading item images:', err)
      } finally {
        setLoading(false)
      }
    },
    [imageData]
  )

  const getImageUrl = useCallback(
    (itemId: number, fallback: string = '/placeholder-product.svg'): string => {
      const data = imageData[itemId]
      return data?.primary_image_url || fallback
    },
    [imageData]
  )

  const hasImages = useCallback(
    (itemId: number): boolean => {
      const data = imageData[itemId]
      return data?.has_images || false
    },
    [imageData]
  )

  const clearCache = useCallback(() => {
    imageCache.clear()
    setImageData({})
  }, [])

  return {
    imageData,
    loading,
    error,
    loadImages,
    getImageUrl,
    hasImages,
    clearCache,
  }
}

// Hook for single item image loading
export function useItemImage(
  item: WPSItem | null,
  style: 'thumbnail' | 'card' | 'detail' | 'full' = 'card'
) {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder-product.svg')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!item) {
      setImageUrl('/placeholder-product.svg')
      return
    }

    // Check if item already has images in the correct format
    if (ImageUtils.hasImages(item)) {
      try {
        const url = ImageUtils.getOptimizedImageUrl(item, style, '/placeholder-product.svg')
        setImageUrl(url)
        setError(null)
        return
      } catch (err) {
        console.warn('Error building image URL from item data:', err)
      }
    }

    // If no images or error, try to fetch them
    const fetchImage = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/items/${item.id}/images?style=${style}`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.data.primary_image_url) {
          setImageUrl(data.data.primary_image_url)
        } else {
          setImageUrl('/placeholder-product.svg')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load image'
        setError(errorMessage)
        setImageUrl('/placeholder-product.svg')
        console.error('Error loading item image:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [item, style])

  return {
    imageUrl,
    loading,
    error,
    hasImages: item ? ImageUtils.hasImages(item) : false,
  }
}
