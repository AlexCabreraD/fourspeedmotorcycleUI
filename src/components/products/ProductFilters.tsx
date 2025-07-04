'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface ProductFiltersProps {
  categoryId: number
  selectedFilters: {
    product_type?: string
    brand?: string
    min_price?: string
    max_price?: string
    in_stock?: string
    drop_ship_eligible?: string
  }
  onFilterChange: (filters: Record<string, string>) => void
}

interface Brand {
  id: number
  name: string
  count?: number
}

// Common product types based on WPS API data
const COMMON_PRODUCT_TYPES = [
  'Suspension',
  'Hardware/Fasteners/Fittings',
  'Tire/Wheel Accessories',
  'Drive',
  'Intake/Carb/Fuel System',
  'Exhaust',
  'Stands/Lifts',
  'Accessories',
  'Grips',
  'Gloves',
  'Tools',
  'Chemicals',
  'Protective/Safety',
  'Wheels',
  'Electrical',
  'Engine',
  'Brakes',
  'Handlebars',
  'Helmets',
  'Apparel',
  'Tires',
  'Chains'
]

export default function ProductFilters({ categoryId, selectedFilters, onFilterChange }: ProductFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [productTypes, setProductTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    productType: true,
    brand: true,
    price: true,
    availability: false
  })

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true)
      
      try {
        // Fetch available brands with search capability and caching
        const brandsResponse = await fetch('/api/brands?limit=50')
        const brandsData = await brandsResponse.json()
        
        if (brandsData.success) {
          setBrands(brandsData.data)
        }

        // Try to fetch product types for this category using enhanced API
        try {
          const itemsResponse = await fetch(`/api/categories/${categoryId}/items?page=100`)
          const itemsData = await itemsResponse.json()
          
          if (itemsData.success && itemsData.data) {
            // Extract unique product types from items
            const types = new Set<string>()
            itemsData.data.forEach((item: { product_type?: string }) => {
              if (item.product_type) {
                types.add(item.product_type)
              }
            })
            
            if (types.size > 0) {
              setProductTypes(Array.from(types).sort())
            } else {
              setProductTypes(COMMON_PRODUCT_TYPES)
            }
          } else {
            setProductTypes(COMMON_PRODUCT_TYPES)
          }
        } catch {
          setProductTypes(COMMON_PRODUCT_TYPES)
        }
      } catch (error) {
        console.error('Failed to fetch filter data:', error)
        setProductTypes(COMMON_PRODUCT_TYPES)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterData()
  }, [categoryId])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...selectedFilters }
    
    if (value === '' || value === selectedFilters[key as keyof typeof selectedFilters]) {
      // Remove filter if empty or same value
      delete newFilters[key as keyof typeof selectedFilters]
    } else {
      newFilters[key as keyof typeof selectedFilters] = value
    }
    
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(selectedFilters).some(value => value && value !== '')

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-steel-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-steel-200 rounded w-24" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-steel-200 rounded w-32" />
              <div className="h-8 bg-steel-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-steel-200 p-4 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-steel-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-accent-600 hover:text-accent-700 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-steel-700">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (!value) return null
              
              const displayKey = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {displayKey}: {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Product Type Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('productType')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-steel-900">Product Type</h4>
          <ChevronDown 
            className={`h-4 w-4 text-steel-500 transition-transform ${
              expandedSections.productType ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.productType && (
          <div className="space-y-2">
            <div>
              <input
                type="radio"
                id="product-type-all"
                name="product-type"
                value=""
                checked={!selectedFilters.product_type}
                onChange={(e) => handleFilterChange('product_type', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="product-type-all" className="ml-2 text-sm text-steel-700">
                All Types
              </label>
            </div>
            {productTypes.map((type) => (
              <div key={type}>
                <input
                  type="radio"
                  id={`product-type-${type}`}
                  name="product-type"
                  value={type}
                  checked={selectedFilters.product_type === type}
                  onChange={(e) => handleFilterChange('product_type', e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor={`product-type-${type}`} className="ml-2 text-sm text-steel-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-steel-900">Brand</h4>
            <ChevronDown 
              className={`h-4 w-4 text-steel-500 transition-transform ${
                expandedSections.brand ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {expandedSections.brand && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <select
                value={selectedFilters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full form-input text-sm"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-steel-900">Price Range</h4>
          <ChevronDown 
            className={`h-4 w-4 text-steel-500 transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-steel-500 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={selectedFilters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="w-full form-input text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs text-steel-500 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="$1000"
                  value={selectedFilters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full form-input text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Quick Price Ranges */}
            <div className="space-y-1">
              <p className="text-xs text-steel-500">Quick Ranges:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button
                  onClick={() => onFilterChange({ ...selectedFilters, min_price: '0', max_price: '50' })}
                  className="p-1 text-left hover:bg-steel-50 rounded"
                >
                  Under $50
                </button>
                <button
                  onClick={() => onFilterChange({ ...selectedFilters, min_price: '50', max_price: '100' })}
                  className="p-1 text-left hover:bg-steel-50 rounded"
                >
                  $50 - $100
                </button>
                <button
                  onClick={() => onFilterChange({ ...selectedFilters, min_price: '100', max_price: '250' })}
                  className="p-1 text-left hover:bg-steel-50 rounded"
                >
                  $100 - $250
                </button>
                <button
                  onClick={() => onFilterChange({ ...selectedFilters, min_price: '250', max_price: '' })}
                  className="p-1 text-left hover:bg-steel-50 rounded"
                >
                  Over $250
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-steel-900">Availability</h4>
          <ChevronDown 
            className={`h-4 w-4 text-steel-500 transition-transform ${
              expandedSections.availability ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            <div>
              <input
                type="checkbox"
                id="in-stock"
                checked={selectedFilters.in_stock === 'true'}
                onChange={(e) => handleFilterChange('in_stock', e.target.checked ? 'true' : '')}
                className="text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="in-stock" className="ml-2 text-sm text-steel-700">
                In Stock Only
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="drop-ship"
                checked={selectedFilters.drop_ship_eligible === 'true'}
                onChange={(e) => handleFilterChange('drop_ship_eligible', e.target.checked ? 'true' : '')}
                className="text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="drop-ship" className="ml-2 text-sm text-steel-700">
                Drop Ship Available
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}