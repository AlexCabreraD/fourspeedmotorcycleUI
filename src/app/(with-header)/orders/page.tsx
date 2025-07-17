'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Package, Search, Filter, Calendar, Truck, CheckCircle, Clock, AlertCircle, MoreVertical, Eye, RotateCcw, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { createWPSClient, WPSOrder, WPSItem, ImageUtils } from '@/lib/api/wps-client'
// Define interfaces based on actual WPS API response structure
interface WPSOrderItem {
  sku: string
  order_quantity: number
  ship_quantity: number
  backorder_quantity: number
  price: number
  // Enhanced with item details
  item_details?: WPSItem
  image_url?: string
}

interface WPSOrderDetail {
  order_number: string
  order_status: string
  invoice_number: string
  freight: number
  misc_charges: number
  order_total: number
  warehouse: string
  order_date: string
  ship_date: string
  invoice_date: string
  ship_via: string
  tracking_numbers: string[]
  items: WPSOrderItem[]
}

interface WPSOrderResponse {
  po_number: string
  ship_name: string
  ship_address: string
  ship_city: string
  ship_state: string
  ship_zip: string
  order_details: WPSOrderDetail[]
}

// Flattened order interface for display
interface Order {
  po_number: string
  order_number: string
  invoice_number: string
  status: string
  order_date: string
  ship_date: string
  invoice_date: string
  freight: number
  misc_charges: number
  order_total: number
  warehouse: string
  tracking_numbers: string[]
  ship_via: string
  items: WPSOrderItem[]
  // Shipping info
  ship_name: string
  ship_address: string
  ship_city: string
  ship_state: string
  ship_zip: string
}

const statusConfig = {
  'Invoiced': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Invoiced' },
  'Shipped': { color: 'bg-blue-100 text-blue-800', icon: Truck, label: 'Shipped' },
  'B/O': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Backorder' },
  'Processing': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Processing' },
  'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  'Cancelled': { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' },
  'Delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' }
}

// Transform WPS API response to flat order structure
const transformWPSOrders = (wpsOrders: WPSOrderResponse[]): Order[] => {
  const orders: Order[] = []
  
  wpsOrders.forEach(wpsOrder => {
    wpsOrder.order_details.forEach(orderDetail => {
      orders.push({
        po_number: wpsOrder.po_number,
        order_number: orderDetail.order_number,
        invoice_number: orderDetail.invoice_number,
        status: orderDetail.order_status,
        order_date: orderDetail.order_date,
        ship_date: orderDetail.ship_date,
        invoice_date: orderDetail.invoice_date,
        freight: orderDetail.freight,
        misc_charges: orderDetail.misc_charges,
        order_total: orderDetail.order_total,
        warehouse: orderDetail.warehouse,
        tracking_numbers: orderDetail.tracking_numbers,
        ship_via: orderDetail.ship_via,
        items: orderDetail.items,
        ship_name: wpsOrder.ship_name,
        ship_address: wpsOrder.ship_address,
        ship_city: wpsOrder.ship_city,
        ship_state: wpsOrder.ship_state,
        ship_zip: wpsOrder.ship_zip
      })
    })
  })
  
  return orders
}

// Enhance orders with item details and images
const enhanceOrdersWithItemDetails = async (orders: Order[]): Promise<Order[]> => {
  const client = createWPSClient()
  
  // Collect all unique SKUs from all orders
  const allSkus = new Set<string>()
  orders.forEach(order => {
    order.items.forEach(item => {
      allSkus.add(item.sku)
    })
  })
  
  // Fetch item details for all SKUs in batches
  const skuArray = Array.from(allSkus)
  console.log('Fetching item details for SKUs:', skuArray)
  const itemDetailsMap = new Map<string, WPSItem>()
  
  try {
    // Process SKUs in batches of 20 to avoid overwhelming the API
    const batchSize = 20
    for (let i = 0; i < skuArray.length; i += batchSize) {
      const batch = skuArray.slice(i, i + batchSize)
      
      // For each SKU in the batch, fetch item details
      const batchPromises = batch.map(async (sku) => {
        try {
          const response = await client.getItems({
            'filter[sku]': sku,
            'include': 'images',
            'page[size]': 1
          })
          
          if (response.data && response.data.length > 0) {
            itemDetailsMap.set(sku, response.data[0])
            console.log(`Successfully fetched item details for SKU ${sku}`, {
              hasImages: !!response.data[0].images,
              imageCount: response.data[0].images?.data?.length || 0
            })
          } else {
            console.log(`No item found for SKU ${sku}`)
          }
        } catch (error) {
          console.warn(`Failed to fetch details for SKU ${sku}:`, error)
        }
      })
      
      await Promise.all(batchPromises)
      
      // Add a small delay between batches to be respectful to the API
      if (i + batchSize < skuArray.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  } catch (error) {
    console.error('Error fetching item details:', error)
  }
  
  // Enhance orders with the fetched item details
  return orders.map(order => ({
    ...order,
    items: order.items.map(item => {
      const itemDetails = itemDetailsMap.get(item.sku)
      let imageUrl = ''
      
      if (itemDetails && itemDetails.images?.data && itemDetails.images.data.length > 0) {
        try {
          imageUrl = ImageUtils.buildImageUrl(itemDetails.images.data[0], '200_max')
          console.log(`Built image URL for SKU ${item.sku}:`, imageUrl)
        } catch (error) {
          console.warn(`Failed to build image URL for SKU ${item.sku}:`, error)
        }
      } else {
        console.log(`No images found for SKU ${item.sku}`, {
          hasItemDetails: !!itemDetails,
          hasImages: !!itemDetails?.images,
          hasImagesData: !!itemDetails?.images?.data,
          imagesLength: itemDetails?.images?.data?.length
        })
      }
      
      return {
        ...item,
        item_details: itemDetails,
        image_url: imageUrl
      }
    })
  }))
}

export default function OrdersPage() {
  const { user, isLoaded } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Fetch orders from WPS API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const client = createWPSClient()
        
        // Get orders from the last 6 months
        const toDate = new Date()
        const fromDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 6)
        
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0].replace(/-/g, '')
        }
        
        const response = await client.getOrders({
          from_date: formatDate(fromDate),
          to_date: formatDate(toDate)
        })
        
        if (response.data && Array.isArray(response.data)) {
          // Transform the WPS API response to our flat structure
          const transformedOrders = transformWPSOrders(response.data as WPSOrderResponse[])
          
          // Enhance orders with item details and images
          const enhancedOrders = await enhanceOrdersWithItemDetails(transformedOrders)
          setOrders(enhancedOrders)
        } else {
          console.error('API response error:', response)
          setError('Failed to fetch orders - no data received')
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        if (err instanceof Error) {
          setError(`Failed to load orders: ${err.message}`)
        } else {
          setError('Failed to load orders. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, isLoaded])

  const hasOrders = orders.length > 0

  const filteredOrders = orders.filter(order => {
    const searchTerm = searchQuery.toLowerCase()
    const matchesSearch = 
      order.po_number.toLowerCase().includes(searchTerm) ||
      order.order_number.toLowerCase().includes(searchTerm) ||
      order.invoice_number.toLowerCase().includes(searchTerm) ||
      order.items.some(item => 
        item.sku.toLowerCase().includes(searchTerm)
      )
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: string | number) => {
    if (price === null || price === undefined) return '$0.00'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-steel-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-steel-900">Order History</h1>
            <p className="mt-2 text-steel-600">Track and manage your motorcycle parts orders</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-accent-600 rounded-full mx-auto mb-4"></div>
            <p className="text-steel-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-steel-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-steel-900">Order History</h1>
            <p className="mt-2 text-steel-600">Track and manage your motorcycle parts orders</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-steel-900 mb-2">Error Loading Orders</h3>
            <p className="text-steel-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show login required state
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-steel-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-steel-900">Order History</h1>
            <p className="mt-2 text-steel-600">Track and manage your motorcycle parts orders</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center">
            <Package className="h-20 w-20 text-steel-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-steel-900 mb-4">Sign in to view orders</h2>
            <p className="text-steel-600 mb-8 max-w-md mx-auto">
              Sign in to your account to view your order history and track shipments.
            </p>
            <Link 
              href="/sign-in"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!hasOrders) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-steel-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-steel-900">Order History</h1>
            <p className="mt-2 text-steel-600">Track and manage your motorcycle parts orders</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center">
            <div className="text-steel-400 mb-6">
              <Package className="h-20 w-20 mx-auto mb-4" />
            </div>
            
            <h2 className="text-2xl font-semibold text-steel-900 mb-4">No orders yet</h2>
            <p className="text-steel-600 mb-8 max-w-md mx-auto">
              Ready to upgrade your ride? Browse our premium motorcycle parts and accessories to place your first order.
            </p>
            
            <Link 
              href="/products"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors shadow-sm"
            >
              <Package className="h-5 w-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-steel-900">Order History</h1>
              <p className="mt-2 text-steel-600">Track and manage your motorcycle parts orders</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{orders.length}</p>
              <p className="text-sm text-steel-500">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-steel-400" />
                <input
                  type="text"
                  placeholder="Search orders by number or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Orders</option>
                <option value="Invoiced">Invoiced</option>
                <option value="Shipped">Shipped</option>
                <option value="B/O">Backorder</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List - Accordion Style */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || 
                          { color: 'bg-steel-100 text-steel-800', icon: Clock, label: order.status || 'Unknown' }
            const StatusIcon = status.icon
            const uniqueKey = `${order.po_number}-${order.order_number}`
            const isExpanded = showDetails === uniqueKey

            return (
              <div key={uniqueKey} className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                {/* Accordion Header - Always Visible */}
                <button
                  onClick={() => setShowDetails(isExpanded ? null : uniqueKey)}
                  className="w-full p-6 text-left hover:bg-steel-25 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    {/* Left Side - Order Info */}
                    <div className="flex items-center space-x-6">
                      <div>
                        <h3 className="text-lg font-semibold text-steel-900">
                          {order.order_number || order.po_number}
                        </h3>
                        <p className="text-sm text-steel-500 mt-1">
                          Placed {formatDate(order.order_date || '')}
                        </p>
                      </div>
                      
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="h-4 w-4 mr-1.5" />
                        {status.label}
                      </div>
                      
                      {/* Item Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className="hidden md:flex items-center space-x-3">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="w-10 h-10 rounded-lg border-2 border-white bg-steel-100 flex items-center justify-center overflow-hidden"
                              >
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.item_details?.name || `Item ${item.sku}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                ) : null}
                                <Package className={`h-5 w-5 text-steel-400 ${item.image_url ? 'hidden' : ''}`} />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-10 h-10 rounded-lg border-2 border-white bg-steel-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-steel-600">+{order.items.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-steel-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Price & Expand */}
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-xl font-bold text-steel-900">
                          {formatPrice(order.order_total || '0')}
                        </p>
                        {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                          <p className="text-xs text-steel-500 font-mono mt-1">
                            Track: {order.tracking_numbers[0].slice(-8)}
                          </p>
                        )}
                      </div>
                      
                      {/* Expand Icon */}
                      <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Row - Only when collapsed */}
                  {!isExpanded && (
                    <div className="mt-3 flex items-center justify-between text-sm text-steel-600">
                      <div className="flex items-center space-x-4">
                        {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                          <span className="flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            Tracking Available
                          </span>
                        )}
                        {order.ship_date && (
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Shipped {formatDate(order.ship_date)}
                          </span>
                        )}
                        <span className="md:hidden">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </button>

                {/* Accordion Content - Expandable */}
                {isExpanded && (
                  <div className="border-t border-steel-200 bg-steel-25/50">
                    <div className="p-6">
                      {/* Order Details */}
                      <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-steel-900 mb-1">Order Details</p>
                            <p className="text-steel-600">
                              PO #{order.po_number}
                            </p>
                            {order.order_number && (
                              <p className="text-steel-600">
                                Order #{order.order_number}
                              </p>
                            )}
                            <p className="text-steel-600">
                              Placed {formatDate(order.order_date || '')}
                            </p>
                            {order.invoice_number && (
                              <p className="text-steel-600">
                                Invoice #{order.invoice_number}
                              </p>
                            )}
                          </div>
                          
                          {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                            <div>
                              <p className="font-medium text-steel-900 mb-1">Shipping</p>
                              {order.tracking_numbers.map((trackingNumber, index) => (
                                <p key={index} className="text-steel-600 font-mono text-xs">
                                  {trackingNumber}
                                </p>
                              ))}
                              {order.ship_date && (
                                <p className="text-steel-600">
                                  Shipped: {formatDate(order.ship_date)}
                                </p>
                              )}
                              {order.ship_via && (
                                <p className="text-steel-600">
                                  Via: {order.ship_via}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <p className="font-medium text-steel-900 mb-1">Total</p>
                            <p className="text-xl font-bold text-steel-900">
                              {formatPrice(order.order_total || '0')}
                            </p>
                            {order.freight && parseFloat(order.freight) > 0 && (
                              <p className="text-steel-600 text-sm">
                                Freight: {formatPrice(order.freight)}
                              </p>
                            )}
                            {order.warehouse && (
                              <p className="text-steel-600 text-sm">
                                Warehouse: {order.warehouse}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.length > 0 ? (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-steel-900 mb-4">Items Ordered</h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-steel-200">
                                <div className="w-16 h-16 rounded-lg bg-steel-100 flex items-center justify-center overflow-hidden">
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.item_details?.name || `Item ${item.sku}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                      }}
                                    />
                                  ) : null}
                                  <Package className={`h-8 w-8 text-steel-400 ${item.image_url ? 'hidden' : ''}`} />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-steel-900">
                                    {item.item_details?.name || `Item ${item.sku}`}
                                  </h5>
                                  <p className="text-sm text-steel-500">SKU: {item.sku}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <p className="text-sm text-steel-500">Ordered: {item.order_quantity}</p>
                                    <p className="text-sm text-steel-500">Shipped: {item.ship_quantity}</p>
                                    {item.backorder_quantity > 0 && (
                                      <p className="text-sm text-red-600">Backorder: {item.backorder_quantity}</p>
                                    )}
                                    <p className="text-sm font-semibold text-steel-900">
                                      {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
                                    Buy Again
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-steel-900 mb-4">Items Ordered</h4>
                          <p className="text-steel-600">No item details available for this order.</p>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-steel-200">
                        {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-lg transition-colors">
                            <Truck className="h-4 w-4 mr-2" />
                            Track Package
                          </button>
                        )}
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reorder Items
                        </button>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Support
                        </button>
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors">
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center">
            <Search className="h-16 w-16 text-steel-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-steel-900 mb-2">No orders found</h3>
            <p className="text-steel-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}