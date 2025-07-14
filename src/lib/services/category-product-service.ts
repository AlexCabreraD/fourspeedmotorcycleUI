// Category product service - fetches products instead of items to avoid duplicates
// Uses /products endpoint with include=items to group variants properly

import { createWPSClient, WPSProduct, WPSApiClient } from '@/lib/api/wps-client'
import { CustomCategory, getCategoryBySlug } from '@/lib/constants/custom-categories'

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

export interface CategoryProductResult {
  products: WPSProduct[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  appliedFilters: CategoryFilterParams
  category: CustomCategory
}

export class CategoryProductService {
  private client: WPSApiClient

  constructor(client?: WPSApiClient) {
    this.client = client || createWPSClient()
  }

  async getProductsForCategory(
    categorySlug: string, 
    params: CategoryFilterParams = {}
  ): Promise<CategoryProductResult> {
    const category = getCategoryBySlug(categorySlug)
    if (!category) {
      throw new Error(`Category '${categorySlug}' not found`)
    }

    // Build the query parameters for products endpoint
    const query = this.client.createQuery()

    // Set page size
    query.pageSize(params.pageSize || 21)

    // Set cursor for pagination
    if (params.cursor) {
      query.cursor(params.cursor)
    }

    // Include items with each product to get variant information
    query.include('items,images')

    // Apply sorting
    this.applySorting(query, params.sortBy || 'name_asc')

    // Apply search filtering on product name  
    if (params.search) {
      query.filterByName(params.search, 'con')
    }
    
    // Temporarily remove apparel-specific filtering for debugging

    // Apply additional filters
    if (params.additionalFilters) {
      Object.entries(params.additionalFilters).forEach(([key, value]) => {
        // Parse filter key and operator for WPS API
        if (key.includes('[') && key.includes(']')) {
          const matches = key.match(/([^[]+)\[([^\]]+)\]/)
          if (matches) {
            const [, field, operator] = matches
            // Use filterByName for name-based searches with contains operator
            if (field === 'name' && operator === 'con') {
              query.filterByName(value, 'con')
            }
          }
        }
      })
    }

    try {
      // Execute the query to get products
      console.log('CategoryProductService: Querying products with params:', query.build())
      const result = await this.client.getProducts(query.build())
      console.log('CategoryProductService: Raw products result:', result.data.length, 'products')
      
      // Debug: log sample of actual product types we're getting
      if (result.data.length > 0) {
        const sampleTypes = new Set()
        result.data.slice(0, 10).forEach(product => {
          console.log('CategoryProductService: Product structure:', {
            id: product.id,
            name: product.name,
            items: product.items ? 'exists' : 'missing',
            itemsType: typeof product.items,
            itemsData: product.items?.data ? 'has data property' : 'no data property',
            itemsLength: Array.isArray(product.items?.data) ? product.items.data.length : 'not array'
          })
          if (product.items?.data && Array.isArray(product.items.data)) {
            product.items.data.forEach(item => sampleTypes.add(item.product_type))
          }
        })
        console.log('CategoryProductService: Sample actual product types:', Array.from(sampleTypes))
      }
      
      // Filter products by category's product types if specified
      let filteredProducts = result.data
      const categoryProductTypes = params.productTypes || category.productTypeFilters
      console.log('CategoryProductService: Category product types:', categoryProductTypes)
      
      // Temporarily disable product type filtering to debug why we're not getting products
      console.log('CategoryProductService: Temporarily disabling product type filtering for debugging')
      // if (categoryProductTypes.length > 0) {
      //   filteredProducts = result.data.filter(product => {
      //     // Check if any of the product's items match the category product types
      //     if (product.items?.data && Array.isArray(product.items.data) && product.items.data.length > 0) {
      //       const hasMatchingType = product.items.data.some(item => 
      //         categoryProductTypes.includes(item.product_type)
      //       )
      //       if (hasMatchingType) {
      //         console.log('CategoryProductService: Product matches type:', product.name, 'with types:', product.items.data.map(i => i.product_type))
      //       }
      //       return hasMatchingType
      //     }
      //     return false
      //   })
      //   console.log('CategoryProductService: After product type filtering:', filteredProducts.length, 'products')
      // }

      // Apply price filtering if specified (on item level)
      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => {
          if (product.items?.data && Array.isArray(product.items.data) && product.items.data.length > 0) {
            return product.items.data.some(item => {
              const price = parseFloat(item.list_price)
              if (params.minPrice !== undefined && price < params.minPrice) return false
              if (params.maxPrice !== undefined && price > params.maxPrice) return false
              return true
            })
          }
          return false
        })
      }

      // Temporarily disable stock filtering for debugging
      console.log('CategoryProductService: Temporarily disabling stock filtering for debugging')
      // if (params.inStock) {
      //   filteredProducts = filteredProducts.filter(product => {
      //     if (product.items?.data && Array.isArray(product.items.data) && product.items.data.length > 0) {
      //       return product.items.data.some(item => item.status === 'STK')
      //     }
      //     return false
      //   })
      // }

      return {
        products: filteredProducts,
        totalCount: filteredProducts.length,
        hasMore: !!result.meta?.cursor?.next,
        nextCursor: result.meta?.cursor?.next || undefined,
        appliedFilters: params,
        category
      }

    } catch (error) {
      console.error('Error fetching products for category:', error)
      throw error
    }
  }

  private applySorting(query: any, sortBy: string) {
    switch (sortBy) {
      case 'name_asc':
        query.sortBy('name', 'asc')
        break
      case 'name_desc':
        query.sortBy('name', 'desc')
        break
      case 'newest':
        query.sortBy('created_at', 'desc')
        break
      case 'oldest':
        query.sortBy('created_at', 'asc')
        break
      default:
        query.sortBy('name', 'asc')
    }
  }
}