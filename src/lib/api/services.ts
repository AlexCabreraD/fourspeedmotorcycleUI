// lib/api/services.ts
// Service layer for common business logic and data transformations

import {
    WPSApiClient,
    createWPSClient,
    WPSProduct,
    WPSItem,
    WPSImage,
    WPSBrand,
    WPSTaxonomyterm,
    WPSInventory,
    ImageUtils
} from './wps-client';

// Enhanced interfaces for our application
export interface EnhancedProduct extends WPSProduct {
    primaryImage?: WPSImage;
    imageUrls?: {
        thumbnail: string;
        medium: string;
        large: string;
        full: string;
    };
    priceRange?: {
        min: number;
        max: number;
        formatted: {
            min: string;
            max: string;
        };
    };
    inStock?: boolean;
    totalInventory?: number;
    brand?: WPSBrand;
}

export interface EnhancedItem extends WPSItem {
    formattedPrice: string;
    inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
    inventoryDisplay: string;
    imageUrls?: {
        thumbnail: string;
        medium: string;
        large: string;
        full: string;
    };
    seoUrl: string;
}

export interface CategoryWithProducts extends WPSTaxonomyterm {
    products?: EnhancedProduct[];
    productCount?: number;
}

export interface SearchResult {
    query: string;
    products: EnhancedProduct[];
    items: EnhancedItem[];
    totalResults: number;
    hasMore: boolean;
    nextCursor?: string;
}

// Main API Service Class
export class WPSApiService {
    private client: WPSApiClient;

    constructor(client?: WPSApiClient) {
        this.client = client || createWPSClient();
    }

    // PRODUCT SERVICES

    async getEnhancedProducts(params?: any): Promise<EnhancedProduct[]> {
        try {
            console.log('Service: getEnhancedProducts called with params:', params);

            const requestParams = {
                include: 'items,images,brands',
                'page[size]': 20,
                ...params
            };

            console.log('Making API call with params:', requestParams);
            const response = await this.client.getProducts(requestParams);

            console.log('API response received:', response);
            return response.data.map(product => this.enhanceProduct(product));
        } catch (error) {
            console.error('Error in getEnhancedProducts:', error);
            throw error;
        }
    }

    async getEnhancedProduct(id: number | string): Promise<EnhancedProduct | null> {
        try {
            console.log('Service: getEnhancedProduct called with id:', id);

            const response = await this.client.getProduct(id, {
                include: 'items,images,features,brands'
            });

            return this.enhanceProduct(response.data);
        } catch (error: unknown) {
            console.error('Error in getEnhancedProduct:', error);

            if (error instanceof Error && error.name === 'WPSNotFoundError') {
                return null;
            }
            throw error;
        }
    }

    async getProductsByCategory(categoryId: number, params?: any): Promise<{
        products: EnhancedProduct[];
        category: WPSTaxonomyterm;
        hasMore: boolean;
        nextCursor?: string;
    }> {
        // Get category info
        const categoryResponse = await this.client.getTaxonomyterm(categoryId);

        // Get products in category
        const productsResponse = await this.client.getTaxonomytermProducts(categoryId, {
            include: 'items,images,brands',
            'page[size]': 20,
            ...params
        });

        return {
            products: productsResponse.data.map(product => this.enhanceProduct(product)),
            category: categoryResponse.data,
            hasMore: !!productsResponse.meta?.cursor?.next,
            nextCursor: productsResponse.meta?.cursor?.next || undefined
        };
    }

    async searchProducts(query: string, filters?: {
        brandIds?: number[];
        priceMin?: number;
        priceMax?: number;
        categoryId?: number;
        pageSize?: number;
        cursor?: string;
    }): Promise<SearchResult> {
        try {
            console.log('Service: searchProducts called with query:', query, 'filters:', filters);

            const params: any = {
                'page[size]': filters?.pageSize || 12,
                include: 'items,images,brands'
            };

            if (filters?.cursor) {
                params['page[cursor]'] = filters.cursor;
            }

            console.log('Calling searchProducts with params:', params);

            // Search products by name
            const productResponse = await this.client.searchProducts(query, params);

            // Search items by SKU if query looks like a part number
            let itemResponse: any = { data: [] };
            if (/^[a-zA-Z0-9-]+$/.test(query) && query.length >= 3) {
                try {
                    itemResponse = await this.client.searchItemsBySku(query, {
                        include: 'product,images',
                        'page[size]': 10
                    });
                } catch (error) {
                    console.warn('SKU search failed, continuing with product search only:', error);
                }
            }

            const enhancedProducts = productResponse.data.map(product => this.enhanceProduct(product));
            const enhancedItems = itemResponse.data.map((item: WPSItem) => this.enhanceItem(item));

            return {
                query,
                products: enhancedProducts,
                items: enhancedItems,
                totalResults: enhancedProducts.length + enhancedItems.length,
                hasMore: !!productResponse.meta?.cursor?.next,
                nextCursor: productResponse.meta?.cursor?.next || undefined
            };
        } catch (error) {
            console.error('Error in searchProducts:', error);
            throw error;
        }
    }

    // CATEGORY SERVICES

    async getCategories(): Promise<CategoryWithProducts[]> {
        try {
            console.log('Service: getCategories called');

            const response = await this.client.getTaxonomyterms({
                'page[size]': 100,
                'sort[asc]': 'name'
            });

            return response.data.map(category => ({
                ...category,
                products: [],
                productCount: 0
            }));
        } catch (error) {
            console.error('Error in getCategories:', error);
            throw error;
        }
    }

    async getCategoryTree(): Promise<CategoryWithProducts[]> {
        const categories = await this.getCategories();

        // Build tree structure based on parent_id and depth
        const rootCategories = categories.filter(cat => cat.parent_id === null);

        const buildTree = (parentId: number | null, depth: number = 0): CategoryWithProducts[] => {
            return categories
                .filter(cat => cat.parent_id === parentId)
                .sort((a, b) => a.left - b.left)
                .map(category => ({
                    ...category,
                    children: buildTree(category.id, depth + 1)
                }));
        };

        return buildTree(null);
    }

    // BRAND SERVICES

    async getBrands(): Promise<WPSBrand[]> {
        const response = await this.client.getBrands({
            'page[size]': 100,
            'sort[asc]': 'name'
        });

        return response.data;
    }

    async getPopularBrands(limit: number = 20): Promise<WPSBrand[]> {
        // Get brands with their item count (simplified approach)
        const brands = await this.getBrands();
        return brands.slice(0, limit); // In a real app, you'd sort by popularity
    }

    // INVENTORY SERVICES

    async checkItemInventory(itemId: number): Promise<{
        inStock: boolean;
        quantity: number;
        status: 'in_stock' | 'low_stock' | 'out_of_stock';
        display: string;
        warehouseBreakdown: Record<string, number>;
    }> {
        try {
            const response = await this.client.getInventoryByItem(itemId);

            if (response.data.length === 0) {
                return {
                    inStock: false,
                    quantity: 0,
                    status: 'out_of_stock',
                    display: 'Out of stock',
                    warehouseBreakdown: {}
                };
            }

            const inventory = response.data[0];
            const quantity = inventory.total;

            return {
                inStock: quantity > 0,
                quantity: quantity >= 25 ? 25 : quantity, // API caps at 25
                status: quantity === 0 ? 'out_of_stock' : quantity < 5 ? 'low_stock' : 'in_stock',
                display: quantity === 0 ? 'Out of stock' : quantity >= 25 ? 'In stock' : `${quantity} in stock`,
                warehouseBreakdown: {
                    california: inventory.ca_warehouse,
                    georgia: inventory.ga_warehouse,
                    idaho: inventory.id_warehouse,
                    indiana: inventory.in_warehouse,
                    pennsylvania: inventory.pa_warehouse,
                    texas: inventory.tx_warehouse
                }
            };
        } catch (error: unknown) {
            return {
                inStock: false,
                quantity: 0,
                status: 'out_of_stock',
                display: 'Stock unknown',
                warehouseBreakdown: {}
            };
        }
    }

    // CART SERVICES

    async createShoppingCart(customerInfo?: {
        email?: string;
        shippingAddress?: any;
    }): Promise<string> {
        const poNumber = `CART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const response = await this.client.createCart({
            po_number: poNumber,
            default_warehouse: process.env.WPS_DEFAULT_WAREHOUSE || 'ID',
            ship_via: process.env.WPS_DEFAULT_SHIP_VIA || 'BEST',
            allow_backorder: true,
            multiple_warehouse: true,
            ...customerInfo
        });

        return response.data.cart_number;
    }

    async addToCart(cartId: string, item: {
        itemId?: number;
        sku?: string;
        quantity: number;
        note?: string;
    }): Promise<any> {
        return this.client.addItemToCart(cartId, {
            item_id: item.itemId,
            item_sku: item.sku,
            quantity: item.quantity,
            note: item.note
        });
    }

    async getCartDetails(cartId: string): Promise<any> {
        return this.client.getCart(cartId);
    }

    async submitOrder(cartId: string): Promise<string> {
        const response = await this.client.createOrder(cartId);
        return response.data.order_number;
    }

    // UTILITY METHODS

    private enhanceProduct(product: WPSProduct): EnhancedProduct {
        const enhanced: EnhancedProduct = { ...product };

        // Set primary image
        if (product.images && product.images.length > 0) {
            enhanced.primaryImage = product.images[0];
            enhanced.imageUrls = {
                thumbnail: ImageUtils.buildImageUrl(product.images[0], '200_max'),
                medium: ImageUtils.buildImageUrl(product.images[0], '500_max'),
                large: ImageUtils.buildImageUrl(product.images[0], '1000_max'),
                full: ImageUtils.buildImageUrl(product.images[0], 'full')
            };
        }

        // Calculate price range from items
        if (product.items && product.items.length > 0) {
            const prices = product.items.map(item => parseFloat(item.list_price));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            enhanced.priceRange = {
                min: minPrice,
                max: maxPrice,
                formatted: {
                    min: this.formatPrice(minPrice.toString()),
                    max: this.formatPrice(maxPrice.toString())
                }
            };

            // Rough inventory check (you'd want to actually check inventory for accuracy)
            enhanced.inStock = product.items.some(item => item.status === 'STK');
            enhanced.totalInventory = 0; // Would need separate inventory calls
        }

        return enhanced;
    }

    private enhanceItem(item: WPSItem): EnhancedItem {
        const enhanced: EnhancedItem = {
            ...item,
            formattedPrice: this.formatPrice(item.list_price),
            inventoryStatus: 'out_of_stock', // Default, should be checked separately
            inventoryDisplay: 'Check availability',
            seoUrl: this.generateSEOUrl(item.name)
        };

        // Set inventory status based on item status
        switch (item.status) {
            case 'STK':
                enhanced.inventoryStatus = 'in_stock';
                enhanced.inventoryDisplay = 'In stock';
                break;
            case 'DSC':
                enhanced.inventoryStatus = 'out_of_stock';
                enhanced.inventoryDisplay = 'Discontinued';
                break;
            case 'CLO':
                enhanced.inventoryStatus = 'low_stock';
                enhanced.inventoryDisplay = 'Closeout';
                break;
            case 'NA':
            case 'NLA':
                enhanced.inventoryStatus = 'out_of_stock';
                enhanced.inventoryDisplay = 'Not available';
                break;
            default:
                enhanced.inventoryStatus = 'out_of_stock';
                enhanced.inventoryDisplay = 'Check availability';
        }

        return enhanced;
    }

    private formatPrice(priceString: string): string {
        const price = parseFloat(priceString);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    private generateSEOUrl(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}

// Lazy singleton initialization
let _wpsApiService: WPSApiService | null = null;

export function getWPSApiService(): WPSApiService {
    if (!_wpsApiService) {
        _wpsApiService = new WPSApiService();
    }
    return _wpsApiService;
}

// Keep the old export for backward compatibility, but make it lazy
export const wpsApiService = {
    get instance() {
        return getWPSApiService();
    }
};

// React hooks for easy component integration
export function useWPSService() {
    return getWPSApiService();
}

// Specialized hooks
export function useProductData() {
    const service = getWPSApiService();

    return {
        async loadProduct(id: number | string) {
            return service.getEnhancedProduct(id);
        },

        async loadProductsByCategory(categoryId: number, cursor?: string) {
            return service.getProductsByCategory(categoryId, cursor ? { 'page[cursor]': cursor } : {});
        },

        async searchProducts(query: string, filters?: any) {
            return service.searchProducts(query, filters);
        }
    };
}

export function useInventoryData() {
    const service = getWPSApiService();

    return {
        async checkStock(itemId: number) {
            return service.checkItemInventory(itemId);
        }
    };
}

export function useCartData() {
    const service = getWPSApiService();

    return {
        async createCart(customerInfo?: any) {
            return service.createShoppingCart(customerInfo);
        },

        async addItem(cartId: string, item: any) {
            return service.addToCart(cartId, item);
        },

        async getCart(cartId: string) {
            return service.getCartDetails(cartId);
        },

        async submitOrder(cartId: string) {
            return service.submitOrder(cartId);
        }
    };
}

// Export default using the lazy getter
export default {
    get instance() {
        return getWPSApiService();
    }
};