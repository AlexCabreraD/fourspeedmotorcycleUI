'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import { WPSItem } from '@/lib/api/wps-client'

interface UseOptimizedSearchProps {
  categorySlug: string
  buildFilterParams: () => string
}

interface SearchCache {
  items: WPSItem[]
  nextCursor: string | null
  hasMore: boolean
  timestamp: number
}

const SEARCH_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const SEARCH_DEBOUNCE_MS = 300

export function useOptimizedSearch({ categorySlug, buildFilterParams }: UseOptimizedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'sku'>('name')
  const [searchResults, setSearchResults] = useState<WPSItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchNextCursor, setSearchNextCursor] = useState<string | null>(null)
  const [searchHasMore, setSearchHasMore] = useState(false)

  // Refs for optimization
  const searchCache = useRef<Map<string, SearchCache>>(new Map())
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentSearchRef = useRef<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  // Memoized cache key generator
  const createSearchCacheKey = useCallback(
    (query: string, type: 'name' | 'sku', cursor?: string) => {
      const filterParams = buildFilterParams()
      return `${type}:${query.toLowerCase()}:${filterParams}${cursor ? `:${cursor}` : ''}`
    },
    [buildFilterParams]
  )

  // Check if cache entry is valid
  const isCacheValid = useCallback((timestamp: number) => {
    return Date.now() - timestamp < SEARCH_CACHE_DURATION
  }, [])

  // Clean expired cache entries
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now()
    for (const [key, value] of searchCache.current.entries()) {
      if (!isCacheValid(value.timestamp)) {
        searchCache.current.delete(key)
      }
    }
  }, [isCacheValid])

  // Optimized search function with caching
  const performSearch = useCallback(
    async (query: string, type: 'name' | 'sku', cursor?: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const cacheKey = createSearchCacheKey(query, type, cursor)

      // For new searches (no cursor), clear related cache entries
      if (!cursor) {
        const baseKey = `${type}:${query.toLowerCase()}:`
        for (const [key] of searchCache.current.entries()) {
          if (key.startsWith(baseKey)) {
            searchCache.current.delete(key)
          }
        }
      }

      // Check cache first
      const cachedResult = searchCache.current.get(cacheKey)
      if (cachedResult && isCacheValid(cachedResult.timestamp)) {
        if (cursor) {
          // Append to existing results
          setSearchResults((prev) => {
            const combined = [...prev, ...cachedResult.items]
            const deduplicated = combined.filter(
              (product, index, self) => index === self.findIndex((p) => p.id === product.id)
            )
            return deduplicated
          })
        } else {
          setSearchResults(cachedResult.items)
          setSearchNextCursor(cachedResult.nextCursor)
          setSearchHasMore(cachedResult.hasMore)
          setIsSearchActive(true)
        }
        return
      }

      setIsSearching(true)

      try {
        const filterParams = buildFilterParams()
        const searchParam = type === 'name' ? 'search' : 'sku'
        const cursorParam = cursor ? `&cursor=${cursor}` : ''

        const apiEndpoint = `/api/custom-categories/${categorySlug}/items`
        const response = await fetch(
          `${apiEndpoint}?${filterParams}&${searchParam}=${encodeURIComponent(query)}${cursorParam}`,
          { signal: abortController.signal }
        )

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()

        if (data.success && data.data) {
          // Deduplicate items
          const searchItems = data.data.filter(
            (product: WPSItem, index: number, self: WPSItem[]) =>
              index === self.findIndex((p) => p.id === product.id)
          )

          const nextCursor = data.meta?.cursor?.next || null
          const hasMore = !!data.has_more

          // Cache the results
          searchCache.current.set(cacheKey, {
            items: searchItems,
            nextCursor,
            hasMore,
            timestamp: Date.now(),
          })

          // Update state only if this is still the current search
          if (currentSearchRef.current === query && !abortController.signal.aborted) {
            if (cursor) {
              // Append to existing results
              setSearchResults((prev) => {
                const combined = [...prev, ...searchItems]
                const deduplicated = combined.filter(
                  (product, index, self) => index === self.findIndex((p) => p.id === product.id)
                )
                return deduplicated
              })
            } else {
              setSearchResults(searchItems)
              setSearchNextCursor(nextCursor)
              setSearchHasMore(hasMore)
              setIsSearchActive(true)
            }
          }
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Search failed:', error)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearching(false)
        }
      }
    },
    [categorySlug, buildFilterParams, createSearchCacheKey, isCacheValid]
  )

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
      currentSearchRef.current = value

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      if (value.length >= 3) {
        // Reset pagination for new search
        setSearchNextCursor(null)
        setSearchHasMore(true)

        // Debounced search
        searchTimeoutRef.current = setTimeout(() => {
          if (currentSearchRef.current === value) {
            performSearch(value, searchType)
          }
        }, SEARCH_DEBOUNCE_MS)
      } else {
        // Clear search results
        setIsSearchActive(false)
        setSearchResults([])
        setSearchNextCursor(null)
        setSearchHasMore(false)
      }
    },
    [searchType, performSearch]
  )

  // Search type change handler
  const handleSearchTypeChange = useCallback(
    (type: 'name' | 'sku') => {
      setSearchType(type)

      // Re-trigger search if there's an active search term
      if (searchTerm.length >= 3) {
        currentSearchRef.current = searchTerm
        setSearchNextCursor(null)
        setSearchHasMore(true)

        // Clear existing timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current)
        }

        // Perform immediate search with new type
        performSearch(searchTerm, type)
      }
    },
    [searchTerm, performSearch]
  )

  // Clear search handler
  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setIsSearchActive(false)
    setSearchResults([])
    setSearchNextCursor(null)
    setSearchHasMore(false)
    currentSearchRef.current = ''

    // Cancel any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Load more search results
  const loadMoreSearchResults = useCallback(() => {
    if (searchTerm.length >= 3 && searchNextCursor && searchHasMore && !isSearching) {
      performSearch(searchTerm, searchType, searchNextCursor)
    }
  }, [searchTerm, searchType, searchNextCursor, searchHasMore, isSearching, performSearch])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Memoized return object
  return useMemo(
    () => ({
      // State
      searchTerm,
      searchType,
      searchResults,
      isSearching,
      isSearchActive,
      searchHasMore,
      searchNextCursor,

      // Handlers
      handleSearchChange,
      handleSearchTypeChange,
      clearSearch,
      loadMoreSearchResults,
      cleanup,

      // Utilities
      cleanExpiredCache,
    }),
    [
      searchTerm,
      searchType,
      searchResults,
      isSearching,
      isSearchActive,
      searchHasMore,
      searchNextCursor,
      handleSearchChange,
      handleSearchTypeChange,
      clearSearch,
      loadMoreSearchResults,
      cleanup,
      cleanExpiredCache,
    ]
  )
}
