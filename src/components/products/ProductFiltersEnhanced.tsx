'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, X, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { 
  getFiltersForCategory, 
  getFilterOptionsByProductType,
  getSmartProductTypesForCategory,
  PRICE_RANGE_PRESETS,
  WEIGHT_RANGE_PRESETS,
  FilterSchema,
  FilterOption 
} from '@/lib/constants/filter-schemas'

interface ProductFiltersProps {
  categoryId: number
  categorySlug?: string
  selectedFilters: Record<string, string | string[]>
  onFilterChange: (filters: Record<string, string | string[]>) => void
  isLoading?: boolean
  className?: string
  isMobile?: boolean
}

interface Brand {
  id: number
  name: string
  count?: number
}

interface FilterComponentProps {
  filter: FilterSchema
  value: string | string[]
  onChange: (key: string, value: string | string[]) => void
  options?: FilterOption[]
  isExpanded: boolean
  onToggleExpanded: () => void
  selectedFilters: Record<string, string | string[]>
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

// Filter component for individual filter rendering
function FilterComponent({ filter, value, onChange, options, isExpanded, onToggleExpanded, selectedFilters }: FilterComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredOptions = useMemo(() => {
    if (!options || !searchTerm) return options
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm])

  const renderFilterContent = () => {
    switch (filter.type) {
      case 'select':
        return (
          <div className="space-y-2">
            {options && options.length > 10 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
            <select
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="w-full form-input text-sm"
            >
              <option value="">All {filter.label}</option>
              {(filteredOptions || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        )
        
      case 'multi-select':
        const arrayValue = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {options && options.length > 5 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-1.5 border border-steel-200 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}
            {(filteredOptions || []).map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${filter.key}-${option.value}`}
                  checked={arrayValue.includes(option.value)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...arrayValue, option.value]
                      : arrayValue.filter(v => v !== option.value)
                    onChange(filter.key, newValue)
                  }}
                  className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor={`${filter.key}-${option.value}`} className="ml-2 text-sm text-steel-700">
                  {option.label} {option.count ? `(${option.count})` : ''}
                </label>
              </div>
            ))}
          </div>
        )
        
      case 'checkbox':
        return (
          <div className="space-y-2">
            {(options || []).map((option) => {
              // Check if this is the in_stock option and should be default checked
              const isInStockOption = option.value === 'in_stock'
              const isChecked = selectedFilters[option.value] === 'true' || 
                (isInStockOption && selectedFilters[option.value] === undefined)
              
              return (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${filter.key}-${option.value}`}
                    checked={isChecked}
                    onChange={(e) => onChange(option.value, e.target.checked ? 'true' : '')}
                    className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                  />
                  <label htmlFor={`${filter.key}-${option.value}`} className="ml-2 text-sm text-steel-700">
                    {option.label}
                  </label>
                </div>
              )
            })}
          </div>
        )
        
      case 'price-range':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-steel-500 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={selectedFilters.min_price || ''}
                  onChange={(e) => onChange('min_price', e.target.value)}
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
                  onChange={(e) => onChange('max_price', e.target.value)}
                  className="w-full form-input text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-steel-500">Quick Ranges:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {PRICE_RANGE_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange('min_price', preset.min.toString())
                      onChange('max_price', preset.max?.toString() || '')
                    }}
                    className="p-1 text-left hover:bg-steel-50 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
        
      case 'weight-range':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-steel-500 mb-1">Min Weight (lbs)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={selectedFilters.min_weight || ''}
                  onChange={(e) => onChange('min_weight', e.target.value)}
                  className="w-full form-input text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-steel-500 mb-1">Max Weight (lbs)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={selectedFilters.max_weight || ''}
                  onChange={(e) => onChange('max_weight', e.target.value)}
                  className="w-full form-input text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-steel-500">Quick Ranges:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {WEIGHT_RANGE_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange('min_weight', preset.min.toString())
                      onChange('max_weight', preset.max?.toString() || '')
                    }}
                    className="p-1 text-left hover:bg-steel-50 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-left group hover:bg-steel-50 p-2 rounded-md transition-colors"
      >
        <h4 className="text-sm font-medium text-steel-900 group-hover:text-primary-600">
          {filter.label}
        </h4>
        <ChevronDown 
          className={`h-4 w-4 text-steel-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {isExpanded && (
        <div className="pb-2">
          {renderFilterContent()}
        </div>
      )}
    </div>
  )
}

export default function ProductFiltersEnhanced({ 
  categoryId, 
  categorySlug, 
  selectedFilters, 
  onFilterChange, 
  isLoading = false,
  className = '',
  isMobile = false
}: ProductFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [productTypes, setProductTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  
  // Get category-specific filters
  const categoryFilters = useMemo(() => {
    return getFiltersForCategory(categoryId, categorySlug || '')
  }, [categoryId, categorySlug])

  // Initialize expanded sections based on filter defaults
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {}
    categoryFilters.forEach(filter => {
      initialExpanded[filter.key] = filter.defaultExpanded ?? true
    })
    setExpandedSections(initialExpanded)
  }, [categoryFilters])
  
  // Initialize default filters (in stock)
  useEffect(() => {
    if (!loading && !isLoading && Object.keys(selectedFilters).length === 0) {
      // Set in stock as default only on initial load when no filters are set
      const defaultFilters = { in_stock: 'true' }
      onFilterChange(defaultFilters)
    }
  }, [loading, isLoading, selectedFilters, onFilterChange])
  
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true)
      
      try {
        // Fetch available brands with search capability and caching
        const brandsResponse = await fetch('/api/brands?limit=100')
        const brandsData = await brandsResponse.json()
        
        if (brandsData.success) {
          setBrands(brandsData.data)
        }

        // Try to fetch product types for this category using enhanced API
        try {
          const itemsResponse = await fetch(`/api/categories/${categoryId}/items?page[size]=100`)
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...selectedFilters }
    
    if (
      value === '' || 
      (Array.isArray(value) && value.length === 0) ||
      value === selectedFilters[key]
    ) {
      // Remove filter if empty or same value
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    
    onFilterChange(newFilters)
  }
  
  // Get filter options with dynamic data and smart defaults
  const getFilterOptions = (filter: FilterSchema): FilterOption[] => {
    switch (filter.key) {
      case 'product_type':
        // Use smart product types if available, fallback to fetched types, then common types
        let availableTypes = productTypes
        if (categorySlug) {
          const smartTypes = getSmartProductTypesForCategory(categorySlug)
          if (smartTypes.length > 0) {
            // Combine smart types with fetched types, prioritizing smart types
            const combinedTypes = [...new Set([...smartTypes, ...productTypes])]
            availableTypes = combinedTypes
          }
        }
        return availableTypes.map(type => ({ value: type, label: type }))
      case 'brand_id':
        return brands.map(brand => ({ value: brand.id.toString(), label: brand.name }))
      default:
        return filter.options || []
    }
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(selectedFilters).some(value => {
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return value && value !== ''
  })
  
  const getActiveFilterCount = () => {
    return Object.entries(selectedFilters).reduce((count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length
      }
      return value && value !== '' ? count + 1 : count
    }, 0)
  }

  if (loading || isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-steel-200 p-4 ${className}`}>
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
    <div className={`bg-white rounded-lg border border-steel-200 ${isMobile ? 'p-3' : 'p-4'} space-y-4 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5 text-steel-600" />
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-steel-900`}>
            Filters
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-accent-600 hover:text-accent-700 flex items-center transition-colors"
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
              if (!value || (Array.isArray(value) && value.length === 0)) return null
              
              const displayKey = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
              
              if (Array.isArray(value)) {
                return value.map((v, index) => (
                  <span
                    key={`${key}-${v}-${index}`}
                    className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                  >
                    {displayKey}: {v}
                    <button
                      onClick={() => {
                        const newValue = value.filter(item => item !== v)
                        handleFilterChange(key, newValue)
                      }}
                      className="ml-1 text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {displayKey}: {value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Dynamic Filters */}
      <div className="space-y-4">
        {categoryFilters.map((filter) => {
          const options = getFilterOptions(filter)
          return (
            <FilterComponent
              key={filter.key}
              filter={filter}
              value={selectedFilters[filter.key] || (filter.type === 'multi-select' ? [] : '')}
              onChange={handleFilterChange}
              options={options}
              isExpanded={expandedSections[filter.key] ?? false}
              onToggleExpanded={() => toggleSection(filter.key)}
              selectedFilters={selectedFilters}
            />
          )
        })}
      </div>
    </div>
  )
}