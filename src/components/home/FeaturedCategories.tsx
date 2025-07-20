'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CustomCategory, getFeaturedCategories } from '@/lib/constants/custom-categories'

// Show featured categories for homepage
const fallbackCategories = getFeaturedCategories()

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<CustomCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use fallback categories immediately for instant load
        setCategories(fallbackCategories)
        setLoading(false)
        
        // Optionally fetch fresh data in background for future updates
        const response = await fetch('/api/custom-categories?type=featured')
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data) // Update if API returns better data
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Already using fallback categories
      }
    }

    fetchCategories()
  }, [])


  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-steel-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-steel-200 via-steel-300 to-steel-200" />
                <div className="p-6">
                  <div className="h-6 bg-steel-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-steel-200 rounded w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-orange-200 rounded w-16" />
                    <div className="h-8 w-8 bg-steel-200 rounded-full" />
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-steel-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            Find the perfect parts for your ride
          </p>
        </div>

        {/* Clean Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Category Image */}
                <div className="w-full h-48 relative">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${category.gradient}`}>
                      <div className="flex items-center justify-center h-full text-4xl">
                        {category.icon}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                
                {/* Simple Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-steel-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-steel-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700">
                    <span className="text-sm">Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}