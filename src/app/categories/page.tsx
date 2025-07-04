'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Package } from 'lucide-react'
import { FALLBACK_CATEGORIES, getCategoryVisual, Category } from '@/lib/constants/categories'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data)
        } else {
          // Use fallback categories if API doesn't return data
          setCategories(FALLBACK_CATEGORIES)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Use fallback categories on error
        setCategories(FALLBACK_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="h-12 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-steel-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-48 bg-steel-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-steel-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-steel-600 max-w-3xl mx-auto">
            Browse our complete selection of motorcycle parts and accessories organized by category. 
            Find exactly what you need for your ride.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => {
            const visual = getCategoryVisual(category.slug)
            
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-white border border-steel-200 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-6 h-48 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl mb-4">{visual.icon}</div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-steel-600 text-sm mb-3 line-clamp-2">
                      {category.description || `Premium ${category.name.toLowerCase()} parts and accessories`}
                    </p>
                    {category.itemCount && (
                      <p className="text-xs text-steel-500">
                        {category.itemCount} products
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                    <span className="text-sm">Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-200 rounded-lg transition-colors duration-300" />
              </Link>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-steel-50 rounded-lg p-8 text-center">
          <Package className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-steel-900 mb-2">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-steel-600 mb-6">
            Use our search function or contact our parts specialists for assistance finding the right parts for your motorcycle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn btn-primary">
              Search Products
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}