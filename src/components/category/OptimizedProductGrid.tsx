'use client'

import { memo, useState, useCallback } from 'react'
import { Grid, List } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import ProductErrorBoundary from '@/components/ui/ProductErrorBoundary'
import { WPSItem } from '@/lib/api/wps-client'

interface OptimizedProductGridProps {
  products: WPSItem[]
  isLoading: boolean
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  hasMore: boolean
  onLoadMore: () => void
  loadingMore: boolean
  isSearchActive: boolean
  searchTerm?: string
}

// Memoized skeleton component for better performance
const ProductSkeleton = memo(({ viewMode }: { viewMode: 'grid' | 'list' }) => (
  <div className={`bg-white rounded-lg shadow-sm overflow-hidden animate-pulse ${
    viewMode === 'list' ? 'flex h-32' : 'h-80'
  }`}>
    {viewMode === 'list' ? (
      <>
        <div className="w-32 h-32 bg-steel-200" />
        <div className="flex-1 p-4">
          <div className="h-4 bg-steel-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-steel-200 rounded w-1/2 mb-3" />
          <div className="h-6 bg-steel-200 rounded w-20" />
        </div>
      </>
    ) : (
      <>
        <div className="h-48 bg-steel-200" />
        <div className="p-4">
          <div className="h-4 bg-steel-200 rounded w-full mb-2" />
          <div className="h-3 bg-steel-200 rounded w-3/4 mb-3" />
          <div className="h-6 bg-steel-200 rounded w-20" />
        </div>
      </>
    )}
  </div>
))

ProductSkeleton.displayName = 'ProductSkeleton'

// Memoized view toggle for better performance
const ViewToggle = memo(({ viewMode, onViewModeChange }: {
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onViewModeChange('grid')}
      className={`p-2 rounded transition-colors duration-200 ${
        viewMode === 'grid' 
          ? 'bg-orange-100 text-orange-600' 
          : 'text-steel-600 hover:text-steel-900 hover:bg-steel-100'
      }`}
      aria-label="Grid view"
    >
      <Grid className="h-4 w-4" />
    </button>
    <button
      onClick={() => onViewModeChange('list')}
      className={`p-2 rounded transition-colors duration-200 ${
        viewMode === 'list' 
          ? 'bg-orange-100 text-orange-600' 
          : 'text-steel-600 hover:text-steel-900 hover:bg-steel-100'
      }`}
      aria-label="List view"
    >
      <List className="h-4 w-4" />
    </button>
  </div>
))

ViewToggle.displayName = 'ViewToggle'

// Memoized load more button
const LoadMoreButton = memo(({ 
  hasMore, 
  loadingMore, 
  onLoadMore, 
  productsCount, 
  isSearchActive 
}: {
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  productsCount: number
  isSearchActive: boolean
}) => {
  if (productsCount === 0) return null

  return (
    <div className="mt-8 text-center">
      <button
        onClick={onLoadMore}
        disabled={loadingMore || !hasMore}
        className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 ${
          !hasMore 
            ? 'bg-steel-100 text-steel-500 cursor-not-allowed' 
            : 'bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transform hover:scale-105'
        }`}
      >
        {loadingMore ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
            Loading...
          </>
        ) : !hasMore ? (
          <>
            All {isSearchActive ? 'Results' : 'Products'} Loaded
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        ) : (
          <>
            {isSearchActive ? 'Load More Results' : 'Load More Products'}
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
      <p className="text-sm text-steel-600 mt-2">
        {isSearchActive ? (
          hasMore ? 
            `Loaded ${productsCount} results • More available` :
            `All ${productsCount} ${productsCount === 1 ? 'result' : 'results'} loaded`
        ) : (
          hasMore ? 
            `Loaded ${productsCount} products • More available` :
            `All ${productsCount} ${productsCount === 1 ? 'product' : 'products'} loaded`
        )}
      </p>
    </div>
  )
})

LoadMoreButton.displayName = 'LoadMoreButton'

const OptimizedProductGrid = memo(function OptimizedProductGrid({
  products,
  isLoading,
  viewMode,
  onViewModeChange,
  hasMore,
  onLoadMore,
  loadingMore,
  isSearchActive,
  searchTerm
}: OptimizedProductGridProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {[...Array(9)].map((_, i) => (
          <ProductSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    )
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-steel-400 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-steel-900 mb-2">
          {isSearchActive ? `No results found for "${searchTerm}"` : 'No products found'}
        </h3>
        <p className="text-steel-600 mb-6">
          {isSearchActive 
            ? 'Try different search terms or adjust your filters.' 
            : 'Try adjusting your filters or search terms.'
          }
        </p>
      </div>
    )
  }

  // Show products grid
  return (
    <>
      {/* View Toggle (only show if products exist) */}
      <div className="flex justify-end mb-6">
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>

      {/* Products Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {products.map((product, index) => (
          <ProductErrorBoundary key={product.id}>
            <ProductCard 
              product={product} 
              viewMode={viewMode}
              priority={index < 6} // First 6 products get priority loading
            />
          </ProductErrorBoundary>
        ))}
      </div>

      {/* Load More Button */}
      <LoadMoreButton
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
        productsCount={products.length}
        isSearchActive={isSearchActive}
      />
    </>
  )
})

OptimizedProductGrid.displayName = 'OptimizedProductGrid'

export default OptimizedProductGrid