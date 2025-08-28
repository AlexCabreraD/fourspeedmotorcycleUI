'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Breadcrumb from '@/components/ui/Breadcrumb'
import { useOptimizedSearch } from '@/hooks/useOptimizedSearch'
import { WPSItem } from '@/lib/api/wps-client'
import { Category, FALLBACK_CATEGORIES, WPS_CATEGORIES } from '@/lib/constants/categories'

import OptimizedProductGrid from './OptimizedProductGrid'
import OptimizedSearchBar from './OptimizedSearchBar'

// Dynamic imports for better performance
const AdvancedCategoryFilters = dynamic(() => import('./AdvancedCategoryFilters'), {
  loading: () => (
    <div className='bg-white rounded-lg p-6'>
      <div className='animate-pulse space-y-4'>
        <div className='h-4 bg-steel-200 rounded w-3/4' />
        <div className='h-8 bg-steel-200 rounded' />
        <div className='h-4 bg-steel-200 rounded w-1/2' />
      </div>
    </div>
  ),
})

interface OptimizedCategoryPageProps {
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
  { value: 'updated_desc', label: 'Recently Updated' },
]

// Cache for API responses
const apiCache = new Map<
  string,
  {
    data: any
    timestamp: number
  }
>()

const API_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function OptimizedCategoryPage({ slug, searchParams }: OptimizedCategoryPageProps) {
  // Core state
  const [category, setCategory] = useState<CategoryData | null>(null)
  const [products, setProducts] = useState<WPSItem[]>([])
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filter state (simplified)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({})
  const [newArrivalsFilter, setNewArrivalsFilter] = useState('')
  const [recentlyUpdatedFilter, setRecentlyUpdatedFilter] = useState('')
  const [weightRange, setWeightRange] = useState({ min: '', max: '' })
  const [dimensionFilters, setDimensionFilters] = useState({
    length: { min: '', max: '' },
    width: { min: '', max: '' },
    height: { min: '', max: '' },
  })
  const [brandSearchTerm, setBrandSearchTerm] = useState('')

  // Refs for optimization
  const filterCache = useRef<
    Map<
      string,
      {
        products: WPSItem[]
        nextCursor: string | null
        hasMore: boolean
        timestamp: number
      }
    >
  >(new Map())

  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  // Extract current filters from search params
  const currentFilters = useMemo(() => {
    const filters: Record<string, string | string[]> = {}

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === 'page' || key === 'sort') {
        return
      }

      if (Array.isArray(value)) {
        filters[key] = value
      } else if (typeof value === 'string' && value) {
        if (key.includes('_type') || key.includes('_size') || key === 'color' || key === 'size') {
          filters[key] = value.split(',')
        } else {
          filters[key] = value
        }
      }
    })

    // Default to in-stock only
    if (!filters.hasOwnProperty('in_stock')) {
      filters.in_stock = ['true']
    }

    return filters
  }, [searchParams])

  const sortBy = (searchParams.sort as string) || 'name_asc'

  // Optimized filter params builder
  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams()
    params.set('page', '21')
    params.set('sort', sortBy)

    // Add current filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','))
        }
      } else if (value) {
        params.set(key, value)
      }
    })

    // Add advanced filters
    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','))
    }

    // Price range filters
    if (priceRange.min) {
      params.set('min_price', priceRange.min)
    }
    if (priceRange.max) {
      params.set('max_price', priceRange.max)
    }

    // New arrivals filter
    if (newArrivalsFilter) {
      const now = new Date()
      const daysAgo = new Date(now.getTime() - parseInt(newArrivalsFilter) * 24 * 60 * 60 * 1000)
      params.set('created_after', daysAgo.toISOString().split('T')[0])
    }

    // Recently updated filter
    if (recentlyUpdatedFilter) {
      const now = new Date()
      const daysAgo = new Date(
        now.getTime() - parseInt(recentlyUpdatedFilter) * 24 * 60 * 60 * 1000
      )
      params.set('updated_after', daysAgo.toISOString().split('T')[0])
    }

    // Weight range filters
    if (weightRange.min) {
      params.set('min_weight', weightRange.min)
    }
    if (weightRange.max) {
      params.set('max_weight', weightRange.max)
    }

    // Dimension filters
    if (dimensionFilters.length.min) {
      params.set('min_length', dimensionFilters.length.min)
    }
    if (dimensionFilters.length.max) {
      params.set('max_length', dimensionFilters.length.max)
    }
    if (dimensionFilters.width.min) {
      params.set('min_width', dimensionFilters.width.min)
    }
    if (dimensionFilters.width.max) {
      params.set('max_width', dimensionFilters.width.max)
    }
    if (dimensionFilters.height.min) {
      params.set('min_height', dimensionFilters.height.min)
    }
    if (dimensionFilters.height.max) {
      params.set('max_height', dimensionFilters.height.max)
    }

    return params.toString()
  }, [
    currentFilters,
    sortBy,
    selectedBrands,
    priceRange,
    newArrivalsFilter,
    recentlyUpdatedFilter,
    weightRange,
    dimensionFilters,
  ])

  // Initialize search hook
  const {
    searchTerm,
    searchType,
    searchResults,
    isSearching,
    isSearchActive,
    searchHasMore,
    handleSearchChange,
    handleSearchTypeChange,
    clearSearch,
    loadMoreSearchResults,
    cleanup: cleanupSearch,
  } = useOptimizedSearch({
    categorySlug: slug,
    buildFilterParams,
  })

  // Cache utilities
  const isCacheValid = useCallback((timestamp: number) => {
    return Date.now() - timestamp < API_CACHE_DURATION
  }, [])

  const createCacheKey = useCallback(
    (cursor?: string) => {
      const filterParams = buildFilterParams()
      return cursor ? `${filterParams}&cursor=${cursor}` : filterParams
    },
    [buildFilterParams]
  )

  // Optimized category data fetching
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true)

      const cacheKey = `category:${slug}`
      const cachedData = apiCache.get(cacheKey)

      if (cachedData && isCacheValid(cachedData.timestamp)) {
        setCategory(cachedData.data)
        setBreadcrumb([
          {
            id: cachedData.data.id,
            name: cachedData.data.name,
            slug: cachedData.data.slug,
          },
        ])
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/categories')
        const categoriesData = await response.json()

        let foundCategory = null

        if (categoriesData.success) {
          foundCategory = categoriesData.data.find((cat: any) => cat.slug === slug)
        }

        if (!foundCategory) {
          foundCategory =
            WPS_CATEGORIES.find((cat) => cat.slug === slug) ||
            FALLBACK_CATEGORIES.find((cat) => cat.slug === slug)
        }

        if (foundCategory) {
          // Cache the result
          apiCache.set(cacheKey, {
            data: foundCategory,
            timestamp: Date.now(),
          })

          setCategory(foundCategory)
          setBreadcrumb([
            {
              id: foundCategory.id,
              name: foundCategory.name,
              slug: foundCategory.slug,
            },
          ])
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error)

        // Fallback to static categories
        const foundCategory =
          WPS_CATEGORIES.find((cat) => cat.slug === slug) ||
          FALLBACK_CATEGORIES.find((cat) => cat.slug === slug)

        if (foundCategory) {
          setCategory(foundCategory)
          setBreadcrumb([
            {
              id: foundCategory.id,
              name: foundCategory.name,
              slug: foundCategory.slug,
            },
          ])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [slug, isCacheValid])

  // Optimized products fetching
  const fetchProducts = useCallback(
    async (cursor?: string, reset: boolean = false) => {
      if (!category) {
        return
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const isInitialLoad = !cursor
      const cacheKey = createCacheKey(cursor)

      // Check cache for non-search requests
      if (!isSearchActive) {
        const cachedResult = filterCache.current.get(cacheKey)
        if (cachedResult && isCacheValid(cachedResult.timestamp)) {
          if (reset || isInitialLoad) {
            setProducts(cachedResult.products)
            setTotalLoaded(cachedResult.products.length)
          } else {
            setProducts((prev) => {
              const combined = [...prev, ...cachedResult.products]
              const deduplicated = combined.filter(
                (product, index, self) => index === self.findIndex((p) => p.id === product.id)
              )
              return deduplicated
            })
            setTotalLoaded((prev) => prev + cachedResult.products.length)
          }

          setNextCursor(cachedResult.nextCursor)
          setHasMore(cachedResult.hasMore)
          return
        }
      }

      // Set loading states
      if (isInitialLoad) {
        setProductsLoading(true)
        if (reset) {
          setProducts([])
          setTotalLoaded(0)
          setHasMore(false)
          setNextCursor(null)
        }
      } else {
        setLoadingMore(true)
      }

      try {
        const params = new URLSearchParams(buildFilterParams())
        if (cursor) {
          params.set('cursor', cursor)
        }

        const apiEndpoint = `/api/custom-categories/${category.slug}/items`
        const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()

        if (data.success && data.data && !abortController.signal.aborted) {
          const uniqueProducts = data.data.filter(
            (product: WPSItem, index: number, self: WPSItem[]) =>
              index === self.findIndex((p) => p.id === product.id)
          )

          const nextCursor = data.meta?.cursor?.next || null
          const hasMore = !!data.has_more

          // Cache the result for non-search requests
          if (!isSearchActive) {
            filterCache.current.set(cacheKey, {
              products: uniqueProducts,
              nextCursor,
              hasMore,
              timestamp: Date.now(),
            })
          }

          if (reset || isInitialLoad) {
            setProducts(uniqueProducts)
            setTotalLoaded(uniqueProducts.length)
          } else {
            setProducts((prev) => {
              const combined = [...prev, ...uniqueProducts]
              const deduplicated = combined.filter(
                (product, index, self) => index === self.findIndex((p) => p.id === product.id)
              )
              return deduplicated
            })
            setTotalLoaded((prev) => prev + uniqueProducts.length)
          }

          setHasMore(hasMore)
          setNextCursor(nextCursor)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Failed to fetch products:', error)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setProductsLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [category, createCacheKey, isCacheValid, isSearchActive, buildFilterParams]
  )

  // Fetch products when filters change
  useEffect(() => {
    if (loading || !category) {
      return
    }

    if (!isSearchActive) {
      fetchProducts(undefined, true)
    }
  }, [
    category,
    currentFilters,
    sortBy,
    loading,
    fetchProducts,
    isSearchActive,
    selectedBrands,
    priceRange,
    newArrivalsFilter,
    recentlyUpdatedFilter,
    weightRange,
    dimensionFilters,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSearch()
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [cleanupSearch])

  // Event handlers
  const handleFilterChange = useCallback(
    (newFilters: Record<string, string | string[]>) => {
      const params = new URLSearchParams()

      if (sortBy) {
        params.set('sort', sortBy)
      }

      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else if (value) {
          params.set(key, value)
        }
      })

      router.push(`/category/${slug}?${params.toString()}`)
    },
    [slug, sortBy, router]
  )

  const handleSortChange = useCallback(
    (newSort: string) => {
      const params = new URLSearchParams()
      params.set('sort', newSort)

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','))
          }
        } else if (value) {
          params.set(key, value)
        }
      })

      router.push(`/category/${slug}?${params.toString()}`)
    },
    [slug, currentFilters, router]
  )

  const handleLoadMore = useCallback(() => {
    if (isSearchActive) {
      loadMoreSearchResults()
    } else if (hasMore && nextCursor && !loadingMore) {
      fetchProducts(nextCursor, false)
    }
  }, [isSearchActive, loadMoreSearchResults, hasMore, nextCursor, loadingMore, fetchProducts])

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-steel-50 pt-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='h-6 bg-steel-200 rounded w-48 mb-6' />
            <div className='h-10 bg-steel-200 rounded w-64 mb-4' />
            <div className='h-4 bg-steel-200 rounded w-96 mb-8' />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='h-96 bg-steel-200 rounded' />
              <div className='md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className='h-80 bg-steel-200 rounded' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Category not found
  if (!category) {
    return (
      <div className='min-h-screen bg-steel-50 pt-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-2xl font-bold text-steel-900 mb-4'>Category Not Found</h1>
          <p className='text-steel-600 mb-8'>The category you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentProducts = isSearchActive ? searchResults : products
  const currentHasMore = isSearchActive ? searchHasMore : hasMore
  const currentCount = isSearchActive ? searchResults.length : totalLoaded

  return (
    <div className='min-h-screen bg-steel-50 pt-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Categories', href: '/categories' },
            ...breadcrumb.map((item) => ({
              name: item.name,
              href: `/category/${item.slug}`,
            })),
          ]}
        />

        {/* Category Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-display font-bold text-steel-900 mb-4'>{category.name}</h1>
          {category.description && (
            <p className='text-lg text-steel-600 max-w-3xl'>{category.description}</p>
          )}

          {/* Search Bar */}
          <OptimizedSearchBar
            searchTerm={searchTerm}
            searchType={searchType}
            categoryName={category.name}
            isSearching={isSearching}
            isSearchActive={isSearchActive}
            resultsCount={searchResults.length}
            hasMore={currentHasMore}
            totalLoaded={totalLoaded}
            onSearchChange={handleSearchChange}
            onSearchTypeChange={handleSearchTypeChange}
            onClearSearch={clearSearch}
          />

          {/* Results Count and Sort */}
          <div className='flex items-center justify-between mt-6'>
            <p className='text-steel-600'>
              {isSearchActive
                ? searchResults.length > 0
                  ? currentHasMore
                    ? `${searchResults.length}+ results for "${searchTerm}"`
                    : `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for "${searchTerm}"`
                  : isSearching
                    ? 'Searching...'
                    : `No results found for "${searchTerm}"`
                : currentCount > 0
                  ? currentHasMore
                    ? `${currentCount}+ products found`
                    : `${currentCount} ${currentCount === 1 ? 'product' : 'products'} found`
                  : 'No products found'}
            </p>

            {/* Sort Dropdown */}
            <div className='hidden md:block'>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className='px-4 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white'
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Filters Sidebar */}
          <div className='hidden md:block'>
            <AdvancedCategoryFilters
              categorySlug={category.slug}
              selectedFilters={currentFilters}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              newArrivalsFilter={newArrivalsFilter}
              recentlyUpdatedFilter={recentlyUpdatedFilter}
              weightRange={weightRange}
              dimensionFilters={dimensionFilters}
              brandSearchTerm={brandSearchTerm}
              onFilterChange={handleFilterChange}
              onBrandChange={setSelectedBrands}
              onPriceRangeChange={setPriceRange}
              onNewArrivalsChange={setNewArrivalsFilter}
              onRecentlyUpdatedChange={setRecentlyUpdatedFilter}
              onWeightRangeChange={setWeightRange}
              onDimensionFiltersChange={setDimensionFilters}
              onBrandSearchChange={setBrandSearchTerm}
              isLoading={productsLoading}
              isMobile={false}
            />
          </div>

          {/* Products Grid */}
          <div className='md:col-span-3'>
            <OptimizedProductGrid
              products={currentProducts}
              isLoading={(productsLoading && !isSearchActive) || isSearching}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              hasMore={currentHasMore}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
              isSearchActive={isSearchActive}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
