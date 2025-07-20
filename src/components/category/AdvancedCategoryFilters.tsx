'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, X, Filter, Search, SlidersHorizontal, Loader2 } from 'lucide-react'
import { getCategoryBySlug } from '@/lib/constants/custom-categories'
import { ALL_BRANDS, ALL_ITEM_TYPES } from '@/lib/constants/brands-and-types'
import { getPrioritizedBrandsForProductTypes, getOtherBrands } from '@/lib/constants/brand-product-mapping'

interface AdvancedCategoryFiltersProps {
  categorySlug: string
  selectedFilters: Record<string, string | string[]>
  selectedBrands: string[]
  priceRange: { min: string; max: string }
  newArrivalsFilter: string
  recentlyUpdatedFilter: string
  weightRange: { min: string; max: string }
  dimensionFilters: {
    length: { min: string; max: string }
    width: { min: string; max: string }
    height: { min: string; max: string }
  }
  brandSearchTerm: string
  onFilterChange: (filters: Record<string, string | string[]>) => void
  onBrandChange: (brands: string[]) => void
  onPriceRangeChange: (range: { min: string; max: string }) => void
  onNewArrivalsChange: (days: string) => void
  onRecentlyUpdatedChange: (days: string) => void
  onWeightRangeChange: (range: { min: string; max: string }) => void
  onDimensionFiltersChange: (filters: any) => void
  onBrandSearchChange: (term: string) => void
  isLoading?: boolean
  className?: string
  isMobile?: boolean
}

export default function AdvancedCategoryFilters({
  categorySlug,
  selectedFilters,
  selectedBrands,
  priceRange,
  newArrivalsFilter,
  recentlyUpdatedFilter,
  weightRange,
  dimensionFilters,
  brandSearchTerm,
  onFilterChange,
  onBrandChange,
  onPriceRangeChange,
  onNewArrivalsChange,
  onRecentlyUpdatedChange,
  onWeightRangeChange,
  onDimensionFiltersChange,
  onBrandSearchChange,
  isLoading = false,
  className = '',
  isMobile = false
}: AdvancedCategoryFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['category-types', 'brands', 'price']))
  const [priceRange_, setPriceRange_] = useState<{ min: number; max: number } | null>(null)
  const [showAllBrands, setShowAllBrands] = useState(false)

  const category = useMemo(() => getCategoryBySlug(categorySlug), [categorySlug])

  // Get prioritized and organized brands based on category product types and search
  const organizedBrands = useMemo(() => {
    const categoryProductTypes = category?.productTypeFilters || []
    
    // Get brands prioritized for this category's product types
    const prioritizedBrands = getPrioritizedBrandsForProductTypes(categoryProductTypes) || []
    const otherBrands = getOtherBrands(prioritizedBrands) || []
    
    let relevantBrands: string[] = []
    let additionalBrands: string[] = []
    
    if (brandSearchTerm && brandSearchTerm.length > 0) {
      // When searching, filter all brands by search term
      const searchLower = brandSearchTerm.toLowerCase()
      relevantBrands = prioritizedBrands.filter(brand => 
        brand && brand.toLowerCase().includes(searchLower)
      )
      additionalBrands = otherBrands.filter(brand => 
        brand && brand.toLowerCase().includes(searchLower)
      )
    } else {
      // When not searching, show prioritized brands and optionally all brands
      relevantBrands = prioritizedBrands || []
      additionalBrands = showAllBrands ? (otherBrands || []) : []
    }
    
    // Ensure selectedBrands is an array
    const safeSelectedBrands = selectedBrands || []
    
    // Organize brands: selected first, then relevant unselected, then additional unselected
    const selectedRelevant = relevantBrands.filter(brand => safeSelectedBrands.includes(brand))
    const selectedAdditional = additionalBrands.filter(brand => safeSelectedBrands.includes(brand))
    const unselectedRelevant = relevantBrands.filter(brand => !safeSelectedBrands.includes(brand))
    const unselectedAdditional = additionalBrands.filter(brand => !safeSelectedBrands.includes(brand))
    
    return {
      selected: [...selectedRelevant, ...selectedAdditional],
      relevantUnselected: unselectedRelevant,
      additionalUnselected: unselectedAdditional,
      showingAll: showAllBrands || (brandSearchTerm && brandSearchTerm.length > 0),
      hasRelevantBrands: relevantBrands.length > 0,
      hasAdditionalBrands: additionalBrands.length > 0
    }
  }, [categorySlug, category, brandSearchTerm, selectedBrands, showAllBrands])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand]
    onBrandChange(newBrands)
  }

  const clearAllFilters = () => {
    onFilterChange({})
    onBrandChange([])
    onPriceRangeChange({ min: '', max: '' })
    onNewArrivalsChange('')
    onRecentlyUpdatedChange('')
    onWeightRangeChange({ min: '', max: '' })
    onDimensionFiltersChange({
      length: { min: '', max: '' },
      width: { min: '', max: '' },
      height: { min: '', max: '' }
    })
  }

  const activeFilterCount = [
    ...Object.keys(selectedFilters).filter(key => {
      const value = selectedFilters[key]
      return value !== '' && !(Array.isArray(value) && value.length === 0)
    }),
    ...(selectedBrands.length > 0 ? ['brands'] : []),
    ...(priceRange.min || priceRange.max ? ['price'] : []),
    ...(newArrivalsFilter ? ['arrivals'] : []),
    ...(recentlyUpdatedFilter ? ['updated'] : []),
    ...(weightRange.min || weightRange.max ? ['weight'] : []),
    ...(Object.values(dimensionFilters).some(d => d.min || d.max) ? ['dimensions'] : [])
  ].length

  if (isMobile) {
    return (
      <div className={`fixed inset-0 bg-white z-50 overflow-y-auto ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-steel-900">Advanced Filters</h2>
            <button
              onClick={() => onFilterChange(selectedFilters)} // Close mobile filters
              className="p-2 text-steel-600 hover:text-steel-900"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {activeFilterCount > 0 && (
            <div className="mb-6">
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters ({activeFilterCount})
              </button>
            </div>
          )}
          
          {/* Mobile filter content would go here */}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-steel-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-steel-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Advanced Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-medium rounded-md transition-colors"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className={`space-y-6 ${isLoading ? 'opacity-50' : ''}`}>
        {/* Brands Filter */}
        <div>
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-3"
          >
            Brands{selectedBrands.length > 0 ? ` (${selectedBrands.length} selected)` : ''}
            <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.has('brands') ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.has('brands') && (
            <div className="bg-white rounded-lg border border-steel-200">
              {/* Brand Search Bar */}
              <div className="p-3 border-b border-steel-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearchTerm}
                    onChange={(e) => onBrandSearchChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-steel-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Brand List */}
              <div className="max-h-64 overflow-y-auto p-3">
                <div className="space-y-2">
                  {/* Selected brands */}
                  {organizedBrands.selected.map((brand) => (
                    <label key={brand} className="flex items-center cursor-pointer hover:bg-steel-50 p-1 rounded bg-primary-50">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => handleBrandChange(brand)}
                        className="form-checkbox text-primary-600 rounded mr-3"
                      />
                      <span className="text-sm text-primary-700 font-medium">
                        {brand}
                      </span>
                    </label>
                  ))}
                  
                  {/* Separator if we have selected brands and other brands */}
                  {organizedBrands.selected.length > 0 && (organizedBrands.relevantUnselected.length > 0 || organizedBrands.additionalUnselected.length > 0) && (
                    <div className="border-t border-steel-200 my-2 pt-2"></div>
                  )}
                  
                  {/* Relevant unselected brands for this category */}
                  {organizedBrands.relevantUnselected.length > 0 && (
                    <>
                      {!brandSearchTerm && organizedBrands.selected.length === 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-steel-600 font-medium mb-1">Popular for {category?.name}:</p>
                        </div>
                      )}
                      {organizedBrands.relevantUnselected.map((brand) => (
                        <label key={brand} className="flex items-center cursor-pointer hover:bg-steel-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleBrandChange(brand)}
                            className="form-checkbox text-primary-600 rounded mr-3"
                          />
                          <span className="text-sm text-steel-700">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </>
                  )}
                  
                  {/* Additional brands (when showing all) */}
                  {organizedBrands.additionalUnselected.length > 0 && (
                    <>
                      {organizedBrands.relevantUnselected.length > 0 && (
                        <div className="border-t border-steel-200 my-2 pt-2">
                          <p className="text-xs text-steel-500 mb-1">Other brands:</p>
                        </div>
                      )}
                      {organizedBrands.additionalUnselected.map((brand) => (
                        <label key={brand} className="flex items-center cursor-pointer hover:bg-steel-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleBrandChange(brand)}
                            className="form-checkbox text-primary-600 rounded mr-3"
                          />
                          <span className="text-sm text-steel-600">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </>
                  )}
                  
                  {/* See All Brands button */}
                  {!organizedBrands.showingAll && organizedBrands.hasAdditionalBrands && (
                    <div className="border-t border-steel-200 mt-3 pt-3">
                      <button
                        onClick={() => setShowAllBrands(true)}
                        className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 hover:bg-primary-50 rounded"
                      >
                        See all brands ({getOtherBrands(getPrioritizedBrandsForProductTypes(category?.productTypeFilters || [])).length} more)
                      </button>
                    </div>
                  )}
                  
                  {/* Show fewer brands button */}
                  {showAllBrands && !brandSearchTerm && (
                    <div className="border-t border-steel-200 mt-3 pt-3">
                      <button
                        onClick={() => setShowAllBrands(false)}
                        className="w-full text-center text-sm text-steel-600 hover:text-steel-700 font-medium py-2 hover:bg-steel-50 rounded"
                      >
                        Show fewer brands
                      </button>
                    </div>
                  )}
                </div>
                
                {brandSearchTerm && organizedBrands.selected.length === 0 && organizedBrands.relevantUnselected.length === 0 && organizedBrands.additionalUnselected.length === 0 && (
                  <p className="text-sm text-steel-500 text-center py-4">
                    No brands found matching "{brandSearchTerm}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-3"
          >
            Price Range (USD)
            <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.has('price') ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.has('price') && (
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <div>
                  <label className="block text-xs text-steel-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
                    className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <span className="text-steel-400 mt-5">to</span>
                <div>
                  <label className="block text-xs text-steel-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={priceRange.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                    className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Arrivals Filter */}
        <div>
          <button
            onClick={() => toggleSection('arrivals')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-3"
          >
            New Arrivals
            <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.has('arrivals') ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.has('arrivals') && (
            <div className="space-y-2">
              {['7', '30', '90'].map((days) => (
                <label key={days} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="newArrivals"
                    value={days}
                    checked={newArrivalsFilter === days}
                    onChange={(e) => onNewArrivalsChange(e.target.value)}
                    className="form-radio text-primary-600 mr-3"
                  />
                  <span className="text-sm text-steel-700">Last {days} days</span>
                </label>
              ))}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="newArrivals"
                  value=""
                  checked={newArrivalsFilter === ''}
                  onChange={(e) => onNewArrivalsChange(e.target.value)}
                  className="form-radio text-primary-600 mr-3"
                />
                <span className="text-sm text-steel-700">All items</span>
              </label>
            </div>
          )}
        </div>

        {/* Recently Updated Filter */}
        <div>
          <button
            onClick={() => toggleSection('updated')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-3"
          >
            Recently Updated
            <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.has('updated') ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.has('updated') && (
            <div className="space-y-2">
              {['7', '30', '90'].map((days) => (
                <label key={days} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="recentlyUpdated"
                    value={days}
                    checked={recentlyUpdatedFilter === days}
                    onChange={(e) => onRecentlyUpdatedChange(e.target.value)}
                    className="form-radio text-primary-600 mr-3"
                  />
                  <span className="text-sm text-steel-700">Last {days} days</span>
                </label>
              ))}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="recentlyUpdated"
                  value=""
                  checked={recentlyUpdatedFilter === ''}
                  onChange={(e) => onRecentlyUpdatedChange(e.target.value)}
                  className="form-radio text-primary-600 mr-3"
                />
                <span className="text-sm text-steel-700">All items</span>
              </label>
            </div>
          )}
        </div>

        {/* Weight Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('weight')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-3"
          >
            Weight Range (lbs)
            <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.has('weight') ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.has('weight') && (
            <div className="flex gap-3 items-center">
              <div>
                <label className="block text-xs text-steel-600 mb-1">Min Weight</label>
                <input
                  type="number"
                  placeholder="0"
                  value={weightRange.min}
                  onChange={(e) => onWeightRangeChange({ ...weightRange, min: e.target.value })}
                  className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <span className="text-steel-400 mt-5">to</span>
              <div>
                <label className="block text-xs text-steel-600 mb-1">Max Weight</label>
                <input
                  type="number"
                  placeholder="100"
                  value={weightRange.max}
                  onChange={(e) => onWeightRangeChange({ ...weightRange, max: e.target.value })}
                  className="w-24 px-3 py-2 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Dimension Filters */}
        <div>
          <button
            onClick={() => toggleSection('dimensions')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-3"
          >
            Dimensions (inches)
            <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.has('dimensions') ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedSections.has('dimensions') && (
            <div className="space-y-4">
              {/* Length */}
              <div>
                <label className="block text-xs text-steel-600 mb-2">Length</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    placeholder="0"
                    value={dimensionFilters.length.min}
                    onChange={(e) => onDimensionFiltersChange({
                      ...dimensionFilters,
                      length: { ...dimensionFilters.length, min: e.target.value }
                    })}
                    className="w-20 px-2 py-1 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="text-steel-400 text-sm">to</span>
                  <input
                    type="number"
                    placeholder="100"
                    value={dimensionFilters.length.max}
                    onChange={(e) => onDimensionFiltersChange({
                      ...dimensionFilters,
                      length: { ...dimensionFilters.length, max: e.target.value }
                    })}
                    className="w-20 px-2 py-1 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Width */}
              <div>
                <label className="block text-xs text-steel-600 mb-2">Width</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    placeholder="0"
                    value={dimensionFilters.width.min}
                    onChange={(e) => onDimensionFiltersChange({
                      ...dimensionFilters,
                      width: { ...dimensionFilters.width, min: e.target.value }
                    })}
                    className="w-20 px-2 py-1 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="text-steel-400 text-sm">to</span>
                  <input
                    type="number"
                    placeholder="100"
                    value={dimensionFilters.width.max}
                    onChange={(e) => onDimensionFiltersChange({
                      ...dimensionFilters,
                      width: { ...dimensionFilters.width, max: e.target.value }
                    })}
                    className="w-20 px-2 py-1 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Height */}
              <div>
                <label className="block text-xs text-steel-600 mb-2">Height</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    placeholder="0"
                    value={dimensionFilters.height.min}
                    onChange={(e) => onDimensionFiltersChange({
                      ...dimensionFilters,
                      height: { ...dimensionFilters.height, min: e.target.value }
                    })}
                    className="w-20 px-2 py-1 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="text-steel-400 text-sm">to</span>
                  <input
                    type="number"
                    placeholder="100"
                    value={dimensionFilters.height.max}
                    onChange={(e) => onDimensionFiltersChange({
                      ...dimensionFilters,
                      height: { ...dimensionFilters.height, max: e.target.value }
                    })}
                    className="w-20 px-2 py-1 text-sm border border-steel-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Product Types - Moved to bottom */}
        {category && (
          <div className="pt-4 border-t border-steel-200">
            <button
              onClick={() => toggleSection('category-types')}
              className="flex items-center justify-between w-full text-left text-xs font-medium text-steel-600 mb-2"
            >
              Product Types in this Category
              <ChevronDown className={`h-3 w-3 transform transition-transform ${expandedSections.has('category-types') ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSections.has('category-types') && (
              <div className="bg-steel-50 rounded-md p-2">
                <div className="flex flex-wrap gap-1">
                  {category.productTypeFilters.map((type) => (
                    <span key={type} className="inline-flex items-center px-2 py-0.5 bg-steel-200 text-steel-700 text-xs rounded">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}