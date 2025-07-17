'use client'

import { useState, useEffect } from 'react'
import { WPSItem, createWPSClient } from '@/lib/api/wps-client'
import ProductCard from '@/components/products/ProductCard'
import { useItemImages } from '@/hooks/useItemImages'

export default function TestImagesPage() {
  const [items, setItems] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(false)
  const { imageData, loadImages, getImageUrl } = useItemImages()

  const fetchTestItems = async () => {
    setLoading(true)
    try {
      const client = createWPSClient({ enableCaching: true })
      
      // Create a query to get items with images
      const query = client.createQuery()
        .includeImages()
        .includeBrand()
        .pageSize(12)
        .sortByName('asc')

      const response = await client.executeQuery<WPSItem[]>('items', query)
      
      if (response.data) {
        setItems(response.data)
        
        // Pre-load images for all items
        const itemIds = response.data.map(item => item.id)
        await loadImages(itemIds, 'card')
      }
    } catch (error) {
      console.error('Failed to fetch test items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestItems()
  }, [])

  return (
    <div className="min-h-screen bg-steel-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Image Loading Test
          </h1>
          <p className="text-lg text-steel-600 max-w-3xl">
            Testing the new enhanced image loading system with smart caching, 
            fallbacks, and loading states. Images are fetched using the improved WPS API integration.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{items.length}</div>
              <div className="text-sm text-steel-600">Items Loaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(imageData).filter(img => img.has_images).length}
              </div>
              <div className="text-sm text-steel-600">With Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-steel-500">
                {Object.values(imageData).filter(img => !img.has_images).length}
              </div>
              <div className="text-sm text-steel-600">Placeholder Only</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <button
            onClick={fetchTestItems}
            disabled={loading}
            className="btn btn-primary mr-4"
          >
            {loading ? 'Loading...' : 'Reload Test Items'}
          </button>
          
          <button
            onClick={() => {
              const itemIds = items.map(item => item.id)
              loadImages(itemIds, 'detail')
            }}
            className="btn btn-outline"
          >
            Load Detail Images
          </button>
        </div>

        {/* Test Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-steel-600">Loading test items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="space-y-2">
                <ProductCard 
                  product={item} 
                  viewMode="grid"
                />
                
                {/* Debug Info */}
                <div className="text-xs bg-steel-100 p-2 rounded">
                  <div><strong>ID:</strong> {item.id}</div>
                  <div><strong>SKU:</strong> {item.sku}</div>
                  <div><strong>Has Images:</strong> {imageData[item.id]?.has_images ? '✅' : '❌'}</div>
                  <div><strong>Image Count:</strong> {imageData[item.id]?.image_count || 0}</div>
                  {imageData[item.id]?.primary_image_url && (
                    <div className="mt-1">
                      <strong>URL:</strong> 
                      <div className="text-xs text-steel-500 break-all">
                        {imageData[item.id].primary_image_url.slice(0, 60)}...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Loading Stats */}
        {items.length > 0 && (
          <div className="mt-12 bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold text-steel-900 mb-4">Image Loading Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-steel-800 mb-2">Items with Images</h4>
                <div className="space-y-1">
                  {Object.values(imageData)
                    .filter(img => img.has_images)
                    .slice(0, 5)
                    .map(img => (
                      <div key={img.item_id} className="flex justify-between text-sm">
                        <span>{img.item_sku}</span>
                        <span className="text-green-600">{img.image_count} images</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-steel-800 mb-2">Items without Images</h4>
                <div className="space-y-1">
                  {Object.values(imageData)
                    .filter(img => !img.has_images)
                    .slice(0, 5)
                    .map(img => (
                      <div key={img.item_id} className="flex justify-between text-sm">
                        <span>{img.item_sku}</span>
                        <span className="text-steel-500">No images</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}