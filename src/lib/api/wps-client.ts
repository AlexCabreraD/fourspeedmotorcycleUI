
interface WPSConfig {
  baseUrl: string
  token: string
  timeout?: number
}

interface ApiResponse<T> {
  data: T
  meta?: {
    cursor?: {
      current: string | null
      prev: string | null
      next: string | null
      count: number
    }
  }
  links?: any
}

interface QueryParams {
  [key: string]: any
}

export interface WPSVehicle {
  id: number
  make: string
  model: string
  year: number
  engine?: string
  displacement?: string
  created_at: string
  updated_at: string
}

export interface WPSVehicleMake {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface WPSVehicleModel {
  id: number
  make_id: number
  name: string
  created_at: string
  updated_at: string
}

export interface WPSAttribute {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface WPSCountry {
  id: number
  code: string
  name: string
  created_at: string
  updated_at: string
}

export interface WPSWarehouse {
  id: number
  db2_key: string
  name: string
  created_at: string
  updated_at: string
}

export interface WPSResource {
  id: number
  name: string
  type: string
  reference: string
  created_at: string
  updated_at: string
}

export interface WPSTag {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface WPSVocabulary {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface FilterOptions {
  name?: {
    pre?: string
    suf?: string
    con?: string
    eq?: string
  }
  sku?: {
    pre?: string
    suf?: string
    con?: string
    eq?: string
  }
  brand_id?: number | number[]
  product_type?: string
  list_price?: {
    gt?: number
    lt?: number
    gte?: number
    lte?: number
    eq?: number
  }
  status?: string
  drop_ship_eligible?: boolean
  has_map_policy?: boolean
  created_at?: {
    gt?: string
    lt?: string
    gte?: string
    lte?: string
  }
  updated_at?: {
    gt?: string
    lt?: string
    gte?: string
    lte?: string
  }
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface PaginationOptions {
  size?: number
  cursor?: string
}

export interface AdvancedQueryOptions {
  filters?: FilterOptions
  sort?: SortOptions | SortOptions[]
  pagination?: PaginationOptions
  include?: string[]
}

export interface WPSCartItem {
  sku: string
  quantity: number
  notes?: string
}

export interface WPSCart {
  po_number: string
  ship_to?: string
  ship_name?: string
  ship_address1?: string
  ship_address2?: string
  ship_city?: string
  ship_state?: string
  ship_zip?: string
  ship_phone?: string
  email?: string
  warehouse?: string
  shipping_method?: string
  pay_type?: 'CC' | 'OO'
  cc_last_four?: string
  promo_code?: string
  comment1?: string
  comment2?: string
  items?: WPSCartItem[]
}

export interface WPSOrder {
  po_number: string
  order_number?: string
  invoice_number?: string
  status?: string
  order_date?: string
  ship_date?: string
  invoice_date?: string
  freight?: string
  misc_charges?: string
  order_total?: string
  warehouse?: string
  tracking_numbers?: string[]
  shipping_method?: string
  items?: WPSOrderItem[]
}

export interface WPSOrderItem {
  sku: string
  quantity: number
  unit_price?: string
  line_total?: string
  status?: string
}

export interface WPSItem {
  id: number
  brand_id: number
  country_id: number | null
  product_id: number
  sku: string
  name: string
  list_price: string
  standard_dealer_price: string
  supplier_product_id: string
  length: number
  width: number
  height: number
  weight: number
  upc: string | null
  superseded_sku: string | null
  status_id: string
  status: string
  unit_of_measurement_id: number
  has_map_policy: boolean
  sort: number
  created_at: string
  updated_at: string
  published_at: string
  product_type: string
  mapp_price: string
  carb: string | null
  propd1: string | null
  propd2: string | null
  prop_65_code: string | null
  prop_65_detail: string | null
  drop_ship_fee: string
  drop_ship_eligible: boolean
  images?: {
    data: WPSImage[]
  }
  brand?: {
    data: WPSBrand
  }
}

export interface WPSProduct {
  id: number
  designation_id: number | null
  name: string
  alternate_name: string | null
  care_instructions: string | null
  description: string
  sort: number
  image_360_id: number | null
  image_360_preview_id: number | null
  size_chart_id: number | null
  created_at: string
  updated_at: string
  items?: {
    data: WPSItem[]
  }
  images?: {
    data: WPSImage[]
  }
  features?: WPSFeature[]
  brand?: {
    data: WPSBrand
  }
}

export interface WPSImage {
  id: number
  domain: string
  path: string
  filename: string
  alt: string | null
  mime: string
  width: number
  height: number
  size: number
  signature: string
  created_at: string
  updated_at: string
}

export interface WPSBrand {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface WPSFeature {
  id: number
  product_id: number
  icon_id: number | null
  sort: number
  name: string
  created_at: string
  updated_at: string
}

export interface WPSTaxonomyterm {
  id: number
  vocabulary_id: number
  parent_id: number | null
  name: string
  slug: string
  description: string | null
  link: string | null
  link_target_blank: boolean
  left: number
  right: number
  depth: number
  created_at: string
  updated_at: string
}

export interface WPSInventory {
  id: number
  item_id: number
  sku: string
  ca_warehouse: number
  ga_warehouse: number
  id_warehouse: number
  in_warehouse: number
  pa_warehouse: number
  pa2_warehouse: number
  tx_warehouse: number
  total: number
  created_at: string
  updated_at: string
}

export interface CustomerInfo {
  clerkUserId: string
  email: string
  name: string
  phone?: string
}

export interface ShippingInfo {
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  phone?: string
}

export interface OrderCreationData {
  customerInfo: CustomerInfo
  shippingInfo: ShippingInfo
  cartItems: Array<{
    sku: string
    quantity: number
    name: string
    price: string
  }>
  paymentIntentId: string
  totalAmount: number
}

export interface WPSPricing {
  list_price: string
  dealer_price: string
  mapp_price?: string
  cost?: string
  effective_date?: string
}

export interface WPSFitment {
  id: number
  item_id: number
  vehicle_id: number
  position?: string
  notes?: string
  created_at: string
  updated_at: string
}

export class QueryBuilder {
  private filters: Record<string, any> = {}
  private sorts: SortOptions[] = []
  private includes: string[] = []
  private pagination: PaginationOptions = {}

  addFilter(field: string, operator: string, value: any): QueryBuilder {
    if (operator === 'eq') {
      this.filters[`filter[${field}]`] = value
    } else {
      this.filters[`filter[${field}][${operator}]`] = value
    }
    return this
  }

  filterByName(query: string, operator: 'pre' | 'suf' | 'con' | 'eq' = 'pre'): QueryBuilder {
    return this.addFilter('name', operator, query)
  }

  filterBySku(sku: string, operator: 'pre' | 'suf' | 'con' | 'eq' = 'pre'): QueryBuilder {
    return this.addFilter('sku', operator, sku)
  }

  filterByBrand(brandId: number | number[]): QueryBuilder {
    return this.addFilter('brand_id', 'eq', Array.isArray(brandId) ? brandId.join(',') : brandId)
  }

  filterByProductType(productType: string): QueryBuilder {
    return this.addFilter('product_type', 'eq', productType)
  }

  filterByPriceRange(min?: number, max?: number): QueryBuilder {
    if (min !== undefined) {
      this.addFilter('list_price', 'gte', min)
    }
    if (max !== undefined) {
      this.addFilter('list_price', 'lte', max)
    }
    return this
  }

  filterByStatus(status: string): QueryBuilder {
    return this.addFilter('status', 'eq', status)
  }

  filterByDropShipEligible(eligible: boolean = true): QueryBuilder {
    return this.addFilter('drop_ship_eligible', 'eq', eligible)
  }

  filterByDateRange(field: 'created_at' | 'updated_at', from?: string, to?: string): QueryBuilder {
    if (from) {
      this.addFilter(field, 'gte', from)
    }
    if (to) {
      this.addFilter(field, 'lte', to)
    }
    return this
  }

  sortBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    this.sorts.push({ field, direction })
    return this
  }

  sortByName(direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    return this.sortBy('name', direction)
  }

  sortByPrice(direction: 'asc' | 'desc' = 'asc'): QueryBuilder {
    return this.sortBy('list_price', direction)
  }

  sortByDate(
    field: 'created_at' | 'updated_at' = 'created_at',
    direction: 'asc' | 'desc' = 'desc'
  ): QueryBuilder {
    return this.sortBy(field, direction)
  }

  include(relations: string | string[]): QueryBuilder {
    const relationsArray = Array.isArray(relations) ? relations : [relations]
    this.includes.push(...relationsArray)
    return this
  }

  includeImages(): QueryBuilder {
    return this.include('images')
  }

  includeBrand(): QueryBuilder {
    return this.include('brand')
  }

  includeInventory(): QueryBuilder {
    return this.include('inventory')
  }

  includeItems(): QueryBuilder {
    return this.include('items')
  }

  includeProduct(): QueryBuilder {
    return this.include('product')
  }

  pageSize(size: number): QueryBuilder {
    this.pagination.size = size
    return this
  }

  cursor(cursor: string): QueryBuilder {
    this.pagination.cursor = cursor
    return this
  }

  build(): QueryParams {
    const params: QueryParams = { ...this.filters }

    this.sorts.forEach((sort) => {
      params[`sort[${sort.direction}]`] = sort.field
    })

    if (this.includes.length > 0) {
      params.include = [...new Set(this.includes)].join(',')
    }

    if (this.pagination.size) {
      params['page[size]'] = this.pagination.size
    }
    if (this.pagination.cursor) {
      params['page[cursor]'] = this.pagination.cursor
    }

    return params
  }

  reset(): QueryBuilder {
    this.filters = {}
    this.sorts = []
    this.includes = []
    this.pagination = {}
    return this
  }

  clone(): QueryBuilder {
    const newBuilder = new QueryBuilder()
    newBuilder.filters = { ...this.filters }
    newBuilder.sorts = [...this.sorts]
    newBuilder.includes = [...this.includes]
    newBuilder.pagination = { ...this.pagination }
    return newBuilder
  }
}

export class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private defaultTTL = 5 * 60 * 1000

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      return null
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  static generateKey(endpoint: string, params?: QueryParams): string {
    const sortedParams = params
      ? Object.keys(params)
          .sort()
          .reduce((obj, key) => {
            obj[key] = params[key]
            return obj
          }, {} as QueryParams)
      : {}
    return `${endpoint}:${JSON.stringify(sortedParams)}`
  }
}

export class ImageUtils {
  private static readonly IMAGE_STYLES = ['200_max', '500_max', '1000_max', 'full'] as const

  static buildImageUrl(
    image: WPSImage,
    style: (typeof ImageUtils.IMAGE_STYLES)[number] = '500_max'
  ): string {
    if (!image.domain || !image.path || !image.filename) {
      throw new Error('Invalid image data')
    }

    const protocol = image.domain.startsWith('http') ? '' : 'https://'
    void style // Mark as used
    return `${protocol}${image.domain}${image.path}${image.filename}`
  }

  static getAvailableStyles() {
    return [...ImageUtils.IMAGE_STYLES]
  }

  static getFirstImage(item: WPSItem | WPSProduct): WPSImage | null {
    if (item.images && item.images.data && item.images.data.length > 0) {
      return item.images.data[0]
    }
    return null
  }

  static getAllImages(item: WPSItem | WPSProduct): WPSImage[] {
    if (item.images && item.images.data) {
      return item.images.data
    }
    return []
  }

  static getItemImageUrl(
    item: WPSItem | WPSProduct,
    style: (typeof ImageUtils.IMAGE_STYLES)[number] = '500_max',
    fallback: string = '/placeholder-product.svg'
  ): string {
    const image = ImageUtils.getFirstImage(item)
    if (image) {
      try {
        return ImageUtils.buildImageUrl(image, style)
      } catch (error) {
        console.warn('Failed to build image URL:', error)
        return fallback
      }
    }
    return fallback
  }

  static getItemImageUrls(
    item: WPSItem | WPSProduct,
    style: (typeof ImageUtils.IMAGE_STYLES)[number] = '500_max'
  ): string[] {
    const images = ImageUtils.getAllImages(item)
    return images
      .map((image) => {
        try {
          return ImageUtils.buildImageUrl(image, style)
        } catch (error) {
          console.warn('Failed to build image URL:', error)
          return '/placeholder-product.svg'
        }
      })
      .filter(Boolean)
  }

  static hasImages(item: WPSItem | WPSProduct): boolean {
    return !!(item.images && item.images.data && item.images.data.length > 0)
  }

  static getOptimizedImageUrl(
    item: WPSItem | WPSProduct,
    context: 'thumbnail' | 'card' | 'detail' | 'full' = 'card',
    fallback: string = '/placeholder-product.svg'
  ): string {
    const styleMap = {
      thumbnail: '200_max' as const,
      card: '500_max' as const,
      detail: '1000_max' as const,
      full: 'full' as const,
    }

    return ImageUtils.getItemImageUrl(item, styleMap[context], fallback)
  }
}

export class WPSApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'WPSApiError'
  }
}

export class WPSAuthError extends WPSApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401)
    this.name = 'WPSAuthError'
  }
}

export class WPSNotFoundError extends WPSApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
    this.name = 'WPSNotFoundError'
  }
}

export class WPSApiClient {
  private config: WPSConfig
  private defaultTimeout = 30000
  private cache: ApiCache
  private enableCaching: boolean
  private requestCache: Map<string, Promise<any>> = new Map()

  constructor(config: WPSConfig & { enableCaching?: boolean }) {
    if (!config.baseUrl || !config.token) {
      throw new Error('WPS API baseUrl and token are required')
    }

    this.config = {
      ...config,
      timeout: config.timeout || this.defaultTimeout,
    }
    this.enableCaching = config.enableCaching ?? true
    this.cache = new ApiCache()
  }

  private async makeRequest<T>(
    endpoint: string,
    params?: QueryParams,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint

    const baseUrl = this.config.baseUrl.endsWith('/')
      ? this.config.baseUrl
      : `${this.config.baseUrl}/`
    const url = new URL(cleanEndpoint, baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)))
          } else {
            url.searchParams.set(key, String(value))
          }
        }
      })
    }

    const method = options.method || 'GET'
    const requestKey = `${method}:${url.toString()}`

    if (this.requestCache.has(requestKey)) {
      return this.requestCache.get(requestKey)
    }

    const requestPromise = this.executeRequest<T>(url, options)

    this.requestCache.set(requestKey, requestPromise)

    requestPromise.finally(() => {
      setTimeout(() => {
        this.requestCache.delete(requestKey)
      }, 5000)
    })

    return requestPromise
  }

  private async executeRequest<T>(url: URL, options: RequestInit = {}): Promise<ApiResponse<T>> {

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        switch (response.status) {
          case 401:
            throw new WPSAuthError('Invalid API token or insufficient permissions')
          case 404:
            throw new WPSNotFoundError('Endpoint or resource not found')
          case 422:
            throw new WPSApiError(
              `Validation error: ${JSON.stringify(errorData)}`,
              response.status,
              errorData
            )
          default:
            throw new WPSApiError(
              `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
              response.status,
              errorData
            )
        }
      }

      const responseData = await response.json()
      return responseData
    } catch (error: unknown) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === 'AbortError') {
        throw new WPSApiError('Request timeout', 408)
      }

      if (error instanceof WPSApiError) {
        throw error
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Network Error:', errorMessage)
      throw new WPSApiError(`Network error: ${errorMessage}`, 0)
    }
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, params)
  }

  async post<T>(endpoint: string, data: any, params?: QueryParams): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, params, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any, params?: QueryParams): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, params, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, params, {
      method: 'DELETE',
    })
  }

  async getProducts(params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSProduct[]>('products', cleanParams)
  }

  async getProduct(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSProduct>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSProduct>(`products/${id}`, cleanParams)
  }

  async getProductItems(
    id: number | string,
    params?: QueryParams
  ): Promise<ApiResponse<WPSItem[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSItem[]>(`products/${id}/items`, cleanParams)
  }

  async getProductImages(
    id: number | string,
    params?: QueryParams
  ): Promise<ApiResponse<WPSImage[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSImage[]>(`products/${id}/images`, cleanParams)
  }

  async getItems(params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSItem[]>('items', cleanParams)
  }

  async getItem(id: number | string, params?: QueryParams): Promise<ApiResponse<WPSItem>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSItem>(`items/${id}`, cleanParams)
  }

  async getItemByCrutch(sku: string, params?: QueryParams): Promise<ApiResponse<WPSItem>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSItem>(`items/crutch/${sku}`, cleanParams)
  }

  async getItemInventory(
    id: number | string,
    params?: QueryParams
  ): Promise<ApiResponse<WPSInventory>> {
    const cleanParams = this.cleanParams({ include: 'inventory', ...params })
    return this.get<WPSInventory>(`items/${id}`, cleanParams)
  }

  async getBrands(params?: QueryParams): Promise<ApiResponse<WPSBrand[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSBrand[]>('brands', cleanParams)
  }

  async getBrand(id: number, params?: QueryParams): Promise<ApiResponse<WPSBrand>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSBrand>(`brands/${id}`, cleanParams)
  }

  async createCart(cartData: WPSCart): Promise<ApiResponse<WPSCart>> {
    const cleanData = this.cleanParams(cartData)
    return this.post<WPSCart>('carts', cleanData)
  }

  async getCart(poNumber: string): Promise<ApiResponse<WPSCart>> {
    return this.get<WPSCart>(`carts/${poNumber}`)
  }

  async addItemToCart(poNumber: string, item: WPSCartItem): Promise<ApiResponse<any>> {
    const cleanData = this.cleanParams(item)
    return this.post<any>(`carts/${poNumber}/items`, cleanData)
  }

  async deleteCart(poNumber: string): Promise<ApiResponse<any>> {
    return this.delete<any>(`carts/${poNumber}`)
  }

  async createOrder(poNumber: string): Promise<ApiResponse<WPSOrder>> {
    return this.post<WPSOrder>('orders', { po_number: poNumber })
  }

  async getOrder(poNumber: string): Promise<ApiResponse<WPSOrder>> {
    return this.get<WPSOrder>(`orders/${poNumber}`)
  }

  async getOrders(params?: {
    from_date?: string
    to_date?: string
  }): Promise<ApiResponse<WPSOrder[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSOrder[]>('orders', cleanParams)
  }

  async createOrderFromStripePayment(orderData: OrderCreationData): Promise<ApiResponse<WPSOrder>> {
    const { customerInfo, shippingInfo, cartItems, paymentIntentId, totalAmount } = orderData

    const poNumber = `FS_${Date.now()}_${paymentIntentId.slice(-6)}`

    const cartData: WPSCart = {
      po_number: poNumber,
      ship_name: shippingInfo.name,
      ship_address1: shippingInfo.address1,
      ship_address2: shippingInfo.address2,
      ship_city: shippingInfo.city,
      ship_state: shippingInfo.state,
      ship_zip: shippingInfo.zipCode,
      ship_phone: shippingInfo.phone || customerInfo.phone,
      email: customerInfo.email,
      pay_type: 'CC',
      comment1: `Customer: ${customerInfo.name} | Clerk ID: ${customerInfo.clerkUserId}`,
      comment2: `Stripe Payment: ${paymentIntentId} | Total: $${totalAmount.toFixed(2)}`,
      items: cartItems.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
        notes: `${item.name} - $${item.price}`.slice(0, 30),
      })),
    }

    try {
      await this.createCart(cartData)

      for (const item of cartItems) {
        await this.addItemToCart(poNumber, {
          sku: item.sku,
          quantity: item.quantity,
          notes: `${item.name} - $${item.price}`.slice(0, 30),
        })
      }

      const orderResponse = await this.createOrder(poNumber)

      return orderResponse
    } catch (error) {
      try {
        await this.deleteCart(poNumber)
      } catch (deleteError) {
        console.warn('Failed to cleanup cart after order creation error:', deleteError)
      }
      throw error
    }
  }

  async getImages(params?: QueryParams): Promise<ApiResponse<WPSImage[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSImage[]>('images', cleanParams)
  }

  async getImage(id: number, params?: QueryParams): Promise<ApiResponse<WPSImage>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSImage>(`images/${id}`, cleanParams)
  }

  async getTaxonomyterms(params?: QueryParams): Promise<ApiResponse<WPSTaxonomyterm[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSTaxonomyterm[]>('taxonomyterms', cleanParams)
  }

  async getTaxonomyterm(id: number, params?: QueryParams): Promise<ApiResponse<WPSTaxonomyterm>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSTaxonomyterm>(`taxonomyterms/${id}`, cleanParams)
  }

  async getTaxonomytermProducts(
    id: number,
    params?: QueryParams
  ): Promise<ApiResponse<WPSProduct[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSProduct[]>(`taxonomyterms/${id}/products`, cleanParams)
  }

  async getInventory(params?: QueryParams): Promise<ApiResponse<WPSInventory[]>> {
    const cleanParams = this.cleanParams(params)
    return this.get<WPSInventory[]>('inventory', cleanParams)
  }

  async getInventoryByItem(
    itemId: number,
    params?: QueryParams
  ): Promise<ApiResponse<WPSInventory[]>> {
    const cleanParams = this.cleanParams({
      ...params,
      'filter[item_id]': itemId,
    })
    return this.get<WPSInventory[]>('inventory', cleanParams)
  }


  async searchProducts(query: string, params?: QueryParams): Promise<ApiResponse<WPSProduct[]>> {
    const cleanParams = this.cleanParams({
      ...params,
      'filter[name][pre]': query,
    })
    return this.getProducts(cleanParams)
  }

  async searchItems(query: string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
    const cleanParams = this.cleanParams({
      ...params,
      'filter[name][pre]': query,
    })
    return this.getItems(cleanParams)
  }

  async searchItemsBySku(skuPrefix: string, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
    const cleanParams = this.cleanParams({
      ...params,
      'filter[sku][pre]': skuPrefix,
    })
    return this.getItems(cleanParams)
  }

  async getItemsByBrand(brandId: number, params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
    const cleanParams = this.cleanParams({
      ...params,
      'filter[brand_id]': brandId,
    })
    return this.getItems(cleanParams)
  }

  async getItemsByPriceRange(
    minPrice: number,
    maxPrice: number,
    params?: QueryParams
  ): Promise<ApiResponse<WPSItem[]>> {
    const cleanParams = this.cleanParams({
      ...params,
      'filter[list_price][gt]': minPrice,
      'filter[list_price][lt]': maxPrice,
    })
    return this.getItems(cleanParams)
  }

  async getCachedOrFetch<T>(
    endpoint: string,
    params?: QueryParams,
    ttl?: number
  ): Promise<ApiResponse<T>> {
    if (!this.enableCaching) {
      return this.get<T>(endpoint, params)
    }

    const cacheKey = ApiCache.generateKey(endpoint, params)
    const cached = this.cache.get<ApiResponse<T>>(cacheKey)

    if (cached) {
      return cached
    }

    const result = await this.get<T>(endpoint, params)
    this.cache.set(cacheKey, result, ttl)
    return result
  }

  createQuery(): QueryBuilder {
    return new QueryBuilder()
  }

  async executeQuery<T>(endpoint: string, query: QueryBuilder): Promise<ApiResponse<T>> {
    return this.getCachedOrFetch<T>(endpoint, query.build())
  }


  async getVehicles(params?: QueryParams): Promise<ApiResponse<WPSVehicle[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSVehicle[]>('vehicles', cleanParams)
  }

  async getVehicle(id: number, params?: QueryParams): Promise<ApiResponse<WPSVehicle>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSVehicle>(`vehicles/${id}`, cleanParams)
  }

  async getVehicleMakes(params?: QueryParams): Promise<ApiResponse<WPSVehicleMake[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSVehicleMake[]>('vehiclemakes', cleanParams)
  }

  async getVehicleModels(params?: QueryParams): Promise<ApiResponse<WPSVehicleModel[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSVehicleModel[]>('vehiclemodels', cleanParams)
  }

  async getAttributes(params?: QueryParams): Promise<ApiResponse<WPSAttribute[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSAttribute[]>('attributes', cleanParams)
  }

  async getAttribute(id: number, params?: QueryParams): Promise<ApiResponse<WPSAttribute>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSAttribute>(`attributes/${id}`, cleanParams)
  }

  async getCountries(params?: QueryParams): Promise<ApiResponse<WPSCountry[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSCountry[]>('countries', cleanParams)
  }

  async getCountry(id: number, params?: QueryParams): Promise<ApiResponse<WPSCountry>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSCountry>(`countries/${id}`, cleanParams)
  }

  async getWarehouses(params?: QueryParams): Promise<ApiResponse<WPSWarehouse[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSWarehouse[]>('warehouses', cleanParams)
  }

  async getWarehouse(id: number, params?: QueryParams): Promise<ApiResponse<WPSWarehouse>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSWarehouse>(`warehouses/${id}`, cleanParams)
  }

  async getResources(params?: QueryParams): Promise<ApiResponse<WPSResource[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSResource[]>('resources', cleanParams)
  }

  async getResource(id: number, params?: QueryParams): Promise<ApiResponse<WPSResource>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSResource>(`resources/${id}`, cleanParams)
  }

  async getTags(params?: QueryParams): Promise<ApiResponse<WPSTag[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSTag[]>('tags', cleanParams)
  }

  async getTag(id: number, params?: QueryParams): Promise<ApiResponse<WPSTag>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSTag>(`tags/${id}`, cleanParams)
  }

  async getVocabularies(params?: QueryParams): Promise<ApiResponse<WPSVocabulary[]>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSVocabulary[]>('vocabularies', cleanParams)
  }

  async getVocabulary(id: number, params?: QueryParams): Promise<ApiResponse<WPSVocabulary>> {
    const cleanParams = this.cleanParams(params)
    return this.getCachedOrFetch<WPSVocabulary>(`vocabularies/${id}`, cleanParams)
  }

  async advancedSearch(query: QueryBuilder): Promise<ApiResponse<WPSItem[]>> {
    return this.executeQuery<WPSItem[]>('items', query)
  }

  async searchProductsAdvanced(query: QueryBuilder): Promise<ApiResponse<WPSProduct[]>> {
    return this.executeQuery<WPSProduct[]>('products', query)
  }

  async getMultipleItems(ids: number[], params?: QueryParams): Promise<ApiResponse<WPSItem[]>> {
    const query = this.createQuery().addFilter('id', 'eq', ids.join(',')).pageSize(ids.length)

    if (params?.include) {
      query.include(params.include)
    }

    return this.executeQuery<WPSItem[]>('items', query)
  }

  async getMultipleProducts(
    ids: number[],
    params?: QueryParams
  ): Promise<ApiResponse<WPSProduct[]>> {
    const query = this.createQuery().addFilter('id', 'eq', ids.join(',')).pageSize(ids.length)

    if (params?.include) {
      query.include(params.include)
    }

    return this.executeQuery<WPSProduct[]>('products', query)
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size()
  }

  setCachingEnabled(enabled: boolean): void {
    this.enableCaching = enabled
    if (!enabled) {
      this.clearCache()
    }
  }

  private cleanParams(params?: QueryParams): QueryParams | undefined {
    if (!params) {
      return undefined
    }

    const cleaned: QueryParams = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'page' && typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue !== undefined && subValue !== null) {
              cleaned[`page[${subKey}]`] = subValue
            }
          })
        } else if (key === 'filter' && typeof value === 'object') {
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (filterValue !== undefined && filterValue !== null) {
              if (typeof filterValue === 'object') {
                Object.entries(filterValue).forEach(([operatorKey, operatorValue]) => {
                  if (operatorValue !== undefined && operatorValue !== null) {
                    cleaned[`filter[${filterKey}][${operatorKey}]`] = operatorValue
                  }
                })
              } else {
                cleaned[`filter[${filterKey}]`] = filterValue
              }
            }
          })
        } else if (key === 'sort' && typeof value === 'object') {
          Object.entries(value).forEach(([sortKey, sortValue]) => {
            if (sortValue !== undefined && sortValue !== null) {
              cleaned[`sort[${sortKey}]`] = sortValue
            }
          })
        } else if (key === 'fields' && typeof value === 'object') {
          Object.entries(value).forEach(([fieldKey, fieldValue]) => {
            if (fieldValue !== undefined && fieldValue !== null) {
              cleaned[`fields[${fieldKey}]`] = fieldValue
            }
          })
        } else {
          cleaned[key] = value
        }
      }
    })

    return Object.keys(cleaned).length > 0 ? cleaned : undefined
  }

  async getAllPages<T>(
    endpoint: string,
    params?: QueryParams,
    maxPages: number = 10
  ): Promise<T[]> {
    const allData: T[] = []
    let cursor: string | null = null
    let pageCount = 0

    do {
      const requestParams = this.cleanParams({
        ...params,
        'page[cursor]': cursor || undefined,
      })

      const response: ApiResponse<T[]> = await this.get<T[]>(endpoint, requestParams)

      if (Array.isArray(response.data)) {
        allData.push(...response.data)
      }

      cursor = response.meta?.cursor?.next || null
      pageCount++

      if (pageCount >= maxPages) {
        console.warn(`Reached maximum page limit (${maxPages}). There may be more data available.`)
        break
      }
    } while (cursor)

    return allData
  }
}

export function createWPSClient(
  config?: Partial<WPSConfig & { enableCaching?: boolean }>
): WPSApiClient {
  const baseUrl =
    config?.baseUrl || process.env.NEXT_PUBLIC_WPS_API_URL || process.env.WPS_API_URL || ''

  const token =
    config?.token || process.env.NEXT_PUBLIC_WPS_API_TOKEN || process.env.WPS_API_TOKEN || ''

  if (!baseUrl && !token && !config?.baseUrl && !config?.token) {
    console.warn('WPS API configuration not found. Please provide baseUrl and token manually.')
  }

  const defaultConfig: WPSConfig = {
    baseUrl,
    token,
  }

  return new WPSApiClient({ ...defaultConfig, ...config })
}
