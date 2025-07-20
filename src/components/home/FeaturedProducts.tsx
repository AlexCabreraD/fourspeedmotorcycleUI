'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { WPSItem } from '@/lib/api/wps-client'
import ProductCard from '@/components/products/ProductCard'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Optimized: Direct WPS items API call for maximum performance
        // Fetch exactly 4 featured products with all needed data
        const response = await fetch('/api/items?' + new URLSearchParams({
          'page[size]': '4',
          'sort[desc]': 'updated_at',
          'filter[status]': 'STK',
          'include': 'images,brand,product',
          'filter[list_price][gte]': '25' // Quality items only
        }))
        const data = await response.json()
        
        if (data.success && data.data) {
          // Direct use of WPS items - no extraction needed
          setProducts(data.data)
        }
        
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Memoize product grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => 
    products.map((product) => (
      <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <ProductCard 
          product={product} 
          viewMode="grid"
        />
      </div>
    )), 
    [products]
  )


  if (loading) {
    return (
      <section className="py-16 bg-steel-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-steel-300 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-steel-300 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-steel-200 via-steel-300 to-steel-200" />
                <div className="p-4">
                  <div className="h-4 bg-steel-200 rounded w-full mb-2" />
                  <div className="h-4 bg-steel-200 rounded w-3/4 mb-3" />
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-6 bg-green-200 rounded w-20" />
                    <div className="h-4 bg-steel-200 rounded w-16" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-steel-200 rounded w-full" />
                    <div className="h-3 bg-steel-200 rounded w-2/3" />
                  </div>
                  <div className="mt-4">
                    <div className="h-10 bg-orange-200 rounded-lg w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-steel-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-steel-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            High-performance parts built to last
          </p>
        </div>

        {/* Optimized 4-Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {productGrid}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}