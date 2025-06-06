// lib/api/wps-client.ts

interface WPSConfig {
    baseUrl: string;
    token: string;
    timeout?: number;
}

interface ApiResponse<T> {
    data: T;
    meta?: {
        cursor?: {
            current: string | null;
            prev: string | null;
            next: string | null;
            count: number;
        };
    };
    links?: any;
}

interface QueryParams {
    'page[size]'?: number;
    'page[cursor]'?: string;
    include?: string;
    'filter[brand_id]'?: number;
    'filter[sku]'?: string;
    'filter[sku][pre]'?: string;
    'filter[list_price][lt]'?: number;
    'filter[list_price][gt]'?: number;
    'filter[name][pre]'?: string;
    'filter[updated_at][gt]'?: string;
    'filter[item_id]'?: number;
    'fields[items]'?: string;
    'fields[products]'?: string;
    'fields[images]'?: string;
    sort?: string;
    'sort[asc]'?: string;
    'sort[desc]'?: string;
    countOnly?: boolean;
    [key: string]: any;
}

// Core entity interfaces based on API documentation
export interface WPSItem {
    id: number;
    brand_id: number;
    country_id: number | null;
    product_id: number;
    sku: string;
    name: string;
    list_price: string;
    standard_dealer_price: string;
    supplier_product_id: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    upc: string | null;
    superseded_sku: string | null;
    status_id: string;
    status: string;
    unit_of_measurement_id: number;
    has_map_policy: boolean;
    sort: number;
    created_at: string;
    updated_at: string;
    published_at: string;
    product_type: string;
    mapp_price: string;
    carb: string | null;
    propd1: string | null;
    propd2: string | null;
    prop_65_code: string | null;
    prop_65_detail: string | null;
    drop_ship_fee: string;
    drop_ship_eligible: boolean;
}

export interface WPSProduct {
    id: number;
    designation_id: number | null;
    name: string;
    alternate_name: string | null;
    care_instructions: string | null;
    description: string;
    sort: number;
    image_360_id: number | null;
    image_360_preview_id: number | null;
    size_chart_id: number | null;
    created_at: string;
    updated_at: string;
    items?: WPSItem[];
    images?: WPSImage[];
    features?: WPSFeature[];
    brand?: WPSBrand;
}

export interface WPSImage {
    id: number;
    domain: string;
    path: string;
    filename: string;
    alt: string | null;
    mime: string;
    width: number;
    height: number;
    size: number;
    signature: string;
    created_at: string;
    updated_at: string;
}

export interface WPSBrand {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface WPSFeature {
    id: number;
    product_id: number;
    icon_id: number | null;
    sort: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface WPSTaxonomyterm {
    id: number;
    vocabulary_id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    link: string | null;
    link_target_blank: boolean;
    left: number;
    right: number;
    depth: number;
    created_at: string;
    updated_at: string;
}

export interface WPSInventory {
    id: number;
    item_id: number;
    sku: string;
    ca_warehouse: number;
    ga_warehouse: number;
    id_warehouse: number;
    in_warehouse: number;
    pa_warehouse: number;
    pa2_warehouse: number;
    tx_warehouse: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface WPSCart {
    cart_number: string;
    po_number: string;
    shipment_type: string;
}

export interface WPSOrder {
    order_number: string;
}

// Image utility functions
export class ImageUtils {
    private static readonly IMAGE_STYLES = ['200_max', '500_max', '1000_max', 'full'] as const;

    static buildImageUrl(image: WPSImage, style: typeof ImageUtils.IMAGE_STYLES[number] = '500_max'): string {
        if (!image.domain || !image.path || !image.filename) {
            throw new Error('Invalid image data');
        }

        const protocol = image.domain.startsWith('http') ? '' : 'https://';
        return `${protocol}${image.domain}${image.path}${style}/${image.filename}`;
    }

    static getAvailableStyles() {
        return [...ImageUtils.IMAGE_STYLES];
    }
}

// API Error classes
export class WPSApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: any
    ) {
        super(message);
        this.name = 'WPSApiError';
    }
}

export class WPSAuthError extends WPSApiError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401);
        this.name = 'WPSAuthError';
    }
}

export class WPSNotFoundError extends WPSApiError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        this.name = 'WPSNotFoundError';
    }
}

// Main API Client
export class WPSApiClient {
    private config: WPSConfig;
    private defaultTimeout = 30000; // 30 seconds

    constructor(config: WPSConfig) {
        if (!config.baseUrl || !config.token) {
            throw new Error('WPS API baseUrl and token are required');
        }

        this.config = {
            ...config,
            timeout: config.timeout || this.defaultTimeout
        };
    }

    private async makeRequest<T>(
        endpoint: string,
        params?: QueryParams,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        // Ensure endpoint doesn't start with slash (baseUrl should handle that)
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

        // Construct full URL - ensure baseUrl ends with /
        const baseUrl = this.config.baseUrl.endsWith('/') ? this.config.baseUrl : `${this.config.baseUrl}/`;
        const url = new URL(cleanEndpoint, baseUrl);

        // Add query parameters
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(url.toString(), {
                ...options,
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                switch (response.status) {
                    case 401:
                        throw new WPSAuthError('Invalid API token or insufficient permissions');
                    case 404:
                        throw new WPSNotFoundError('Endpoint or resource not found');
                    case 422:
                        throw new WPSApiError(`Validation error: ${JSON.stringify(errorData)}`, response.status, errorData);
                    default:
                        throw new WPSApiError(
                            `HTTP ${response.status}: ${response.statusText}`,
                            response.status,
                            errorData
                        );
                }
            }

            return await response.json();
        } catch (error: unknown) {
            clearTimeout(timeoutId);

            if (error instanceof Error && error.name === 'AbortError') {
                throw new WPSApiError('Request timeout', 408);
            }

            if (error instanceof WPSApiError) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new WPSApiError(`Network error: ${errorMessage}`, 0);
        }
    }

    // Generic methods for any endpoint
    async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, params);
    }

    async post<T>(endpoint: string, data: any, params?: QueryParams): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, params, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any, params?: QueryParams): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, params, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, params, {
            method: 'DELETE',
        });
    }

    // Products API
    async getProducts(params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
        return this.get<WPSProduct[]>('products', params);
    }

    async getProduct(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSProduct>> {
        return this.get<WPSProduct>(`products/${id}`, params);
    }

    async getProductItems(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        return this.get<WPSItem[]>(`products/${id}/items`, params);
    }

    async getProductImages(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSImage[]>> {
        return this.get<WPSImage[]>(`products/${id}/images`, params);
    }

    // Items API
    async getItems(params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        return this.get<WPSItem[]>('items', params);
    }

    async getItem(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSItem>> {
        return this.get<WPSItem>(`items/${id}`, params);
    }

    async getItemByCrutch(sku: string, params?: QueryParams): Promise<ApiResponse<WPSItem>> {
        return this.get<WPSItem>(`items/crutch/${sku}`, params);
    }

    async getItemInventory(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSInventory>> {
        return this.get<WPSInventory>(`items/${id}?include=inventory`, params);
    }

    // Brands API
    async getBrands(params?: QueryParams): Promise<ApiResponse<WPSBrand[]>> {
        return this.get<WPSBrand[]>('brands', params);
    }

    async getBrand(id: number, params?: QueryParams): Promise<ApiResponse<WPSBrand>> {
        return this.get<WPSBrand>(`brands/${id}`, params);
    }

    // Images API
    async getImages(params?: QueryParams): Promise<ApiResponse<WPSImage[]>> {
        return this.get<WPSImage[]>('images', params);
    }

    async getImage(id: number, params?: QueryParams): Promise<ApiResponse<WPSImage>> {
        return this.get<WPSImage>(`images/${id}`, params);
    }

    // Taxonomyterms API (Categories)
    async getTaxonomyterms(params?: QueryParams): Promise<ApiResponse<WPSTaxonomyterm[]>> {
        return this.get<WPSTaxonomyterm[]>('taxonomyterms', params);
    }

    async getTaxonomyterm(id: number, params?: QueryParams): Promise<ApiResponse<WPSTaxonomyterm>> {
        return this.get<WPSTaxonomyterm>(`taxonomyterms/${id}`, params);
    }

    async getTaxonomytermProducts(id: number, params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
        return this.get<WPSProduct[]>(`taxonomyterms/${id}/products`, params);
    }

    // Inventory API
    async getInventory(params?: QueryParams): Promise<ApiResponse<WPSInventory[]>> {
        return this.get<WPSInventory[]>('inventory', params);
    }

    async getInventoryByItem(itemId: number, params?: QueryParams): Promise<ApiResponse<WPSInventory[]>> {
        return this.get<WPSInventory[]>('inventory', {
            ...params,
            'filter[item_id]': itemId
        });
    }

    // Cart & Order API
    async createCart(cartData: {
        po_number: string;
        default_warehouse?: string;
        ship_via?: string;
        [key: string]: any;
    }): Promise<ApiResponse<WPSCart>> {
        return this.post<WPSCart>('carts', cartData);
    }

    async getCart(poNumber: string): Promise<ApiResponse<any>> {
        return this.get<any>(`carts/${poNumber}`);
    }

    async addItemToCart(poNumber: string, itemData: {
        item_sku?: string;
        item_id?: number;
        quantity: number;
        note?: string;
    }): Promise<ApiResponse<any>> {
        return this.post<any>(`carts/${poNumber}/items`, itemData);
    }

    async deleteCart(poNumber: string): Promise<ApiResponse<any>> {
        return this.delete<any>(`carts/${poNumber}`);
    }

    async createOrder(poNumber: string): Promise<ApiResponse<WPSOrder>> {
        return this.post<WPSOrder>('orders', { po_number: poNumber });
    }

    async getOrder(poNumber: string): Promise<ApiResponse<any>> {
        return this.get<any>(`orders/${poNumber}`);
    }

    // Utility methods
    async searchProducts(query: string, params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
        return this.getProducts({
            ...params,
            'filter[name][pre]': query
        });
    }

    async searchItems(query: string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        return this.getItems({
            ...params,
            'filter[name][pre]': query
        });
    }

    async searchItemsBySku(skuPrefix: string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        return this.getItems({
            ...params,
            'filter[sku][pre]': skuPrefix
        });
    }

    async getItemsByBrand(brandId: number, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        return this.getItems({
            ...params,
            'filter[brand_id]': brandId
        });
    }

    async getItemsByPriceRange(minPrice: number, maxPrice: number, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        return this.getItems({
            ...params,
            'filter[list_price][gt]': minPrice,
            'filter[list_price][lt]': maxPrice
        });
    }

    // Pagination helper
    async getAllPages<T>(
        endpoint: string,
        params?: QueryParams,
        maxPages: number = 10
    ): Promise<T[]> {
        const allData: T[] = [];
        let cursor: string | null = null;
        let pageCount = 0;

        do {
            const response: ApiResponse<T[]> = await this.get<T[]>(endpoint, {
                ...params,
                'page[cursor]': cursor || undefined
            });

            if (Array.isArray(response.data)) {
                allData.push(...response.data);
            }

            cursor = response.meta?.cursor?.next || null;
            pageCount++;

            if (pageCount >= maxPages) {
                console.warn(`Reached maximum page limit (${maxPages}). There may be more data available.`);
                break;
            }
        } while (cursor);

        return allData;
    }
}

// Factory function for easy instantiation
export function createWPSClient(config?: Partial<WPSConfig>): WPSApiClient {
    const baseUrl = config?.baseUrl ||
        process.env.NEXT_PUBLIC_WPS_API_URL ||
        process.env.WPS_API_URL ||
        '';

    const token = config?.token ||
        process.env.NEXT_PUBLIC_WPS_API_TOKEN ||
        process.env.WPS_API_TOKEN ||
        '';

    // Only throw error if neither baseUrl nor token are provided
    if (!baseUrl && !token && !config?.baseUrl && !config?.token) {
        console.warn('WPS API configuration not found. Please provide baseUrl and token manually.');
    }

    const defaultConfig: WPSConfig = {
        baseUrl,
        token,
    };

    return new WPSApiClient({ ...defaultConfig, ...config });
}