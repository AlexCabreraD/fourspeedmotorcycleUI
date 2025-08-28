// lib/api/services.ts - FIXED VERSION
// Service layer for common business logic and data transformations

import {
  createWPSClient,
  ImageUtils,
  WPSApiClient,
  WPSBrand,
  WPSImage,
  WPSItem,
  WPSProduct,
  WPSTaxonomyterm,
} from './wps-client'

// Enhanced interfaces for our application (keeping the same)
export interface EnhancedProduct extends WPSProduct {
  primaryImage?: WPSImage
  imageUrls?: {
    thumbnail: string
    medium: string
    large: string
    full: string
  }
  priceRange?: {
    min: number
    max: number
    formatted: {
      min: string
      max: string
    }
  }
  inStock?: boolean
  totalInventory?: number
  brand?: WPSBrand
}

export interface EnhancedItem extends WPSItem {
  formattedPrice: string
  inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
  inventoryDisplay: string
  imageUrls?: {
    thumbnail: string
    medium: string
    large: string
    full: string
  }
  seoUrl: string
}

export interface CategoryWithProducts extends WPSTaxonomyterm {
  products?: EnhancedProduct[]
  productCount?: number
}

export interface SearchResult {
  query: string
  products: EnhancedProduct[]
  items: EnhancedItem[]
  totalResults: number
  hasMore: boolean
  nextCursor?: string
}

// Main API Service Class - FIXED
export class WPSApiService {
  private client: WPSApiClient

  constructor(client?: WPSApiClient) {
    this.client = client || createWPSClient()
  }

  // PRODUCT SERVICES - FIXED

  async getEnhancedProducts(params?: any): Promise<EnhancedProduct[]> {
    try {
      console.log('Service: getEnhancedProducts called with params:', params)

      // FIXED: Use only supported includes for products endpoint
      // Based on the error, 'brands' is not supported, so we'll use items,images only
      const requestParams: any = {
        include: 'items,images',
        ...params,
      }

      // Override include if it was passed in params to avoid conflicts
      if (params?.include) {
        // Filter out unsupported includes
        const allowedIncludes = ['items', 'images', 'features']
        const requestedIncludes = params.include.split(',').map((s: string) => s.trim())
        const validIncludes = requestedIncludes.filter((inc: string) =>
          allowedIncludes.includes(inc)
        )
        requestParams.include = validIncludes.join(',')
      }

      // Convert page[size] format if needed
      if (params && typeof params['page[size]'] !== 'undefined') {
        requestParams['page[size]'] = params['page[size]']
        delete requestParams.pageSize // Remove any conflicting params
      } else if (params && params.pageSize) {
        requestParams['page[size]'] = params.pageSize
        delete requestParams.pageSize
      } else if (!requestParams['page[size]']) {
        requestParams['page[size]'] = 20 // Default page size
      }

      console.log('Making API call with cleaned params:', requestParams)
      const response = await this.client.getProducts(requestParams)

      console.log('API response received, enhancing products...')

      // If we need brand data and it wasn't included, we'll need to fetch it separately
      // For now, let's enhance without brand data and add a note about this limitation
      const enhancedProducts = response.data.map((product) => this.enhanceProduct(product))

      // Optionally: fetch brand data separately if needed
      // This would require additional API calls but provides complete data
      if (params?.includeBrands && enhancedProducts.length > 0) {
        await this.addBrandDataToProducts(enhancedProducts)
      }

      return enhancedProducts
    } catch (error) {
      console.error('Error in getEnhancedProducts:', error)
      throw error
    }
  }

  async getEnhancedProduct(id: number | string): Promise<EnhancedProduct | null> {
    try {
      console.log('Service: getEnhancedProduct called with id:', id)

      // FIXED: Use only supported includes for products endpoint
      const response = await this.client.getProduct(id, {
        include: 'items,images,features', // Removed 'brands' as it's not supported
      })

      console.log('Product data received, enhancing...')
      const enhancedProduct = this.enhanceProduct(response.data)

      // If we need brand data, fetch it separately using the brand_id from items
      if (response.data.items && response.data.items.length > 0) {
        const brandId = response.data.items[0].brand_id
        if (brandId) {
          try {
            const brandResponse = await this.client.getBrand(brandId)
            enhancedProduct.brand = brandResponse.data
          } catch (brandError) {
            console.warn('Could not fetch brand data:', brandError)
          }
        }
      }

      return enhancedProduct
    } catch (error: unknown) {
      console.error('Error in getEnhancedProduct:', error)

      if (error instanceof Error && error.name === 'WPSNotFoundError') {
        return null
      }
      throw error
    }
  }

  async getProductsByCategory(
    categoryId: number,
    params?: any
  ): Promise<{
    products: EnhancedProduct[]
    category: WPSTaxonomyterm
    hasMore: boolean
    nextCursor?: string
  }> {
    // Get category info
    const categoryResponse = await this.client.getTaxonomyterm(categoryId)

    // FIXED: Use only supported includes for products endpoint
    const requestParams: any = {
      include: 'items,images', // Removed 'brands' as it's not supported
      'page[size]': 20,
      ...params,
    }

    // Get products in category
    const productsResponse = await this.client.getTaxonomytermProducts(categoryId, requestParams)

    return {
      products: productsResponse.data.map((product) => this.enhanceProduct(product)),
      category: categoryResponse.data,
      hasMore: !!productsResponse.meta?.cursor?.next,
      nextCursor: productsResponse.meta?.cursor?.next || undefined,
    }
  }

  async searchProducts(
    query: string,
    filters?: {
      brandIds?: number[]
      priceMin?: number
      priceMax?: number
      categoryId?: number
      pageSize?: number
      cursor?: string
    }
  ): Promise<SearchResult> {
    try {
      console.log('Service: searchProducts called with query:', query, 'filters:', filters)

      // FIXED: Use only supported includes for products endpoint
      const params: any = {
        include: 'items,images', // Removed 'brands' as it's not supported
      }

      // Handle page size
      if (filters?.pageSize) {
        params['page[size]'] = filters.pageSize
      } else {
        params['page[size]'] = 12 // Default
      }

      // Handle cursor
      if (filters?.cursor) {
        params['page[cursor]'] = filters.cursor
      }

      // Handle brand filter
      if (filters?.brandIds && filters.brandIds.length > 0) {
        // For multiple brands, you might need to make multiple requests
        // or use a different filter format based on API capabilities
        params['filter[brand_id]'] = filters.brandIds[0] // Taking first brand for now
      }

      // Handle price filters
      if (filters?.priceMin !== undefined) {
        params['filter[list_price][gt]'] = filters.priceMin
      }
      if (filters?.priceMax !== undefined) {
        params['filter[list_price][lt]'] = filters.priceMax
      }

      console.log('Calling searchProducts with params:', params)

      // Search products by name
      const productResponse = await this.client.searchProducts(query, params)

      // Search items by SKU if query looks like a part number
      let itemResponse: any = { data: [] }
      if (/^[a-zA-Z0-9-]+$/.test(query) && query.length >= 3) {
        try {
          const itemParams = {
            include: 'product,images',
            'page[size]': 10,
          }
          itemResponse = await this.client.searchItemsBySku(query, itemParams)
        } catch (error) {
          console.warn('SKU search failed, continuing with product search only:', error)
        }
      }

      const enhancedProducts = productResponse.data.map((product) => this.enhanceProduct(product))
      const enhancedItems = itemResponse.data.map((item: WPSItem) => this.enhanceItem(item))

      return {
        query,
        products: enhancedProducts,
        items: enhancedItems,
        totalResults: enhancedProducts.length + enhancedItems.length,
        hasMore: !!productResponse.meta?.cursor?.next,
        nextCursor: productResponse.meta?.cursor?.next || undefined,
      }
    } catch (error) {
      console.error('Error in searchProducts:', error)
      throw error
    }
  }

  // CATEGORY SERVICES - FIXED

  async getCategories(): Promise<CategoryWithProducts[]> {
    try {
      console.log('Service: getCategories called')

      const params = {
        'page[size]': 100,
        'sort[asc]': 'name',
      }

      const response = await this.client.getTaxonomyterms(params)

      console.log('Categories received:', response.data.length)
      return response.data.map((category) => ({
        ...category,
        products: [],
        productCount: 0,
      }))
    } catch (error) {
      console.error('Error in getCategories:', error)
      throw error
    }
  }

  async getCategoryTree(): Promise<CategoryWithProducts[]> {
    const categories = await this.getCategories()

    // Build tree structure based on parent_id and depth
    const buildTree = (parentId: number | null, depth: number = 0): CategoryWithProducts[] => {
      return categories
        .filter((cat) => cat.parent_id === parentId)
        .sort((a, b) => a.left - b.left)
        .map((category) => ({
          ...category,
          children: buildTree(category.id, depth + 1),
        }))
    }

    return buildTree(null)
  }

  // BRAND SERVICES

  async getBrands(): Promise<WPSBrand[]> {
    const params = {
      'page[size]': 100,
      'sort[asc]': 'name',
    }
    const response = await this.client.getBrands(params)
    return response.data
  }

  async getPopularBrands(limit: number = 20): Promise<WPSBrand[]> {
    // Get brands with their item count (simplified approach)
    const brands = await this.getBrands()
    return brands.slice(0, limit) // In a real app, you'd sort by popularity
  }

  // INVENTORY SERVICES

  async checkItemInventory(itemId: number): Promise<{
    inStock: boolean
    quantity: number
    status: 'in_stock' | 'low_stock' | 'out_of_stock'
    display: string
    warehouseBreakdown: Record<string, number>
  }> {
    try {
      const response = await this.client.getInventoryByItem(itemId)

      if (response.data.length === 0) {
        return {
          inStock: false,
          quantity: 0,
          status: 'out_of_stock',
          display: 'Out of stock',
          warehouseBreakdown: {},
        }
      }

      const inventory = response.data[0]
      const quantity = inventory.total

      return {
        inStock: quantity > 0,
        quantity: quantity >= 25 ? 25 : quantity, // API caps at 25
        status: quantity === 0 ? 'out_of_stock' : quantity < 5 ? 'low_stock' : 'in_stock',
        display:
          quantity === 0 ? 'Out of stock' : quantity >= 25 ? 'In stock' : `${quantity} in stock`,
        warehouseBreakdown: {
          california: inventory.ca_warehouse,
          georgia: inventory.ga_warehouse,
          idaho: inventory.id_warehouse,
          indiana: inventory.in_warehouse,
          pennsylvania: inventory.pa_warehouse,
          texas: inventory.tx_warehouse,
        },
      }
    } catch (_error: unknown) {
      return {
        inStock: false,
        quantity: 0,
        status: 'out_of_stock',
        display: 'Stock unknown',
        warehouseBreakdown: {},
      }
    }
  }

  // CART SERVICES

  async createShoppingCart(customerInfo?: {
    email?: string
    shippingAddress?: any
  }): Promise<string> {
    const poNumber = `CART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const response = await this.client.createCart({
      po_number: poNumber,
      default_warehouse: process.env.WPS_DEFAULT_WAREHOUSE || 'ID',
      ship_via: process.env.WPS_DEFAULT_SHIP_VIA || 'BEST',
      allow_backorder: true,
      multiple_warehouse: true,
      ...customerInfo,
    })

    return response.data.cart_number
  }

  async addToCart(
    cartId: string,
    item: {
      itemId?: number
      sku?: string
      quantity: number
      note?: string
    }
  ): Promise<any> {
    return this.client.addItemToCart(cartId, {
      item_id: item.itemId,
      item_sku: item.sku,
      quantity: item.quantity,
      note: item.note,
    })
  }

  async getCartDetails(cartId: string): Promise<any> {
    return this.client.getCart(cartId)
  }

  async submitOrder(cartId: string): Promise<string> {
    const response = await this.client.createOrder(cartId)
    return response.data.order_number
  }

  // UTILITY METHODS

  // Helper method to add brand data to products when needed
  private async addBrandDataToProducts(products: EnhancedProduct[]): Promise<void> {
    try {
      // Get unique brand IDs from all products
      const brandIds = new Set<number>()
      products.forEach((product) => {
        if (product.items && product.items.length > 0) {
          product.items.forEach((item) => {
            if (item.brand_id) {
              brandIds.add(item.brand_id)
            }
          })
        }
      })

      // Fetch brand data for all unique brand IDs
      const brandPromises = Array.from(brandIds).map(async (brandId) => {
        try {
          const brandResponse = await this.client.getBrand(brandId)
          return { id: brandId, data: brandResponse.data }
        } catch (error) {
          console.warn(`Could not fetch brand ${brandId}:`, error)
          return null
        }
      })

      const brandResults = await Promise.all(brandPromises)
      const brandsMap = new Map<number, WPSBrand>()

      brandResults.forEach((result) => {
        if (result) {
          brandsMap.set(result.id, result.data)
        }
      })

      // Add brand data to products
      products.forEach((product) => {
        if (product.items && product.items.length > 0) {
          const firstItem = product.items[0]
          if (firstItem.brand_id && brandsMap.has(firstItem.brand_id)) {
            product.brand = brandsMap.get(firstItem.brand_id)
          }
        }
      })
    } catch (error) {
      console.warn('Error adding brand data to products:', error)
      // Don't throw - brand data is enhancement, not critical
    }
  }

  private enhanceProduct(product: WPSProduct): EnhancedProduct {
    const enhanced: EnhancedProduct = { ...product }

    // Set primary image
    if (product.images && product.images.length > 0) {
      enhanced.primaryImage = product.images[0]
      enhanced.imageUrls = {
        thumbnail: ImageUtils.buildImageUrl(product.images[0], '200_max'),
        medium: ImageUtils.buildImageUrl(product.images[0], '500_max'),
        large: ImageUtils.buildImageUrl(product.images[0], '1000_max'),
        full: ImageUtils.buildImageUrl(product.images[0], 'full'),
      }
    }

    // Calculate price range from items
    if (product.items && product.items.length > 0) {
      const prices = product.items.map((item) => parseFloat(item.list_price))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      enhanced.priceRange = {
        min: minPrice,
        max: maxPrice,
        formatted: {
          min: this.formatPrice(minPrice.toString()),
          max: this.formatPrice(maxPrice.toString()),
        },
      }

      // Rough inventory check (you'd want to actually check inventory for accuracy)
      enhanced.inStock = product.items.some((item) => item.status === 'STK')
      enhanced.totalInventory = 0 // Would need separate inventory calls
    }

    // Set brand from included data
    if (product.brand) {
      enhanced.brand = product.brand
    }

    return enhanced
  }

  private enhanceItem(item: WPSItem): EnhancedItem {
    const enhanced: EnhancedItem = {
      ...item,
      formattedPrice: this.formatPrice(item.list_price),
      inventoryStatus: 'out_of_stock', // Default, should be checked separately
      inventoryDisplay: 'Check availability',
      seoUrl: this.generateSEOUrl(item.name),
    }

    // Set inventory status based on item status
    switch (item.status) {
      case 'STK':
        enhanced.inventoryStatus = 'in_stock'
        enhanced.inventoryDisplay = 'In stock'
        break
      case 'DSC':
        enhanced.inventoryStatus = 'out_of_stock'
        enhanced.inventoryDisplay = 'Discontinued'
        break
      case 'CLO':
        enhanced.inventoryStatus = 'low_stock'
        enhanced.inventoryDisplay = 'Closeout'
        break
      case 'NA':
      case 'NLA':
        enhanced.inventoryStatus = 'out_of_stock'
        enhanced.inventoryDisplay = 'Not available'
        break
      default:
        enhanced.inventoryStatus = 'out_of_stock'
        enhanced.inventoryDisplay = 'Check availability'
    }

    return enhanced
  }

  private formatPrice(priceString: string): string {
    const price = parseFloat(priceString)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  private generateSEOUrl(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

// Lazy singleton initialization
let _wpsApiService: WPSApiService | null = null

export function getWPSApiService(): WPSApiService {
  if (!_wpsApiService) {
    _wpsApiService = new WPSApiService()
  }
  return _wpsApiService
}

// Keep the old export for backward compatibility, but make it lazy
export const wpsApiService = {
  get instance() {
    return getWPSApiService()
  },
}

// React hooks for easy component integration
export function useWPSService() {
  return getWPSApiService()
}

// Specialized hooks
export function useProductData() {
  const service = getWPSApiService()

  return {
    async loadProduct(id: number | string) {
      return service.getEnhancedProduct(id)
    },

    async loadProductsByCategory(categoryId: number, cursor?: string) {
      return service.getProductsByCategory(categoryId, cursor ? { 'page[cursor]': cursor } : {})
    },

    async searchProducts(query: string, filters?: any) {
      return service.searchProducts(query, filters)
    },
  }
}

export function useInventoryData() {
  const service = getWPSApiService()

  return {
    async checkStock(itemId: number) {
      return service.checkItemInventory(itemId)
    },
  }
}

export function useCartData() {
  const service = getWPSApiService()

  return {
    async createCart(customerInfo?: any) {
      return service.createShoppingCart(customerInfo)
    },

    async addItem(cartId: string, item: any) {
      return service.addToCart(cartId, item)
    },

    async getCart(cartId: string) {
      return service.getCartDetails(cartId)
    },

    async submitOrder(cartId: string) {
      return service.submitOrder(cartId)
    },
  }
}

// Export default using the lazy getter
export default {
  get instance() {
    return getWPSApiService()
  },
}
