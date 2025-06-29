// lib/api/wps-client.ts - FIXED VERSION

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
    [key: string]: any;
}

// Core entity interfaces (keeping the same)
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

// Image utility functions (keeping the same)
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

// API Error classes (keeping the same)
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

// Main API Client - FIXED
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

        // FIXED: Better parameter handling
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // Handle arrays (like multiple includes)
                    if (Array.isArray(value)) {
                        value.forEach(v => url.searchParams.append(key, String(v)));
                    } else {
                        url.searchParams.set(key, String(value));
                    }
                }
            });
        }

        console.log('Making request to:', url.toString());

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
                const errorText = await response.text();
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });

                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { message: errorText };
                }

                switch (response.status) {
                    case 401:
                        throw new WPSAuthError('Invalid API token or insufficient permissions');
                    case 404:
                        throw new WPSNotFoundError('Endpoint or resource not found');
                    case 422:
                        throw new WPSApiError(`Validation error: ${JSON.stringify(errorData)}`, response.status, errorData);
                    default:
                        throw new WPSApiError(
                            `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
                            response.status,
                            errorData
                        );
                }
            }

            const responseData = await response.json();
            console.log('API Response:', responseData);
            return responseData;
        } catch (error: unknown) {
            clearTimeout(timeoutId);

            if (error instanceof Error && error.name === 'AbortError') {
                throw new WPSApiError('Request timeout', 408);
            }

            if (error instanceof WPSApiError) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Network Error:', errorMessage);
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

    // Products API - FIXED
    async getProducts(params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
        // Ensure proper parameter formatting
        const cleanParams = this.cleanParams(params);
        return this.get<WPSProduct[]>('products', cleanParams);
    }

    async getProduct(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSProduct>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSProduct>(`products/${id}`, cleanParams);
    }

    async getProductItems(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSItem[]>(`products/${id}/items`, cleanParams);
    }

    async getProductImages(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSImage[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSImage[]>(`products/${id}/images`, cleanParams);
    }

    // Items API - FIXED
    async getItems(params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSItem[]>('items', cleanParams);
    }

    async getItem(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSItem>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSItem>(`items/${id}`, cleanParams);
    }

    async getItemByCrutch(sku: string, params?: QueryParams): Promise<ApiResponse<WPSItem>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSItem>(`items/crutch/${sku}`, cleanParams);
    }

    async getItemInventory(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSInventory>> {
        const cleanParams = this.cleanParams({ include: 'inventory', ...params });
        return this.get<WPSInventory>(`items/${id}`, cleanParams);
    }

    // Brands API
    async getBrands(params?: QueryParams): Promise<ApiResponse<WPSBrand[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSBrand[]>('brands', cleanParams);
    }

    async getBrand(id: number, params?: QueryParams): Promise<ApiResponse<WPSBrand>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSBrand>(`brands/${id}`, cleanParams);
    }

    // Images API
    async getImages(params?: QueryParams): Promise<ApiResponse<WPSImage[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSImage[]>('images', cleanParams);
    }

    async getImage(id: number, params?: QueryParams): Promise<ApiResponse<WPSImage>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSImage>(`images/${id}`, cleanParams);
    }

    // Taxonomyterms API (Categories)
    async getTaxonomyterms(params?: QueryParams): Promise<ApiResponse<WPSTaxonomyterm[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSTaxonomyterm[]>('taxonomyterms', cleanParams);
    }

    async getTaxonomyterm(id: number, params?: QueryParams): Promise<ApiResponse<WPSTaxonomyterm>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSTaxonomyterm>(`taxonomyterms/${id}`, cleanParams);
    }

    async getTaxonomytermProducts(id: number, params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSProduct[]>(`taxonomyterms/${id}/products`, cleanParams);
    }

    // Inventory API
    async getInventory(params?: QueryParams): Promise<ApiResponse<WPSInventory[]>> {
        const cleanParams = this.cleanParams(params);
        return this.get<WPSInventory[]>('inventory', cleanParams);
    }

    async getInventoryByItem(itemId: number, params?: QueryParams): Promise<ApiResponse<WPSInventory[]>> {
        const cleanParams = this.cleanParams({
            ...params,
            'filter[item_id]': itemId
        });
        return this.get<WPSInventory[]>('inventory', cleanParams);
    }

    // Cart & Order API (keeping the same)
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

    // Utility methods - FIXED
    async searchProducts(query: string, params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
        const cleanParams = this.cleanParams({
            ...params,
            'filter[name][pre]': query
        });
        return this.getProducts(cleanParams);
    }

    async searchItems(query: string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        const cleanParams = this.cleanParams({
            ...params,
            'filter[name][pre]': query
        });
        return this.getItems(cleanParams);
    }

    async searchItemsBySku(skuPrefix: string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        const cleanParams = this.cleanParams({
            ...params,
            'filter[sku][pre]': skuPrefix
        });
        return this.getItems(cleanParams);
    }

    async getItemsByBrand(brandId: number, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        const cleanParams = this.cleanParams({
            ...params,
            'filter[brand_id]': brandId
        });
        return this.getItems(cleanParams);
    }

    async getItemsByPriceRange(minPrice: number, maxPrice: number, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
        const cleanParams = this.cleanParams({
            ...params,
            'filter[list_price][gt]': minPrice,
            'filter[list_price][lt]': maxPrice
        });
        return this.getItems(cleanParams);
    }

    // FIXED: Parameter cleaning method
    private cleanParams(params?: QueryParams): QueryParams | undefined {
        if (!params) return undefined;

        const cleaned: QueryParams = {};

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // Convert object-style parameters to proper format
                if (key === 'page' && typeof value === 'object') {
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        if (subValue !== undefined && subValue !== null) {
                            cleaned[`page[${subKey}]`] = subValue;
                        }
                    });
                } else if (key === 'filter' && typeof value === 'object') {
                    Object.entries(value).forEach(([filterKey, filterValue]) => {
                        if (filterValue !== undefined && filterValue !== null) {
                            if (typeof filterValue === 'object') {
                                Object.entries(filterValue).forEach(([operatorKey, operatorValue]) => {
                                    if (operatorValue !== undefined && operatorValue !== null) {
                                        cleaned[`filter[${filterKey}][${operatorKey}]`] = operatorValue;
                                    }
                                });
                            } else {
                                cleaned[`filter[${filterKey}]`] = filterValue;
                            }
                        }
                    });
                } else if (key === 'sort' && typeof value === 'object') {
                    Object.entries(value).forEach(([sortKey, sortValue]) => {
                        if (sortValue !== undefined && sortValue !== null) {
                            cleaned[`sort[${sortKey}]`] = sortValue;
                        }
                    });
                } else if (key === 'fields' && typeof value === 'object') {
                    Object.entries(value).forEach(([fieldKey, fieldValue]) => {
                        if (fieldValue !== undefined && fieldValue !== null) {
                            cleaned[`fields[${fieldKey}]`] = fieldValue;
                        }
                    });
                } else {
                    cleaned[key] = value;
                }
            }
        });

        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }

    // Pagination helper - FIXED
    async getAllPages<T>(
        endpoint: string,
        params?: QueryParams,
        maxPages: number = 10
    ): Promise<T[]> {
        const allData: T[] = [];
        let cursor: string | null = null;
        let pageCount = 0;

        do {
            const requestParams = this.cleanParams({
                ...params,
                'page[cursor]': cursor || undefined
            });

            const response: ApiResponse<T[]> = await this.get<T[]>(endpoint, requestParams);

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