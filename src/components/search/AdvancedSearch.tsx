'use client'

import React, { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { createWPSClient, QueryBuilder, WPSItem, WPSBrand } from '@/lib/api/wps-client'

interface AdvancedSearchProps {
  onResults?: (results: WPSItem[]) => void
  className?: string
}

interface SearchFilters {
  query: string
  productType: string
  brandId: string
  minPrice: string
  maxPrice: string
  inStock: boolean
  dropShipEligible: boolean
}

export default function AdvancedSearch({ onResults, className = '' }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<WPSBrand[]>([])
  const [brandsLoading, setBrandsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    productType: '',
    brandId: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    dropShipEligible: false
  })

  // Load brands when component mounts or when expanded
  React.useEffect(() => {
    if (isExpanded && brands.length === 0) {
      loadBrands()
    }
  }, [isExpanded, brands.length])

  const loadBrands = async () => {
    setBrandsLoading(true)
    try {
      const client = createWPSClient({ enableCaching: true })
      const response = await client.getBrands({ 'page[size]': 100 })
      if (response.data) {
        setBrands(response.data.slice(0, 50)) // Limit to top 50 brands
      }
    } catch (error) {
      console.error('Failed to load brands:', error)
    } finally {
      setBrandsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!filters.query.trim() && !filters.productType && !filters.brandId) {
      return // Don't search without any criteria
    }

    setLoading(true)
    try {
      const client = createWPSClient({ enableCaching: true })
      const query = client.createQuery()

      // Add text search
      if (filters.query.trim()) {
        query.filterByName(filters.query.trim(), 'con') // Contains search
      }

      // Add filters
      if (filters.productType) {
        query.filterByProductType(filters.productType)
      }
      if (filters.brandId) {
        query.filterByBrand(parseInt(filters.brandId))
      }
      if (filters.minPrice || filters.maxPrice) {
        const min = filters.minPrice ? parseFloat(filters.minPrice) : undefined
        const max = filters.maxPrice ? parseFloat(filters.maxPrice) : undefined
        query.filterByPriceRange(min, max)
      }
      if (filters.inStock) {
        query.filterByStatus('A') // Active status
      }
      if (filters.dropShipEligible) {
        query.filterByDropShipEligible(true)
      }

      // Include related data and set pagination
      query.includeImages().includeBrand().pageSize(20)

      // Execute search
      const response = await client.advancedSearch(query)
      
      if (response.data && onResults) {
        onResults(response.data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      productType: '',
      brandId: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      dropShipEligible: false
    })
  }

  const hasActiveFilters = filters.productType || filters.brandId || filters.minPrice || 
                          filters.maxPrice || filters.inStock || filters.dropShipEligible

  return (
    <div className={`bg-white rounded-lg border border-steel-200 ${className}`}>
      {/* Basic Search */}
      <div className="p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-outline flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-steel-200 p-4">
          <div className="space-y-4">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {filters.productType && (
                    <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      Type: {filters.productType}
                      <button
                        onClick={() => handleFilterChange('productType', '')}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.brandId && (
                    <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      Brand: {brands.find(b => b.id.toString() === filters.brandId)?.name || filters.brandId}
                      <button
                        onClick={() => handleFilterChange('brandId', '')}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                      <button
                        onClick={() => {
                          handleFilterChange('minPrice', '')
                          handleFilterChange('maxPrice', '')
                        }}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-accent-600 hover:text-accent-700"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">
                  Product Type
                </label>
                <select
                  value={filters.productType}
                  onChange={(e) => handleFilterChange('productType', e.target.value)}
                  className="w-full form-input text-sm"
                >
                  <option value="">All Types</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Hardware/Fasteners/Fittings">Hardware/Fasteners</option>
                  <option value="Tire/Wheel Accessories">Tire/Wheel Accessories</option>
                  <option value="Drive">Drive</option>
                  <option value="Exhaust">Exhaust</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Engine">Engine</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brandId}
                  onChange={(e) => handleFilterChange('brandId', e.target.value)}
                  className="w-full form-input text-sm"
                  disabled={brandsLoading}
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full form-input text-sm"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full form-input text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Availability Options */}
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-steel-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.dropShipEligible}
                      onChange={(e) => handleFilterChange('dropShipEligible', e.target.checked)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-steel-700">Drop Ship</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}