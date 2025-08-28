'use client'

import { Search, X } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'

interface OptimizedSearchBarProps {
  searchTerm: string
  searchType: 'name' | 'sku'
  categoryName: string
  isSearching: boolean
  isSearchActive: boolean
  resultsCount: number
  hasMore: boolean
  totalLoaded: number
  onSearchChange: (value: string) => void
  onSearchTypeChange: (type: 'name' | 'sku') => void
  onClearSearch: () => void
}

// Memoized search status component
const SearchStatus = memo(
  ({
    searchTerm,
    searchType,
    isSearching,
    isSearchActive,
    resultsCount,
    hasMore,
    onClearSearch,
  }: {
    searchTerm: string
    searchType: 'name' | 'sku'
    isSearching: boolean
    isSearchActive: boolean
    resultsCount: number
    hasMore: boolean
    onClearSearch: () => void
  }) => {
    const statusMessage = useMemo(() => {
      if (searchTerm && searchTerm.length < 3) {
        return 'Type at least 3 characters to search'
      }

      if (isSearching) {
        return (
          <div className='flex items-center'>
            <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600 mr-2' />
            Searching {searchType === 'name' ? 'product names' : 'SKUs'}...
          </div>
        )
      }

      if (isSearchActive && !isSearching) {
        return (
          <span>
            Searching {searchType === 'name' ? 'product names' : 'SKUs'} for "{searchTerm}" •
            <button
              onClick={onClearSearch}
              className='text-orange-600 hover:text-orange-700 ml-1 font-medium'
            >
              Clear search
            </button>
          </span>
        )
      }

      return null
    }, [searchTerm, searchType, isSearching, isSearchActive, onClearSearch])

    if (!statusMessage) {
      return null
    }

    return (
      <div className='mt-2'>
        <div className='text-sm text-steel-600'>{statusMessage}</div>
      </div>
    )
  }
)

SearchStatus.displayName = 'SearchStatus'

// Memoized results count component
const ResultsCount = memo(
  ({
    isSearchActive,
    resultsCount,
    hasMore,
    searchTerm,
    isSearching,
    totalLoaded,
  }: {
    isSearchActive: boolean
    resultsCount: number
    hasMore: boolean
    searchTerm: string
    isSearching: boolean
    totalLoaded: number
  }) => {
    const countMessage = useMemo(() => {
      if (isSearchActive) {
        if (resultsCount > 0) {
          return hasMore
            ? `${resultsCount}+ results for "${searchTerm}"`
            : `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} for "${searchTerm}"`
        } else if (isSearching) {
          return 'Searching...'
        } else {
          return `No results found for "${searchTerm}"`
        }
      } else {
        if (totalLoaded > 0) {
          return hasMore
            ? `${totalLoaded}+ products found`
            : `${totalLoaded} ${totalLoaded === 1 ? 'product' : 'products'} found`
        } else {
          return 'No products found'
        }
      }
    }, [isSearchActive, resultsCount, hasMore, searchTerm, isSearching, totalLoaded])

    return <p className='text-steel-600'>{countMessage}</p>
  }
)

ResultsCount.displayName = 'ResultsCount'

const OptimizedSearchBar = memo(function OptimizedSearchBar({
  searchTerm,
  searchType,
  categoryName,
  isSearching,
  isSearchActive,
  resultsCount,
  hasMore,
  totalLoaded,
  onSearchChange,
  onSearchTypeChange,
  onClearSearch,
}: OptimizedSearchBarProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value)
    },
    [onSearchChange]
  )

  const handleClearClick = useCallback(() => {
    onClearSearch()
  }, [onClearSearch])

  const handleNameTypeClick = useCallback(() => {
    onSearchTypeChange('name')
  }, [onSearchTypeChange])

  const handleSkuTypeClick = useCallback(() => {
    onSearchTypeChange('sku')
  }, [onSearchTypeChange])

  const placeholder = useMemo(
    () => `Search ${categoryName.toLowerCase()} by ${searchType === 'name' ? 'name' : 'SKU'}...`,
    [categoryName, searchType]
  )

  return (
    <div className='mt-6 mb-4'>
      <div className='flex items-center space-x-4 max-w-2xl'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-steel-400' />
          <input
            type='text'
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className='w-full pl-10 pr-10 py-3 border border-steel-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-all duration-200'
            autoComplete='off'
          />
          {searchTerm && (
            <button
              onClick={handleClearClick}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-steel-400 hover:text-steel-600 transition-colors duration-200'
              aria-label='Clear search'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>

        {/* Search Type Toggle */}
        <div className='flex items-center bg-steel-100 rounded-lg p-1'>
          <button
            onClick={handleNameTypeClick}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchType === 'name'
                ? 'bg-white text-steel-900 shadow-sm'
                : 'text-steel-600 hover:text-steel-900'
            }`}
          >
            Name
          </button>
          <button
            onClick={handleSkuTypeClick}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
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
      <SearchStatus
        searchTerm={searchTerm}
        searchType={searchType}
        isSearching={isSearching}
        isSearchActive={isSearchActive}
        resultsCount={resultsCount}
        hasMore={hasMore}
        onClearSearch={onClearSearch}
      />
    </div>
  )
})

OptimizedSearchBar.displayName = 'OptimizedSearchBar'

export default OptimizedSearchBar
