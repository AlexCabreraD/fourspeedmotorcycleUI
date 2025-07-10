'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WPSItem } from '@/lib/api/wps-client'
import ProductCard from '@/components/products/ProductCard'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define popular motorcycle categories for curation
        const popularCategories = [
          'Suspension',
          'Exhaust', 
          'Brakes',
          'Engine',
          'Electrical',
          'Body',
          'Wheels',
          'Drive'
        ]
        
        // Fetch 2 items from each popular category (in stock only)
        const categoryPromises = popularCategories.map(category =>
          fetch(`/api/products?item_types=${encodeURIComponent(category)}&in_stock=true&page=2&sort=newest`)
            .then(res => res.json())
        )
        
        // Also fetch brands for enhancement
        const brandsPromise = fetch('/api/brands?page=1000').then(res => res.json())
        
        const [brandsData, ...categoryResults] = await Promise.all([
          brandsPromise,
          ...categoryPromises
        ])
        
        // Create brand lookup map
        const brandMap: Record<number, { id: number; name: string }> = {}
        if (brandsData.success && brandsData.data) {
          brandsData.data.forEach((brand: { id: number; name: string }) => {
            brandMap[brand.id] = brand
          })
        }
        
        // Collect items from each category
        const featuredItems: WPSItem[] = []
        
        categoryResults.forEach((categoryData, index) => {
          if (categoryData.success && categoryData.data) {
            // Extract items from products in this category
            const categoryItems: WPSItem[] = []
            categoryData.data.forEach((product: { items?: { data?: WPSItem[] } }) => {
              if (product.items && product.items.data) {
                // Filter for in-stock items only
                const inStockItems = product.items.data.filter((item: WPSItem) => 
                  item.status === 'STK' || item.status === 'LTD'
                )
                categoryItems.push(...inStockItems)
              }
            })
            
            // Take first item from this category (if any)
            if (categoryItems.length > 0) {
              const item = categoryItems[0]
              featuredItems.push({
                ...item,
                brand: item.brand_id ? { data: brandMap[item.brand_id] } : undefined,
                // Add category for debugging/display
                _featuredCategory: popularCategories[index]
              })
            }
          }
        })
        
        // If we don't have 8 items, fill with newest in-stock items
        if (featuredItems.length < 8) {
          try {
            const fallbackResponse = await fetch('/api/products?in_stock=true&sort=newest&page=5')
            const fallbackData = await fallbackResponse.json()
            
            if (fallbackData.success && fallbackData.data) {
              const fallbackItems: WPSItem[] = []
              fallbackData.data.forEach((product: { items?: { data?: WPSItem[] } }) => {
                if (product.items && product.items.data) {
                  const inStockItems = product.items.data.filter((item: WPSItem) => 
                    item.status === 'STK' || item.status === 'LTD'
                  )
                  fallbackItems.push(...inStockItems)
                }
              })
              
              // Add unique items (not already in featuredItems)
              const existingIds = new Set(featuredItems.map(item => item.id))
              const uniqueFallbacks = fallbackItems
                .filter(item => !existingIds.has(item.id))
                .slice(0, 8 - featuredItems.length)
                .map(item => ({
                  ...item,
                  brand: item.brand_id ? { data: brandMap[item.brand_id] } : undefined
                }))
              
              featuredItems.push(...uniqueFallbacks)
            }
          } catch (fallbackError) {
            console.warn('Failed to fetch fallback products:', fallbackError)
          }
        }
        
        // Limit to 8 items total
        setProducts(featuredItems.slice(0, 8))
        
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-steel-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-steel-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-steel-600 max-w-2xl mx-auto">
            Discover our most popular and highest-rated motorcycle parts and accessories.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              viewMode="grid"
            />
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="btn btn-outline btn-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}