
import { createWPSClient, ImageUtils } from './wps-client'

// Initialize the client (using environment variables)
const wpsClient = createWPSClient()

// Or initialize with custom config
const customClient = createWPSClient({
  baseUrl: process.env.WPS_API_URL || process.env.NEXT_PUBLIC_WPS_API_URL,
  token: process.env.WPS_API_TOKEN || process.env.NEXT_PUBLIC_WPS_API_TOKEN,
  timeout: 45000, // 45 seconds
})

// BASIC USAGE EXAMPLES

export async function exampleBasicUsage() {
  try {
    // Get products with items included
    const productsResponse = await wpsClient.getProducts({
      'page[size]': 10,
      include: 'items,images,brands',
    })


    // Get a specific product by ID
    const productResponse = await wpsClient.getProduct(207997, {
      include: 'items,images,features,brands',
    })


    // Search products by name
    const searchResults = await wpsClient.searchProducts('Multirate Fork Springs', {
      'page[size]': 5,
      include: 'items',
    })

  } catch (error: unknown) {
    console.error('API Error:', error)
  }
}

// ADVANCED FILTERING EXAMPLES

export async function exampleAdvancedFiltering() {
  try {
    // Get items by brand (FLY Racing = brand_id 135)
    const flyRacingItems = await wpsClient.getItemsByBrand(135, {
      'page[size]': 20,
      include: 'product,images',
    })

    // Get items in price range
    const affordableItems = await wpsClient.getItemsByPriceRange(50, 200, {
      'page[size]': 25,
      'sort[asc]': 'list_price',
    })

    // Search items by SKU prefix
    const skuResults = await wpsClient.searchItemsBySku('87-4', {
      include: 'product,inventory',
    })

    // Get recently updated items
    const recentItems = await wpsClient.getItems({
      'filter[updated_at][gt]': '2025-01-01',
      'sort[desc]': 'updated_at',
      'page[size]': 50,
    })

  } catch (error: unknown) {
    console.error('Filtering error:', error)
  }
}

// CATEGORY/TAXONOMY EXAMPLES

export async function exampleCategoryBrowsing() {
  try {
    // Get all taxonomy terms (categories)
    const categories = await wpsClient.getTaxonomyterms({
      'page[size]': 50,
    })


    // Get products in a specific category
    const categoryProducts = await wpsClient.getTaxonomytermProducts(197, {
      include: 'items,images,brands',
      'page[size]': 20,
    })

  } catch (error: unknown) {
    console.error('Category error:', error)
  }
}

// IMAGE HANDLING EXAMPLES

export async function exampleImageHandling() {
  try {
    // Get product with images
    const productResponse = await wpsClient.getProduct(207997, {
      include: 'images',
    })

    const product = productResponse.data

    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0]

      // Generate different image sizes
      const thumbnailUrl = ImageUtils.buildImageUrl(firstImage, '200_max')
      const mediumUrl = ImageUtils.buildImageUrl(firstImage, '500_max')
      const largeUrl = ImageUtils.buildImageUrl(firstImage, '1000_max')
      const fullUrl = ImageUtils.buildImageUrl(firstImage, 'full')

    }
  } catch (error: unknown) {
    console.error('Image handling error:', error)
  }
}

// INVENTORY CHECKING EXAMPLES

export async function exampleInventoryCheck() {
  try {
    // Get item with inventory
    const itemResponse = await wpsClient.getItem(216584, {
      include: 'inventory',
    })


    // Get inventory for specific item
    const inventoryResponse = await wpsClient.getInventoryByItem(216584)

    if (inventoryResponse.data.length > 0) {
      const inventory = inventoryResponse.data[0]
    }
  } catch (error: unknown) {
    console.error('Inventory error:', error)
  }
}

// CART AND ORDER EXAMPLES

export async function exampleCartAndOrder() {
  try {
    // Create a cart
    const cartResponse = await wpsClient.createCart({
      po_number: `ORDER-${Date.now()}`, // Unique PO number
      default_warehouse: 'ID', // Boise, ID
      ship_via: 'BEST', // Best Ground method
      ship_to: '1234567', // Your assigned ship-to number
      allow_backorder: true,
      multiple_warehouse: true,
    })


    // Add items to cart
    const addItemResponse = await wpsClient.addItemToCart(cartResponse.data.po_number, {
      item_sku: '015-01001',
      quantity: 2,
      note: 'Customer requested item',
    })


    // Get cart details
    const cartDetails = await wpsClient.getCart(cartResponse.data.po_number)

    // Submit cart as order
    const orderResponse = await wpsClient.createOrder(cartResponse.data.po_number)

    // Check order status
    const orderStatus = await wpsClient.getOrder(cartResponse.data.po_number)
  } catch (error: unknown) {
    console.error('Cart/Order error:', error)
  }
}

// PAGINATION EXAMPLES

export async function examplePagination() {
  try {
    // Manual pagination
    let cursor: string | null = null
    let pageCount = 0
    const maxPages = 3

    do {
      const response = await wpsClient.getItems({
        'page[size]': 10,
        'page[cursor]': cursor || undefined,
        include: 'product',
      })

      cursor = response.meta?.cursor?.next || null
      pageCount++
    } while (cursor && pageCount < maxPages)

    // Automatic pagination (use with caution - can be many requests)
    const allBrands = await wpsClient.getAllPages<any>(
      'brands',
      {
        'page[size]': 50,
      },
      5
    ) // Max 5 pages

  } catch (error: unknown) {
    console.error('Pagination error:', error)
  }
}

// ERROR HANDLING EXAMPLES

export async function exampleErrorHandling() {
  try {
    // This will likely throw a not found error
    await wpsClient.getProduct(999999999)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'WPSNotFoundError') {
      } else if (error.name === 'WPSAuthError') {
      } else if (error.name === 'WPSApiError') {
      } else {
      }
    } else {
    }
  }
}

// REACT HOOK EXAMPLES

export function useWPSApi() {
  // Custom hook for React components
  const client = createWPSClient()

  return {
    client,

    // Convenience methods
    async loadProduct(id: number) {
      return client.getProduct(id, {
        include: 'items,images,features,brands',
      })
    },

    async loadProductsByCategory(categoryId: number) {
      return client.getTaxonomytermProducts(categoryId, {
        include: 'items,images,brands',
        'page[size]': 20,
      })
    },

    async searchProducts(query: string) {
      return client.searchProducts(query, {
        include: 'items,brands',
        'page[size]': 12,
      })
    },

    async checkInventory(itemId: number) {
      return client.getInventoryByItem(itemId)
    },
  }
}

// NEXT.JS API ROUTE EXAMPLES

// pages/api/products/[id].ts or app/api/products/[id]/route.ts
export async function handleProductAPI(id: string) {
  try {
    const client = createWPSClient()
    const product = await client.getProduct(id, {
      include: 'items,images,features,brands',
    })

    return {
      success: true,
      data: product.data,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStatus = error instanceof Error && 'status' in error ? (error as any).status : 500

    return {
      success: false,
      error: errorMessage,
      status: errorStatus,
    }
  }
}

// UTILITY FUNCTIONS

export class WPSHelpers {
  static formatPrice(priceString: string): string {
    const price = parseFloat(priceString)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  static getInventoryStatus(inventory: any): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (!inventory || inventory.total === 0) {
      return 'out_of_stock'
    }
    if (inventory.total < 5) {
      return 'low_stock'
    }
    return 'in_stock'
  }

  static getInventoryDisplay(inventory: any): string {
    if (!inventory) {
      return 'Stock unknown'
    }
    if (inventory.total === 0) {
      return 'Out of stock'
    }
    if (inventory.total >= 25) {
      return 'In stock'
    }
    return `${inventory.total} in stock`
  }

  static generateSEOUrl(product: any): string {
    return product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

export default {
  exampleBasicUsage,
  exampleAdvancedFiltering,
  exampleCategoryBrowsing,
  exampleImageHandling,
  exampleInventoryCheck,
  exampleCartAndOrder,
  examplePagination,
  exampleErrorHandling,
  useWPSApi,
  handleProductAPI,
  WPSHelpers,
}
