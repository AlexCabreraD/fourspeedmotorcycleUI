'use client'

import { useState } from 'react'
import { WPSItem } from '@/lib/api/wps-client'
import AdvancedSearch from '@/components/search/AdvancedSearch'
import ProductCard from '@/components/products/ProductCard'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearchResults = (results: WPSItem[]) => {
    setSearchResults(results)
    setHasSearched(true)
    setLoading(false)
  }

  const handleSearchStart = () => {
    setLoading(true)
    setHasSearched(false)
  }

  return (
    <div className="min-h-screen bg-steel-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { name: 'Home', href: '/' },
            { name: 'Search', href: '/search' }
          ]}
        />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Advanced Product Search
          </h1>
          <p className="text-lg text-steel-600 max-w-3xl">
            Find exactly what you need with our enhanced search featuring smart filters, 
            brand selection, and real-time results powered by our advanced WPS API integration.
          </p>
        </div>

        {/* Advanced Search Component */}
        <div className="mb-8">
          <AdvancedSearch 
            onResults={handleSearchResults}
            className="shadow-lg"
          />
        </div>

        {/* Search Results */}
        <div>
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-steel-600">Searching products...</p>
            </div>
          )}

          {!loading && hasSearched && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-steel-900">
                  Search Results
                </h2>
                <p className="text-steel-600">
                  {searchResults.length > 0 ? (
                    `${searchResults.length} ${searchResults.length === 1 ? 'product' : 'products'} found`
                  ) : (
                    'No products found'
                  )}
                </p>
              </div>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode="grid"
                />
              ))}
            </div>
          )}

          {!loading && hasSearched && searchResults.length === 0 && (
            <div className="text-center py-12">
              <div className="text-steel-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-steel-900 mb-2">
                No products found
              </h3>
              <p className="text-steel-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <div className="text-sm text-steel-500">
                <p>Search tips:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Use more general terms</li>
                  <li>• Check your spelling</li>
                  <li>• Try different product types or brands</li>
                  <li>• Expand your price range</li>
                </ul>
              </div>
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="text-center py-12">
              <div className="text-steel-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-steel-900 mb-2">
                Start Your Search
              </h3>
              <p className="text-steel-600 mb-6">
                Use the search bar above to find products. You can search by name, filter by product type, 
                brand, price range, and availability options.
              </p>
              <div className="bg-primary-50 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-medium text-primary-900 mb-2">Enhanced Features:</h4>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>✓ Smart caching for faster results</li>
                  <li>✓ Advanced filtering options</li>
                  <li>✓ Real-time brand and type suggestions</li>
                  <li>✓ Comprehensive product information</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}