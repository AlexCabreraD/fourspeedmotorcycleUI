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
        // Fetch both products and brands in parallel
        const [productsResponse, brandsResponse] = await Promise.all([
          fetch('/api/products?page=12&sort=newest'),
          fetch('/api/brands?page=1000') // Get a large set of brands
        ])
        
        const [productsData, brandsData] = await Promise.all([
          productsResponse.json(),
          brandsResponse.json()
        ])
        
        // Create brand lookup map
        const brandMap: Record<number, { id: number; name: string }> = {}
        if (brandsData.success && brandsData.data) {
          brandsData.data.forEach((brand: { id: number; name: string }) => {
            brandMap[brand.id] = brand
          })
        }
        
        if (productsData.success && productsData.data) {
          // Extract items from products - each product contains items
          const allItems: WPSItem[] = []
          productsData.data.forEach((product: { items?: { data?: WPSItem[] } }) => {
            if (product.items && product.items.data) {
              allItems.push(...product.items.data)
            }
          })
          
          // Enhance items with brand data
          const featuredItems = allItems.slice(0, 8).map(item => ({
            ...item,
            brand: item.brand_id ? { data: brandMap[item.brand_id] } : undefined
          }))
          
          setProducts(featuredItems)
        }
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