'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, X, Filter, Search, SlidersHorizontal, Loader2 } from 'lucide-react'
import { 
  getFiltersForCustomCategory, 
  FilterSchema, 
  FilterOption,
  PRICE_RANGE_PRESETS 
} from '@/lib/constants/custom-category-filters'

interface CustomCategoryFiltersProps {
  categorySlug: string
  selectedFilters: Record<string, string | string[]>
  onFilterChange: (filters: Record<string, string | string[]>) => void
  isLoading?: boolean
  className?: string
  isMobile?: boolean
}


interface FilterComponentProps {
  filter: FilterSchema
  value: string | string[]
  onChange: (key: string, value: string | string[]) => void
  options?: FilterOption[]
  isExpanded: boolean
  onToggleExpanded: () => void
  priceRange?: { min: number; max: number }
}

function SearchFilter({ filter, value, onChange }: Omit<FilterComponentProps, 'isExpanded' | 'onToggleExpanded'>) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-steel-900 mb-2">
        {filter.label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel-400" />
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          placeholder={filter.placeholder}
          className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    </div>
  )
}

function SelectFilter({ filter, value, onChange, options = [], isExpanded, onToggleExpanded }: FilterComponentProps) {
  const currentValue = value as string || ''
  
  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-2"
      >
        {filter.label}
        <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value=""
              checked={currentValue === ''}
              onChange={() => onChange(filter.key, '')}
              className="mr-3 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-steel-700">All</span>
          </label>
          {options.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                value={option.value}
                checked={currentValue === option.value}
                onChange={() => onChange(filter.key, option.value)}
                className="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-steel-700">
                {option.label}
                {option.count && <span className="text-steel-500 ml-1">({option.count})</span>}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiSelectFilter({ filter, value, onChange, options = [], isExpanded, onToggleExpanded }: FilterComponentProps) {
  const currentValue = Array.isArray(value) ? value : (value ? [value as string] : [])
  
  const filterOptions = options

  const handleChange = (optionValue: string, checked: boolean) => {
    let newValue: string[]
    if (checked) {
      newValue = [...currentValue, optionValue]
    } else {
      newValue = currentValue.filter(v => v !== optionValue)
    }
    onChange(filter.key, newValue)
  }

  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-2"
      >
        {filter.label}
        {currentValue.length > 0 && (
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
            {currentValue.length}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={currentValue.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                className="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-steel-700">
                {option.label}
                {option.count && <span className="text-steel-500 ml-1">({option.count})</span>}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function CheckboxFilter({ filter, value, onChange, options = [], isExpanded, onToggleExpanded }: FilterComponentProps) {
  const currentValue = Array.isArray(value) ? value : (value ? [value as string] : [])

  const handleChange = (optionValue: string, checked: boolean) => {
    let newValue: string[]
    if (checked) {
      newValue = [...currentValue, optionValue]
    } else {
      newValue = currentValue.filter(v => v !== optionValue)
    }
    onChange(filter.key, newValue)
  }

  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-2"
      >
        {filter.label}
        <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={currentValue.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                className="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-steel-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function PriceRangeFilter({ filter, value, onChange, priceRange, isExpanded, onToggleExpanded }: FilterComponentProps) {
  const currentValue = value as string || ''
  const [customMin, setCustomMin] = useState('')
  const [customMax, setCustomMax] = useState('')
  
  // Parse current value if it's a custom range
  const parseCustomRange = (val: string) => {
    if (val.includes('-')) {
      const [min, max] = val.split('-')
      return { min: min || '', max: max || '' }
    }
    return { min: '', max: '' }
  }

  const handlePresetChange = (preset: string) => {
    onChange(filter.key, preset)
    setCustomMin('')
    setCustomMax('')
  }

  const handleCustomRange = () => {
    if (customMin || customMax) {
      const rangeValue = `${customMin}-${customMax}`
      onChange(filter.key, rangeValue)
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-steel-900 mb-2"
      >
        {filter.label}
        <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          {/* Preset ranges */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value=""
                checked={currentValue === ''}
                onChange={() => handlePresetChange('')}
                className="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-steel-700">All Prices</span>
            </label>
            {PRICE_RANGE_PRESETS.map((preset) => {
              const presetValue = `${preset.min}-${preset.max || ''}`
              return (
                <label key={preset.label} className="flex items-center">
                  <input
                    type="radio"
                    value={presetValue}
                    checked={currentValue === presetValue}
                    onChange={() => handlePresetChange(presetValue)}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-steel-700">{preset.label}</span>
                </label>
              )
            })}
          </div>
          
          {/* Custom range */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium text-steel-900 mb-2">Custom Range</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-steel-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-steel-500 text-sm">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border border-steel-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={handleCustomRange}
                className="w-full px-3 py-1 text-sm bg-accent-600 text-white rounded hover:bg-accent-700 transition-colors"
              >
                Apply Range
              </button>
            </div>
          </div>
          
          {priceRange && (
            <div className="text-xs text-steel-500 mt-2">
              Price range: ${priceRange.min} - ${priceRange.max}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CustomCategoryFilters({
  categorySlug,
  selectedFilters,
  onFilterChange,
  isLoading = false,
  className = '',
  isMobile = false
}: CustomCategoryFiltersProps) {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [loadingMetadata, setLoadingMetadata] = useState(false)

  const filters = useMemo(() => getFiltersForCustomCategory(categorySlug), [categorySlug])

  // Load category metadata (brands and price range)
  useEffect(() => {
    const loadMetadata = async () => {
      setLoadingMetadata(true)
      try {
        const response = await fetch(`/api/custom-categories/${categorySlug}/metadata?include=price_range`)
        const data = await response.json()
        
        if (data.success) {
          if (data.data.priceRange) {
            setPriceRange(data.data.priceRange)
          }
        }
      } catch (error) {
        console.error('Failed to load category metadata:', error)
      } finally {
        setLoadingMetadata(false)
      }
    }

    if (categorySlug) {
      loadMetadata()
    }
  }, [categorySlug])

  // Set default expanded filters and default values
  useEffect(() => {
    const defaultExpanded = new Set(
      filters.filter(f => f.defaultExpanded).map(f => f.key)
    )
    setExpandedFilters(defaultExpanded)
    
    // Set default "in stock only" to true if not already set
    if (!selectedFilters.hasOwnProperty('in_stock')) {
      onFilterChange({ ...selectedFilters, in_stock: ['true'] })
    }
  }, [filters])

  const toggleExpanded = (filterKey: string) => {
    const newExpanded = new Set(expandedFilters)
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey)
    } else {
      newExpanded.add(filterKey)
    }
    setExpandedFilters(newExpanded)
  }

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...selectedFilters }
    
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const activeFilterCount = Object.keys(selectedFilters).filter(key => {
    const value = selectedFilters[key]
    return value !== '' && !(Array.isArray(value) && value.length === 0)
  }).length

  const renderFilter = (filter: FilterSchema) => {
    const value = selectedFilters[filter.key] || ''
    const isExpanded = expandedFilters.has(filter.key)
    
    const commonProps = {
      filter,
      value,
      onChange: handleFilterChange,
      isExpanded,
      onToggleExpanded: () => toggleExpanded(filter.key),
      options: filter.options,
      priceRange
    }

    switch (filter.type) {
      case 'search':
        return <SearchFilter key={filter.key} {...commonProps} />
      case 'select':
        return <SelectFilter key={filter.key} {...commonProps} />
      case 'multi-select':
        return <MultiSelectFilter key={filter.key} {...commonProps} />
      case 'checkbox':
        return <CheckboxFilter key={filter.key} {...commonProps} />
      case 'price-range':
        return <PriceRangeFilter key={filter.key} {...commonProps} />
      default:
        return null
    }
  }

  if (isMobile) {
    return (
      <div className={`fixed inset-0 bg-white z-50 overflow-y-auto ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-steel-900">Filters</h2>
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
          
          {loadingMetadata && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-steel-400" />
              <span className="ml-2 text-steel-600">Loading filters...</span>
            </div>
          )}
          
          <div className={`space-y-4 ${isLoading ? 'opacity-50' : ''}`}>
            {filters.map(renderFilter)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-steel-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-steel-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>
      
      {loadingMetadata && (
        <div className="flex items-center justify-center py-4 mb-4">
          <Loader2 className="h-4 w-4 animate-spin text-steel-400" />
          <span className="ml-2 text-sm text-steel-600">Loading filters...</span>
        </div>
      )}
      
      <div className={`space-y-4 ${isLoading ? 'opacity-50' : ''}`}>
        {filters.map(renderFilter)}
      </div>
    </div>
  )
}