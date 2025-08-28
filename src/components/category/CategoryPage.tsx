'use client'

import { Filter, Grid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import AdvancedCategoryFilters from '@/components/category/AdvancedCategoryFilters'
import ProductCard from '@/components/products/ProductCard'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { WPSItem } from '@/lib/api/wps-client'
import { Category, FALLBACK_CATEGORIES, WPS_CATEGORIES } from '@/lib/constants/categories'

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
  { value: 'updated_desc', label: 'Recently Updated' },
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

  // Advanced search state (from products page)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'sku'>('name')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<WPSItem[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [loadingFilters, setLoadingFilters] = useState(false)

  // Advanced filter states (from products page)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [newArrivalsFilter, setNewArrivalsFilter] = useState('')
  const [recentlyUpdatedFilter, setRecentlyUpdatedFilter] = useState('')
  const [weightRange, setWeightRange] = useState({ min: '', max: '' })
  const [dimensionFilters, setDimensionFilters] = useState({
    length: { min: '', max: '' },
    width: { min: '', max: '' },
    height: { min: '', max: '' },
  })
  const [brandSearchTerm, setBrandSearchTerm] = useState('')

  // Search and filter caching
  const searchCache = useRef<
    Map<
      string,
      {
        items: WPSItem[]
        nextCursor: string | null
        hasMore: boolean
      }
    >
  >(new Map())
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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentSearchRef = useRef<string>('')
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const router = useRouter()

  // Extract filters from search params with support for arrays
  const currentPage = Number(searchParams.page) || 1
  const sortBy = (searchParams.sort as string) || 'name_asc'

  // Convert search params to filter object
  const extractedFilters = useMemo(() => {
    const filters: Record<string, string | string[]> = {}

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === 'page' || key === 'sort') {
        return
      }

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

  // Build filter query parameters for caching (advanced version from products page)
  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams()
    params.set('page', '21')
    params.set('sort', sortBy)

    // Add category-specific filters from URL
    Object.entries(extractedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','))
        }
      } else if (value) {
        params.set(key, value)
      }
    })

    // Add advanced filter states
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

    // Date filters
    if (newArrivalsFilter) {
      params.set('new_arrivals_days', newArrivalsFilter)
    }
    if (recentlyUpdatedFilter) {
      params.set('recently_updated_days', recentlyUpdatedFilter)
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
    extractedFilters,
    sortBy,
    selectedBrands,
    priceRange,
    newArrivalsFilter,
    recentlyUpdatedFilter,
    weightRange,
    dimensionFilters,
  ])

  // Create cache key for filter combination
  const createCacheKey = useCallback(
    (cursor?: string) => {
      const filterParams = buildFilterParams()
      return cursor ? `${filterParams}&cursor=${cursor}` : filterParams
    },
    [buildFilterParams]
  )

  // Check if cache entry is still valid
  const isCacheValid = useCallback((timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION
  }, [])

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
            foundCategory =
              WPS_CATEGORIES.find((cat) => cat.slug === slug) ||
              FALLBACK_CATEGORIES.find((cat) => cat.slug === slug)
          }

          if (!foundCategory) {
            setLoading(false)
            return
          }

          setCategory(foundCategory)
          setBreadcrumb([
            {
              id: foundCategory.id,
              name: foundCategory.name,
              slug: foundCategory.slug,
            },
          ])
        } else {
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
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error)
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
  }, [slug])

  // Enhanced fetch products with caching
  const fetchProducts = useCallback(
    async (cursor?: string, reset: boolean = false) => {
      if (!category) {
        return
      }

      const isInitialLoad = !cursor
      const cacheKey = createCacheKey(cursor)

      // Check cache first for regular browsing (not search)
      if (!isSearchActive) {
        const cachedResult = filterCache.current.get(cacheKey)
        if (cachedResult && isCacheValid(cachedResult.timestamp)) {
          if (reset || isInitialLoad) {
            setProducts(cachedResult.products)
            setTotalLoaded(cachedResult.products.length)
          } else {
            // Combine previous products with cached ones and deduplicate across all
            setProducts((prev) => {
              const combined = [...prev, ...cachedResult.products]
              const deduplicated = combined.filter(
                (product: WPSItem, index: number, self: WPSItem[]) =>
                  index === self.findIndex((p) => p.id === product.id)
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
        // Use our new custom category API for all categories
        const params = new URLSearchParams()
        params.set('page', '21')
        params.set('sort', sortBy)

        if (cursor) {
          params.set('cursor', cursor)
        }

        // Add all filters to params (including advanced filters)
        Object.entries(extractedFilters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','))
            }
          } else if (value) {
            params.set(key, value)
          }
        })

        // Add advanced filter states
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

        // Date filters
        if (newArrivalsFilter) {
          params.set('new_arrivals_days', newArrivalsFilter)
        }
        if (recentlyUpdatedFilter) {
          params.set('recently_updated_days', recentlyUpdatedFilter)
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

        // Use the custom category API endpoint for items
        const apiEndpoint = `/api/custom-categories/${category.slug}/items`
        const response = await fetch(`${apiEndpoint}?${params.toString()}`)
        const data = await response.json()

        if (data.success && data.data) {
          // Filter out duplicates by ID
          const uniqueProducts = data.data.filter(
            (product: WPSItem, index: number, self: WPSItem[]) =>
              index === self.findIndex((p) => p.id === product.id)
          )

          const nextCursor = data.meta?.cursor?.next || null
          const hasMore = !!data.has_more

          // Cache the result for regular browsing
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
            // Combine previous products with new ones and deduplicate across all
            setProducts((prev) => {
              const combined = [...prev, ...uniqueProducts]
              const deduplicated = combined.filter(
                (product: WPSItem, index: number, self: WPSItem[]) =>
                  index === self.findIndex((p) => p.id === product.id)
              )
              return deduplicated
            })
            setTotalLoaded((prev) => prev + uniqueProducts.length)
          }

          setHasMore(hasMore)
          setNextCursor(nextCursor)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setProductsLoading(false)
        setLoadingMore(false)
      }
    },
    [category, createCacheKey, isCacheValid, isSearchActive, sortBy, extractedFilters]
  )

  // Fetch products when filters change (excluding search-related state to avoid infinite loops)
  useEffect(() => {
    // Skip initial load
    if (loading) {
      return
    }

    // Set loading state for filters specifically
    setLoadingFilters(true)

    // Reset and fetch with new filters for regular browsing
    // Search will be handled separately by the debounced search effect
    if (!isSearchActive) {
      fetchProducts(undefined, true).finally(() => {
        setLoadingFilters(false)
      })
    } else {
      setLoadingFilters(false)
    }
  }, [
    category,
    sortBy,
    extractedFilters,
    currentPage,
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

  // Separate effect for handling search when filters change
  useEffect(() => {
    if (isSearchActive && searchTerm.length >= 3) {
      // Clear existing timeout to avoid multiple concurrent searches
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Reset pagination state for filter-triggered search
      setNextCursor(null)
      setHasMore(true)

      // Debounce the search with filters
      searchTimeoutRef.current = setTimeout(() => {
        // Inline search call to avoid circular dependency
        const filterParams = buildFilterParams()
        const searchParam = searchType === 'name' ? 'search' : 'sku'

        setSearching(true)
        const apiEndpoint = `/api/custom-categories/${category!.slug}/items`
        fetch(`${apiEndpoint}?${filterParams}&${searchParam}=${encodeURIComponent(searchTerm)}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.success && data.data) {
              // Filter out duplicates by ID
              const searchItems = data.data.filter(
                (product: WPSItem, index: number, self: WPSItem[]) =>
                  index === self.findIndex((p) => p.id === product.id)
              )

              // Update cursor for pagination
              setNextCursor(data.meta?.cursor?.next || null)
              setHasMore(!!data.has_more)

              // Only update if this is still the current search
              if (currentSearchRef.current === searchTerm) {
                setSearchResults(searchItems)
              }
            }
          })
          .catch((error) => {
            console.error('Search failed:', error)
          })
          .finally(() => {
            setSearching(false)
          })
      }, 300)
    }
  }, [
    selectedBrands,
    priceRange,
    newArrivalsFilter,
    recentlyUpdatedFilter,
    weightRange,
    dimensionFilters,
    isSearchActive,
    searchTerm,
    searchType,
    buildFilterParams,
    category,
  ])

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

  // Advanced search function with caching and filter support (from products page)
  const performSearch = useCallback(
    async (query: string, type: 'name' | 'sku', cursor?: string) => {
      const filterParams = buildFilterParams()
      const cacheKey = `${type}:${query.toLowerCase()}:${filterParams}${cursor ? `:${cursor}` : ''}`

      // For new searches (no cursor), always reset pagination state and clear cache
      if (!cursor) {
        // Clear existing search cache for new searches to ensure fresh pagination data
        for (const [key] of searchCache.current.entries()) {
          if (key.startsWith(`${type}:${query.toLowerCase()}:`)) {
            searchCache.current.delete(key)
          }
        }
      }

      // Check cache first
      if (searchCache.current.has(cacheKey)) {
        const cachedResult = searchCache.current.get(cacheKey)!
        if (cursor) {
          // Combine previous search results with cached ones and deduplicate across all
          setSearchResults((prev) => {
            const combined = [...prev, ...cachedResult.items]
            const deduplicated = combined.filter(
              (product: WPSItem, index: number, self: WPSItem[]) =>
                index === self.findIndex((p) => p.id === product.id)
            )
            return deduplicated
          })
        } else {
          setSearchResults(cachedResult.items)
          setNextCursor(cachedResult.nextCursor)
          setHasMore(cachedResult.hasMore)
        }
        setIsSearchActive(true)
        return
      }

      setSearching(true)
      try {
        const searchParam = type === 'name' ? 'search' : 'sku'
        const cursorParam = cursor ? `&cursor=${cursor}` : ''
        const apiEndpoint = `/api/custom-categories/${category!.slug}/items`
        const response = await fetch(
          `${apiEndpoint}?${filterParams}&${searchParam}=${encodeURIComponent(query)}${cursorParam}`
        )
        const data = await response.json()

        if (data.success && data.data) {
          // Filter out duplicates by ID
          const searchItems = data.data.filter(
            (product: WPSItem, index: number, self: WPSItem[]) =>
              index === self.findIndex((p) => p.id === product.id)
          )

          // Update cursor for pagination
          const nextCursor = data.meta?.cursor?.next || null
          const hasMore = !!data.has_more
          setNextCursor(nextCursor)
          setHasMore(hasMore)

          // Cache the results with pagination metadata
          searchCache.current.set(cacheKey, {
            items: searchItems,
            nextCursor,
            hasMore,
          })

          // Only update if this is still the current search
          if (currentSearchRef.current === query) {
            if (cursor) {
              // Combine previous search results with new ones and deduplicate across all
              setSearchResults((prev) => {
                const combined = [...prev, ...searchItems]
                const deduplicated = combined.filter(
                  (product: WPSItem, index: number, self: WPSItem[]) =>
                    index === self.findIndex((p) => p.id === product.id)
                )
                return deduplicated
              })
            } else {
              setSearchResults(searchItems)
              setIsSearchActive(true)
            }
          }
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setSearching(false)
      }
    },
    [buildFilterParams, category]
  )

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.length >= 3) {
      currentSearchRef.current = searchTerm

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Reset pagination state for new search
      setNextCursor(null)
      setHasMore(true)

      // Set new timeout for debounced search
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchTerm, searchType)
      }, 300) // 300ms debounce
    } else {
      // Clear search when less than 3 characters
      setIsSearchActive(false)
      setSearchResults([])
      setNextCursor(null)
      setHasMore(true)
      currentSearchRef.current = ''

      // Re-fetch products for browsing mode
      if (category && !loading) {
        fetchProducts(undefined, true)
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm, performSearch, category, loading, fetchProducts])

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, value] of filterCache.current.entries()) {
        if (!isCacheValid(value.timestamp)) {
          filterCache.current.delete(key)
        }
      }
    }, 60000) // Clean up every minute

    return () => clearInterval(cleanupInterval)
  }, [isCacheValid])

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    setIsSearchActive(false)
    setSearchResults([])
    setNextCursor(null)
    setHasMore(true)
  }

  // Advanced filter handlers
  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands)
  }

  const handlePriceRangeChange = (range: { min: string; max: string }) => {
    setPriceRange(range)
  }

  const handleNewArrivalsChange = (days: string) => {
    setNewArrivalsFilter(days)
  }

  const handleRecentlyUpdatedChange = (days: string) => {
    setRecentlyUpdatedFilter(days)
  }

  const handleWeightRangeChange = (range: { min: string; max: string }) => {
    setWeightRange(range)
  }

  const handleDimensionFiltersChange = (filters: any) => {
    setDimensionFilters(filters)
  }

  const handleBrandSearchChange = (term: string) => {
    setBrandSearchTerm(term)
  }

  const loadMoreProducts = async () => {
    if (!category || !hasMore || !nextCursor || loadingMore) {
      return
    }

    if (isSearchActive && searchTerm.length >= 3) {
      // Load more search results
      performSearch(searchTerm, searchType, nextCursor)
    } else {
      // Load more regular products
      fetchProducts(nextCursor, false)
    }
  }

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
              <div className='md:col-span-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className='h-80 bg-steel-200 rounded' />
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
      <div className='min-h-screen bg-steel-50 pt-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-2xl font-bold text-steel-900 mb-4'>Category Not Found</h1>
          <p className='text-steel-600 mb-8'>The category you're looking for doesn't exist.</p>
          <button onClick={() => router.back()} className='btn btn-primary'>
            Go Back
          </button>
        </div>
      </div>
    )
  }

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

          {/* Advanced Search Bar */}
          <div className='mt-6 mb-4'>
            <div className='flex items-center space-x-4 max-w-2xl'>
              {/* Search Input */}
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-steel-400' />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={`Search ${category.name.toLowerCase()} by ${searchType === 'name' ? 'name' : 'SKU'}...`}
                  className='w-full pl-10 pr-10 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white'
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-steel-400 hover:text-steel-600'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>

              {/* Search Type Toggle */}
              <div className='flex items-center bg-steel-100 rounded-lg p-1'>
                <button
                  onClick={() => setSearchType('name')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    searchType === 'name'
                      ? 'bg-white text-steel-900 shadow-sm'
                      : 'text-steel-600 hover:text-steel-900'
                  }`}
                >
                  Name
                </button>
                <button
                  onClick={() => setSearchType('sku')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    searchType === 'sku'
                      ? 'bg-white text-steel-900 shadow-sm'
                      : 'text-steel-600 hover:text-steel-900'
                  }`}
                >
                  SKU
                </button>
              </div>
            </div>

            {/* Search Status */}
            <div className='mt-2'>
              {searchTerm && searchTerm.length < 3 && (
                <p className='text-sm text-steel-500'>Type at least 3 characters to search</p>
              )}
              {searching && (
                <div className='text-sm text-steel-500 flex items-center'>
                  <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600 mr-2'></div>
                  Searching {searchType === 'name' ? 'product names' : 'SKUs'}...
                </div>
              )}
              {isSearchActive && !searching && (
                <p className='text-sm text-steel-600'>
                  Searching {searchType === 'name' ? 'product names' : 'SKUs'} for "{searchTerm}" •
                  <button
                    onClick={clearSearch}
                    className='text-primary-600 hover:text-primary-700 ml-1'
                  >
                    Clear search
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between mt-6'>
            <p className='text-steel-600'>
              {isSearchActive
                ? searchResults.length > 0
                  ? hasMore
                    ? `${searchResults.length}+ results for "${searchTerm}"`
                    : `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for "${searchTerm}"`
                  : searching
                    ? 'Searching...'
                    : `No results found for "${searchTerm}"`
                : totalLoaded > 0
                  ? hasMore
                    ? `${totalLoaded}+ products found`
                    : `${totalLoaded} ${totalLoaded === 1 ? 'product' : 'products'} found`
                  : 'No products found'}
            </p>

            {/* View Toggle & Sort - Desktop */}
            <div className='hidden md:flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'}`}
                >
                  <Grid className='h-4 w-4' />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'}`}
                >
                  <List className='h-4 w-4' />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className='form-input py-2 px-3 text-sm'
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='md:hidden btn btn-outline btn-sm flex items-center'
            >
              <SlidersHorizontal className='h-4 w-4 mr-2' />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Advanced Filters Sidebar */}
          <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
            <AdvancedCategoryFilters
              categorySlug={category.slug}
              selectedFilters={extractedFilters}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              newArrivalsFilter={newArrivalsFilter}
              recentlyUpdatedFilter={recentlyUpdatedFilter}
              weightRange={weightRange}
              dimensionFilters={dimensionFilters}
              brandSearchTerm={brandSearchTerm}
              onFilterChange={handleFilterChange}
              onBrandChange={handleBrandChange}
              onPriceRangeChange={handlePriceRangeChange}
              onNewArrivalsChange={handleNewArrivalsChange}
              onRecentlyUpdatedChange={handleRecentlyUpdatedChange}
              onWeightRangeChange={handleWeightRangeChange}
              onDimensionFiltersChange={handleDimensionFiltersChange}
              onBrandSearchChange={handleBrandSearchChange}
              isLoading={productsLoading || loadingFilters}
              isMobile={false}
            />
          </div>

          {/* Products Grid */}
          <div className='md:col-span-3'>
            {(productsLoading && !isSearchActive) || searching ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className='h-80 bg-steel-200 rounded animate-pulse' />
                ))}
              </div>
            ) : (isSearchActive ? searchResults : products).length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {(isSearchActive ? searchResults : products).map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Show More Button */}
                {!productsLoading &&
                  !searching &&
                  (isSearchActive ? searchResults : products).length > 0 && (
                    <div className='mt-8 text-center'>
                      <button
                        onClick={loadMoreProducts}
                        disabled={loadingMore || !hasMore}
                        className={`btn btn-lg inline-flex items-center ${
                          !hasMore
                            ? 'btn-disabled bg-steel-100 text-steel-500 cursor-not-allowed'
                            : 'btn-outline'
                        }`}
                      >
                        {loadingMore ? (
                          <>
                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2'></div>
                            Loading...
                          </>
                        ) : !hasMore ? (
                          <>
                            All {isSearchActive ? 'Results' : 'Products'} Loaded
                            <svg
                              className='ml-2 h-5 w-5'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            {isSearchActive ? 'Load More Results' : 'Load More Products'}
                            <svg
                              className='ml-2 h-5 w-5'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          </>
                        )}
                      </button>
                      <p className='text-sm text-steel-600 mt-2 mb-8'>
                        {isSearchActive
                          ? hasMore
                            ? `Loaded ${searchResults.length} results • More available`
                            : `All ${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} loaded`
                          : hasMore
                            ? `Loaded ${products.length} products • More available`
                            : `All ${products.length} ${products.length === 1 ? 'product' : 'products'} loaded`}
                      </p>
                    </div>
                  )}
              </>
            ) : (
              <div className='text-center py-12'>
                <div className='text-steel-400 mb-4'>
                  {isSearchActive ? (
                    <Search className='h-16 w-16 mx-auto' />
                  ) : (
                    <Filter className='h-16 w-16 mx-auto' />
                  )}
                </div>
                <h3 className='text-lg font-medium text-steel-900 mb-2'>
                  {isSearchActive ? `No results found for "${searchTerm}"` : 'No products found'}
                </h3>
                <p className='text-steel-600 mb-6'>
                  {isSearchActive
                    ? 'Try different search terms or adjust your filters.'
                    : 'Try adjusting your filters or search terms.'}
                </p>
                <div className='space-x-3'>
                  {isSearchActive && (
                    <button onClick={clearSearch} className='btn btn-primary'>
                      Clear Search
                    </button>
                  )}
                  <button onClick={() => handleFilterChange({})} className='btn btn-outline'>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
