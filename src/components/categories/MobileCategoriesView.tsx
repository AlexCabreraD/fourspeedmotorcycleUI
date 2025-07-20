'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package } from 'lucide-react'
import { CustomCategory, CUSTOM_CATEGORIES } from '@/lib/constants/custom-categories'

export default function MobileCategoriesView() {
  const [categories, setCategories] = useState<CustomCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/custom-categories?include_counts=true')
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data)
        } else {
          setCategories(CUSTOM_CATEGORIES)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(CUSTOM_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black -mt-[72px]">
        {/* Hero Loading - Matches current h-[60vh] hero */}
        <div className="relative h-[60vh] overflow-hidden bg-steel-900 pt-[72px]">
          <div className="absolute inset-0 bg-steel-600 animate-pulse" />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Content - Bottom Positioned */}
          <div className="relative h-full flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-20 md:pb-24">
              <div className="max-w-2xl space-y-4 sm:space-y-6 text-white">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-20 h-4 bg-orange-500/60 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-48 h-8 bg-white/20 rounded-lg animate-pulse" />
                    <div className="w-32 h-8 bg-white/15 rounded-lg animate-pulse" />
                  </div>
                  <div className="w-80 h-5 bg-white/10 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Categories Loading - Matches current card layout */}
        <div className="space-y-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="relative h-96 sm:h-112 overflow-hidden">
              <div className="absolute inset-0 bg-steel-200 animate-pulse" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="w-6 h-6 bg-orange-500/60 rounded-full mb-2 animate-pulse" />
                    <div className="w-32 h-5 bg-steel-200 rounded mb-1 animate-pulse" />
                    <div className="w-48 h-4 bg-steel-200 rounded animate-pulse" />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/60 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black -mt-[72px]">
      {/* Hero Section - Matches Home Page Layout */}
      <div className="relative h-[60vh] overflow-hidden bg-steel-900 pt-[72px]">
        <div className="absolute inset-0">
          <Image
            src="/images/assets/categories-hero-air-filter-dramatic.JPG"
            alt="Categories Hero"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </div>
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content - Bottom Positioned */}
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-20 md:pb-24">
            <div className="max-w-2xl space-y-4 sm:space-y-6 text-white">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-primary-300 font-medium text-xs sm:text-sm tracking-[0.2em] uppercase">
                  Categories
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  Every Detail
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    Matters
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-steel-100 leading-relaxed max-w-lg">
                  Find the perfect parts for your motorcycle across all our specialized categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-0">
        {/* Hero Section (matches desktop hero) */}
        <Link href="/categories" className="group block">
          <div className="relative h-96 sm:h-112 overflow-hidden">
            <Image
              src="/images/assets/categories-hero-air-filter-dramatic.JPG"
              alt="Every Detail Matters"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">
                    01
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-black text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                    Performance Engineering
                  </h3>
                  <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                    Precision parts engineered for peak performance and reliability
                  </p>
                </div>
                <div className="flex items-center ml-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Engine & Performance */}
        {categories.find(cat => cat.slug === 'engine-performance') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'engine-performance')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src={categories.find(cat => cat.slug === 'engine-performance')?.image || "/images/assets/engine-performance-placeholder.jpg"}
                alt={categories.find(cat => cat.slug === 'engine-performance')?.name || "Engine & Performance"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">02</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'engine-performance')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'engine-performance')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Suspension & Handling */}
        {categories.find(cat => cat.slug === 'suspension-handling') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'suspension-handling')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src={categories.find(cat => cat.slug === 'suspension-handling')?.image || "/images/assets/suspension-handling-placeholder.jpg"}
                alt={categories.find(cat => cat.slug === 'suspension-handling')?.name || "Suspension & Handling"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">03</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'suspension-handling')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'suspension-handling')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Wheels & Tires */}
        {categories.find(cat => cat.slug === 'wheels-tires') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'wheels-tires')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src={categories.find(cat => cat.slug === 'wheels-tires')?.image || "/images/assets/wheels-tires-placeholder.jpg"}
                alt={categories.find(cat => cat.slug === 'wheels-tires')?.name || "Wheels & Tires"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">04</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'wheels-tires')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'wheels-tires')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Protective Gear */}
        {categories.find(cat => cat.slug === 'protective-gear') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'protective-gear')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src="/images/assets/protective-gear-female-rider-harley.JPG"
                alt="Protective Gear - Female Rider with Harley"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">05</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'protective-gear')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'protective-gear')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Riding Apparel */}
        {categories.find(cat => cat.slug === 'riding-apparel') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'riding-apparel')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src="/images/assets/riding-apparel-sport-rider-gear.JPG"
                alt="Riding Apparel - Sport Rider Gear"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">06</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'riding-apparel')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'riding-apparel')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Brakes & Drivetrain */}
        {categories.find(cat => cat.slug === 'brakes-drivetrain') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'brakes-drivetrain')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src={categories.find(cat => cat.slug === 'brakes-drivetrain')?.image || "/images/assets/brakes-drivetrain-placeholder.jpg"}
                alt={categories.find(cat => cat.slug === 'brakes-drivetrain')?.name || "Brakes & Drivetrain"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">07</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'brakes-drivetrain')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'brakes-drivetrain')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Controls & Accessories */}
        {categories.find(cat => cat.slug === 'controls-accessories') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'controls-accessories')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src="/images/assets/controls-accessories-red-footpegs.JPG"
                alt="Controls & Accessories - Precision Engineering"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">08</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'controls-accessories')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'controls-accessories')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Maintenance & Tools */}
        {categories.find(cat => cat.slug === 'maintenance-tools') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'maintenance-tools')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src="/images/assets/maintenance-tools-workshop-gear.JPG"
                alt="Maintenance & Tools - Workshop Setup"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">09</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'maintenance-tools')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'maintenance-tools')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Specialty Vehicles */}
        {categories.find(cat => cat.slug === 'specialty-vehicles') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'specialty-vehicles')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src="/images/assets/specialty-vehicles-utv-rock-crawling.JPG"
                alt="Specialty Vehicles - UTV Rock Crawling"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">10</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'specialty-vehicles')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'specialty-vehicles')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Electrical & Lighting */}
        {categories.find(cat => cat.slug === 'electrical-lighting') && (
          <Link href={`/category/${categories.find(cat => cat.slug === 'electrical-lighting')?.slug}`} className="group block">
            <div className="relative h-96 sm:h-112 overflow-hidden">
              <Image
                src="/images/assets/electrical-lighting-extreme-wall-ride.JPG"
                alt="Electrical & Lighting - Extreme Performance"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">11</div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                      {categories.find(cat => cat.slug === 'electrical-lighting')?.name}
                    </h3>
                    <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                      {categories.find(cat => cat.slug === 'electrical-lighting')?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Final CTA Section */}
        <Link href="/products" className="group block">
          <div className="relative h-96 sm:h-112 overflow-hidden">
            <Image
              src="/images/assets/utv-action-dust-dramatic.JPG"
              alt="Extreme Off-Road Action"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 group-hover:bg-white/95 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold mb-2">12</div>
                  <h3 className="text-lg sm:text-xl font-display font-black text-steel-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                    Push Limits
                  </h3>
                  <p className="text-steel-600 text-xs sm:text-sm line-clamp-2 max-w-md">
                    From street to track, dirt to dunes. Every part engineered for riders who demand more.
                  </p>
                </div>
                <div className="flex items-center ml-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom CTA Section */}
      <div className="px-4 pb-8">
        <div className="mt-8 text-center bg-steel-50 rounded-2xl p-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-steel-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-steel-600 mb-6 max-w-2xl mx-auto">
            Browse our complete catalog of motorcycle parts and accessories, or get expert help finding the perfect components for your ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors duration-300"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-steel-300 text-steel-900 font-bold rounded-full hover:border-steel-400 transition-colors duration-300"
            >
              Get Expert Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}