'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import CustomCategoryFilters from '@/components/products/CustomCategoryFilters'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { WPSItem } from '@/lib/api/wps-client'
import { WPS_CATEGORIES, FALLBACK_CATEGORIES, Category } from '@/lib/constants/categories'

interface CategoryPageProps {
  slug: string
  searchParams: { [key: string]: string | string[] | undefined }
}

interface CategoryData extends Category {
  children?: any[]
}

interface BreadcrumbItem {
  id: string | number
  name: string
  slug: string
}

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'created_asc', label: 'Oldest Created First' },
  { value: 'updated_desc', label: 'Recently Updated' }
]


export default function CategoryPage({ slug, searchParams }: CategoryPageProps) {
  const [category, setCategory] = useState<CategoryData | null>(null)
  const [products, setProducts] = useState<WPSItem[]>([])
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const router = useRouter()

  // Extract filters from search params with support for arrays
  const currentPage = Number(searchParams.page) || 1
  const sortBy = (searchParams.sort as string) || 'name_asc'
  
  // Convert search params to filter object
  const extractedFilters = useMemo(() => {
    const filters: Record<string, string | string[]> = {}
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === 'page' || key === 'sort') return
      
      if (Array.isArray(value)) {
        filters[key] = value
      } else if (typeof value === 'string' && value) {
        // Check if it's a comma-separated value that should be an array
        if (key.includes('_type') || key.includes('_size') || key === 'color' || key === 'size') {
          filters[key] = value.split(',')
        } else {
          filters[key] = value
        }
      }
    })
    
    // Set "in stock only" as default if not explicitly set
    if (!filters.hasOwnProperty('in_stock')) {
      filters.in_stock = ['true']
    }
    
    return filters
  }, [searchParams])

  // Fetch category data
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true)
      
      try {
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesData.success) {
          let foundCategory = categoriesData.data.find((cat: any) => cat.slug === slug)
          
          if (!foundCategory) {
            foundCategory = WPS_CATEGORIES.find(cat => cat.slug === slug) || 
                          FALLBACK_CATEGORIES.find(cat => cat.slug === slug)
          }
          
          if (!foundCategory) {
            setLoading(false)
            return
          }

          setCategory(foundCategory)
          setBreadcrumb([{
            id: foundCategory.id,
            name: foundCategory.name,
            slug: foundCategory.slug
          }])
        } else {
          const foundCategory = WPS_CATEGORIES.find(cat => cat.slug === slug) || 
                                FALLBACK_CATEGORIES.find(cat => cat.slug === slug)
          
          if (foundCategory) {
            setCategory(foundCategory)
            setBreadcrumb([{
              id: foundCategory.id,
              name: foundCategory.name,
              slug: foundCategory.slug
            }])
          }
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error)
        const foundCategory = WPS_CATEGORIES.find(cat => cat.slug === slug) || 
                              FALLBACK_CATEGORIES.find(cat => cat.slug === slug)
        
        if (foundCategory) {
          setCategory(foundCategory)
          setBreadcrumb([{
            id: foundCategory.id,
            name: foundCategory.name,
            slug: foundCategory.slug
          }])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [slug])

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return
      
      setProductsLoading(true)
      // Reset pagination state when filters/sort change
      setProducts([])
      setTotalLoaded(0)
      setHasMore(false)
      setNextCursor(null)
      
      try {
        // Use our new custom category API for all categories
        const params = new URLSearchParams()
        params.set('page', '21')
        params.set('sort', sortBy)
        
        // Add all filters to params
        Object.entries(extractedFilters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','))
            }
          } else if (value) {
            params.set(key, value)
          }
        })

        // Use the new custom category API endpoint
        const apiEndpoint = `/api/custom-categories/${category.slug}/items`
        const response = await fetch(`${apiEndpoint}?${params.toString()}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          // Reset products for new search/filter (first page)
          // Filter out duplicates by ID
          const uniqueProducts = data.data.filter((product: WPSItem, index: number, self: WPSItem[]) => 
            index === self.findIndex(p => p.id === product.id)
          )
          setProducts(uniqueProducts)
          setTotalLoaded(uniqueProducts.length)
          setHasMore(!!data.has_more)
          setNextCursor(data.meta?.cursor?.next || null)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setProductsLoading(false)
      }
    }

    if (category && !loading) {
      fetchProducts()
    }
  }, [category, sortBy, extractedFilters, currentPage, loading])

  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    const params = new URLSearchParams()
    
    // Add sort parameter
    if (sortBy) {
      params.set('sort', sortBy)
    }
    
    // Add all new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','))
        }
      } else if (value) {
        params.set(key, value)
      }
    })
    
    // Reset page when filters change
    router.push(`/category/${slug}?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    handleFilterChange({ sort: newSort })
  }

  const loadMoreProducts = async () => {
    if (!category || !hasMore || !nextCursor || loadingMore) return
    
    setLoadingMore(true)
    
    try {
      // Use our new custom category API for load more
      const params = new URLSearchParams()
      params.set('cursor', nextCursor)
      params.set('page', '21')
      params.set('sort', sortBy)
      
      // Add all filters to params for load more
      Object.entries(extractedFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else if (value) {
          params.set(key, value)
        }
      })

      // Use the new custom category API endpoint
      const apiEndpoint = `/api/custom-categories/${category.slug}/items`
      const response = await fetch(`${apiEndpoint}?${params.toString()}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        // Append new products to existing ones, filtering out duplicates
        let newUniqueCount = 0
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const newUniqueProducts = data.data.filter((product: WPSItem) => !existingIds.has(product.id))
          newUniqueCount = newUniqueProducts.length
          return [...prev, ...newUniqueProducts]
        })
        setTotalLoaded(prev => prev + newUniqueCount)
        setHasMore(!!data.has_more)
        setNextCursor(data.meta?.cursor?.next || null)
      }
    } catch (error) {
      console.error('Failed to load more products:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-steel-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-steel-200 rounded w-48 mb-6" />
            <div className="h-10 bg-steel-200 rounded w-64 mb-4" />
            <div className="h-4 bg-steel-200 rounded w-96 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="h-96 bg-steel-200 rounded" />
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-80 bg-steel-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-steel-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-steel-900 mb-4">Category Not Found</h1>
          <p className="text-steel-600 mb-8">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-steel-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories' },
            ...breadcrumb.map(item => ({
              name: item.name,
              href: `/category/${item.slug}`
            }))
          ]}
        />

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-steel-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-steel-600 max-w-3xl">
              {category.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-6">
            <p className="text-steel-600">
              {totalLoaded > 0 ? (
                hasMore ? 
                  `${totalLoaded}+ products found` : 
                  `${totalLoaded} ${totalLoaded === 1 ? 'product' : 'products'} found`
              ) : 'No products found'}
            </p>
            
            {/* View Toggle & Sort - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="form-input py-2 px-3 text-sm"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn btn-outline btn-sm flex items-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
            <CustomCategoryFilters
              categorySlug={category.slug}
              selectedFilters={extractedFilters}
              onFilterChange={handleFilterChange}
              isLoading={productsLoading}
              isMobile={false}
            />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-80 bg-steel-200 rounded animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
                
                {/* Show More Button */}
                {hasMore && !productsLoading && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMoreProducts}
                      disabled={loadingMore}
                      className="btn btn-outline btn-lg inline-flex items-center"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          Show More Products
                          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-sm text-steel-600 mt-2 mb-8">
                      {hasMore ? 
                        `Loaded ${products.length} products • More available` :
                        `All ${products.length} products loaded`
                      }
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-steel-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-steel-900 mb-2">
                  No products found
                </h3>
                <p className="text-steel-600 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="btn btn-outline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}