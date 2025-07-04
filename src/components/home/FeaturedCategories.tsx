'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FALLBACK_CATEGORIES, getCategoryVisual, Category } from '@/lib/constants/categories'

// Show top 6 categories for homepage
const fallbackCategories = FALLBACK_CATEGORIES.slice(0, 6)

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?level=main')
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data.slice(0, 6)) // Show top 6 categories
        } else {
          // Use fallback categories if API doesn't return data
          setCategories(fallbackCategories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Use fallback categories on error
        setCategories(fallbackCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])


  if (loading) {
    return (
      <section className="py-16 bg-steel-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-steel-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-steel-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-steel-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-steel-600 max-w-2xl mx-auto">
            Find exactly what you need for your ride. From performance upgrades to essential maintenance parts.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const visual = getCategoryVisual(category.slug)
            
            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-white shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-8 h-48 flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-4">{visual.icon}</div>
                    <h3 className="text-xl font-semibold text-steel-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-steel-600 text-sm">
                      {category.description || `Premium ${category.name.toLowerCase()} parts and accessories`}
                    </p>
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

        {/* View All Categories CTA */}
        <div className="text-center">
          <Link
            href="/categories"
            className="btn btn-outline btn-lg inline-flex items-center"
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}