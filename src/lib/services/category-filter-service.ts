// Category filtering service - implements WPS-recommended approach
// Uses /items endpoint with smart filtering instead of taxonomy

import { createWPSClient, WPSItem, WPSApiClient } from '@/lib/api/wps-client'
import { CustomCategory, getCategoryBySlug, getProductTypesForCategory } from '@/lib/constants/custom-categories'

export interface CategoryFilterParams {
  // Basic filtering
  productTypes?: string[]
  search?: string
  
  // Price filtering
  minPrice?: number
  maxPrice?: number
  
  // Availability
  inStock?: boolean
  
  // Pagination
  pageSize?: number
  cursor?: string
  
  // Sorting
  sortBy?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest'
  
  // Additional filters
  additionalFilters?: Record<string, any>
}

export interface CategoryFilterResult {
  items: WPSItem[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  appliedFilters: CategoryFilterParams
  category: CustomCategory
}

export class CategoryFilterService {
  private client: WPSApiClient

  constructor(client?: WPSApiClient) {
    this.client = client || createWPSClient()
  }

  async getItemsForCategory(
    categorySlug: string, 
    params: CategoryFilterParams = {}
  ): Promise<CategoryFilterResult> {
    const category = getCategoryBySlug(categorySlug)
    if (!category) {
      throw new Error(`Category '${categorySlug}' not found`)
    }

    // Build the query parameters
    const query = this.client.createQuery()

    // Set page size
    query.pageSize(params.pageSize || 21)

    // Set cursor for pagination
    if (params.cursor) {
      query.cursor(params.cursor)
    }

    // Apply sorting
    this.applySorting(query, params.sortBy || 'name_asc')

    // Apply category-specific product type filters
    const categoryProductTypes = params.productTypes || category.productTypeFilters
    if (categoryProductTypes.length > 0) {
      if (categoryProductTypes.length === 1) {
        query.filterByProductType(categoryProductTypes[0])
      } else {
        // Multiple product types - use first one for now since WPS doesn't support OR queries
        query.filterByProductType(categoryProductTypes[0])
      }
    }


    // Apply search filtering
    if (params.search) {
      query.filterByName(params.search, 'con')
    }

    // Apply price range filtering
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      query.filterByPriceRange(params.minPrice, params.maxPrice)
    }

    // Apply stock filtering
    if (params.inStock) {
      query.filterByStatus('STK')
    }

    // Apply additional filters
    if (params.additionalFilters) {
      Object.entries(params.additionalFilters).forEach(([key, value]) => {
        // Parse filter key and operator for WPS API
        if (key.includes('[') && key.includes(']')) {
          const [field, operator] = key.split('[')
          const op = operator.replace(']', '')
          query.addFilter(field, op, value)
        } else {
          query.addFilter(key, 'eq', value)
        }
      })
    }

    // Apply category-specific name patterns if defined and no search is provided
    if (!params.search && category.namePatterns) {
      // Use first name pattern for now since WPS doesn't support OR queries
      query.filterByName(category.namePatterns[0], 'con')
    }

    // Apply category price range if defined and no specific range provided
    if (!params.minPrice && !params.maxPrice && category.priceRange) {
      query.filterByPriceRange(category.priceRange.min, category.priceRange.max)
    }

    // Include related data
    query.includeImages().includeBrand()

    try {
      // Execute the query
      const response = await this.client.executeQuery('items', query)

      return {
        items: response.data,
        totalCount: response.data.length,
        hasMore: !!response.meta?.cursor?.next,
        nextCursor: response.meta?.cursor?.next,
        appliedFilters: params,
        category
      }

    } catch (error) {
      console.error(`Error fetching items for category ${categorySlug}:`, error)
      throw error
    }
  }

  private applySorting(query: any, sortBy: string) {
    switch (sortBy) {
      case 'name_asc':
        query.sortByName('asc')
        break
      case 'name_desc':
        query.sortByName('desc')
        break
      case 'price_asc':
        query.sortByPrice('asc')
        break
      case 'price_desc':
        query.sortByPrice('desc')
        break
      case 'newest':
        query.sortByDate('created_at', 'desc')
        break
      case 'oldest':
        query.sortByDate('created_at', 'asc')
        break
      default:
        query.sortByName('asc')
    }
  }


  // Get price range for a category
  async getPriceRangeForCategory(categorySlug: string): Promise<{ min: number; max: number }> {
    const category = getCategoryBySlug(categorySlug)
    if (!category) return { min: 0, max: 1000 }

    try {
      const query = this.client.createQuery()
      query.pageSize(100)
      
      // Apply product type filters
      if (category.productTypeFilters.length > 0) {
        query.filterByProductType(category.productTypeFilters[0])
      }
      
      const response = await this.client.executeQuery('items', query)
      
      let min = Infinity
      let max = 0
      
      response.data.forEach((item: WPSItem) => {
        const price = parseFloat(item.list_price)
        if (!isNaN(price)) {
          min = Math.min(min, price)
          max = Math.max(max, price)
        }
      })
      
      return {
        min: min === Infinity ? 0 : Math.floor(min),
        max: Math.ceil(max)
      }
      
    } catch (error) {
      console.error(`Error getting price range for category ${categorySlug}:`, error)
      return { min: 0, max: 1000 }
    }
  }

  // Search within a specific category
  async searchInCategory(
    categorySlug: string, 
    searchQuery: string, 
    params: Omit<CategoryFilterParams, 'search'> = {}
  ): Promise<CategoryFilterResult> {
    return this.getItemsForCategory(categorySlug, {
      ...params,
      search: searchQuery
    })
  }

  // Get featured items for a category
  async getFeaturedItemsForCategory(
    categorySlug: string, 
    limit: number = 9
  ): Promise<WPSItem[]> {
    try {
      const result = await this.getItemsForCategory(categorySlug, {
        pageSize: limit,
        sortBy: 'newest',
        inStock: true
      })
      
      return result.items
    } catch (error) {
      console.error(`Error getting featured items for category ${categorySlug}:`, error)
      return []
    }
  }
}

// Create singleton instance
export const categoryFilterService = new CategoryFilterService()

// Helper functions for easy use
export const getItemsForCategory = (categorySlug: string, params?: CategoryFilterParams) =>
  categoryFilterService.getItemsForCategory(categorySlug, params)


export const getPriceRangeForCategory = (categorySlug: string) =>
  categoryFilterService.getPriceRangeForCategory(categorySlug)

export const searchInCategory = (categorySlug: string, searchQuery: string, params?: Omit<CategoryFilterParams, 'search'>) =>
  categoryFilterService.searchInCategory(categorySlug, searchQuery, params)

export const getFeaturedItemsForCategory = (categorySlug: string, limit?: number) =>
  categoryFilterService.getFeaturedItemsForCategory(categorySlug, limit)