'use client'

import { useUser } from '@clerk/nextjs'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Package,
  RotateCcw,
  Search,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { createWPSClient, ImageUtils, WPSItem } from '@/lib/api/wps-client'
interface WPSOrderItem {
  sku: string
  order_quantity: number
  ship_quantity: number
  backorder_quantity: number
  price: number
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
  Invoiced: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Invoiced' },
  Shipped: { color: 'bg-blue-100 text-blue-800', icon: Truck, label: 'Shipped' },
  'B/O': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Backorder' },
  Processing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Processing' },
  Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  Cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' },
  Delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
}

// Transform WPS API response to flat order structure
const transformWPSOrders = (wpsOrders: WPSOrderResponse[]): Order[] => {
  const orders: Order[] = []

  wpsOrders.forEach((wpsOrder) => {
    wpsOrder.order_details.forEach((orderDetail) => {
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
        ship_zip: wpsOrder.ship_zip,
      })
    })
  })

  return orders
}

// Optimized: Bulk fetch items with images using a single API call
const enhanceOrdersWithItemDetails = async (orders: Order[]): Promise<Order[]> => {
  const client = createWPSClient()

  // Collect all unique SKUs from all orders
  const allSkus = Array.from(
    new Set(orders.flatMap((order) => order.items.map((item) => item.sku)))
  )

  if (allSkus.length === 0) {
    return orders
  }

  const itemDetailsMap = new Map<string, WPSItem>()

  try {
    // Use bulk filtering with multiple SKUs in a single API call
    // This is much faster than individual calls
    const response = await client.getItems({
      'filter[sku][in]': allSkus.join(','), // Optimized bulk SKU filter using 'in' operator
      include: 'images',
      'page[size]': allSkus.length > 100 ? 100 : allSkus.length, // Limit page size
    })

    if (response.data) {
      response.data.forEach((item) => {
        itemDetailsMap.set(item.sku, item)
      })
    }
  } catch {
    // Silent fail for performance - images will use fallback
  }

  // Enhance orders with the fetched item details
  return orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      const itemDetails = itemDetailsMap.get(item.sku)
      let imageUrl = ''

      if (itemDetails?.images?.data?.[0]) {
        try {
          imageUrl = ImageUtils.buildImageUrl(itemDetails.images.data[0], '200_max')
        } catch {
          // Silent fail - fallback to Package icon
        }
      }

      return {
        ...item,
        item_details: itemDetails,
        image_url: imageUrl,
      }
    }),
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

  // Fetch orders from WPS API (filtered by user)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded || !user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // First, get the user's associated PO numbers
        const userOrdersResponse = await fetch('/api/user/orders')
        if (!userOrdersResponse.ok) {
          const errorData = await userOrdersResponse.json().catch(() => ({}))
          console.error('User orders API error:', userOrdersResponse.status, errorData)

          if (userOrdersResponse.status === 401) {
            throw new Error('Authentication required. Please sign in to view your orders.')
          }

          throw new Error(
            `Failed to fetch user orders: ${errorData.details || errorData.error || 'Unknown error'}`
          )
        }

        const { orderPoNumbers } = await userOrdersResponse.json()

        // If user has no orders, show empty state
        if (!orderPoNumbers || orderPoNumbers.length === 0) {
          setOrders([])
          setLoading(false)
          return
        }

        const client = createWPSClient()

        // Fetch only the user's specific orders by PO number (secure approach)
        // Use Promise.allSettled to fetch all orders in parallel
        const orderPromises = orderPoNumbers.map((poNumber: string) =>
          client.getOrder(poNumber).catch((error: any): null => {
            console.warn(`Failed to fetch order ${poNumber}:`, error)
            return null
          })
        )

        const orderResults = await Promise.allSettled(orderPromises)
        const userOrdersData: WPSOrderResponse[] = []

        orderResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value?.data) {
            userOrdersData.push(result.value.data as WPSOrderResponse)
          }
        })

        if (userOrdersData.length > 0) {
          // Transform the WPS API response to our flat structure
          const userOrders = transformWPSOrders(userOrdersData)

          // Show user's orders immediately without images for fast initial render
          setOrders(userOrders)

          // Enhance orders with item details and images asynchronously
          enhanceOrdersWithItemDetails(userOrders)
            .then((enhancedOrders) => {
              setOrders(enhancedOrders)
            })
            .catch((error) => {
              console.error('Failed to load images:', error)
              // Keep orders without images rather than failing completely
            })
        } else {
          // No orders found for this user
          setOrders([])
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

  const filteredOrders = orders.filter((order) => {
    const searchTerm = searchQuery.toLowerCase()
    const matchesSearch =
      order.po_number.toLowerCase().includes(searchTerm) ||
      order.order_number.toLowerCase().includes(searchTerm) ||
      order.invoice_number.toLowerCase().includes(searchTerm) ||
      order.items.some((item) => item.sku.toLowerCase().includes(searchTerm))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'N/A'
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatPrice = (price: string | number) => {
    if (price === null || price === undefined) {
      return '$0.00'
    }
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) {
      return '$0.00'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice)
  }

  // Show loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='bg-white border-b border-steel-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-steel-900'>Order History</h1>
            <p className='mt-2 text-steel-600'>Track and manage your motorcycle parts orders</p>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <div className='animate-spin h-8 w-8 border-b-2 border-accent-600 rounded-full mx-auto mb-4'></div>
            <p className='text-steel-600'>Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='bg-white border-b border-steel-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-steel-900'>Order History</h1>
            <p className='mt-2 text-steel-600'>Track and manage your motorcycle parts orders</p>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <AlertCircle className='h-16 w-16 text-red-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-steel-900 mb-2'>Error Loading Orders</h3>
            <p className='text-steel-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700'
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
      <div className='min-h-screen bg-slate-50'>
        <div className='bg-white border-b border-steel-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-steel-900'>Order History</h1>
            <p className='mt-2 text-steel-600'>Track and manage your motorcycle parts orders</p>
          </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <Package className='h-20 w-20 text-steel-400 mx-auto mb-4' />
            <h2 className='text-2xl font-semibold text-steel-900 mb-4'>Sign in to view orders</h2>
            <p className='text-steel-600 mb-8 max-w-md mx-auto'>
              Sign in to your account to view your order history and track shipments.
            </p>
            <Link
              href='/sign-in'
              className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors shadow-sm'
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Development helper functions
  const handleTestAssociation = async () => {
    try {
      const response = await fetch('/api/test/associate-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Send empty body to use defaults
      })
      const result = await response.json()

      if (response.ok) {
        window.location.reload() // Refresh to show associated orders
      } else {
        console.error('Failed to associate test orders:', result.error)
        if (result.details) {
          console.error('Error details:', result.details)
        }
        alert(`Failed to associate test orders: ${result.details || result.error}`)
      }
    } catch (error) {
      console.error('Error associating test orders:', error)
      alert(`Error associating test orders: ${error}`)
    }
  }

  const handleClearAssociations = async () => {
    try {
      const response = await fetch('/api/test/associate-orders', {
        method: 'DELETE',
      })
      const result = await response.json()
      if (response.ok) {
        window.location.reload() // Refresh to clear orders
      } else {
        console.error('Failed to clear orders:', result.error)
      }
    } catch (error) {
      console.error('Error clearing orders:', error)
    }
  }

  if (!hasOrders) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='bg-white border-b border-steel-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-steel-900'>Order History</h1>
            <p className='mt-2 text-steel-600'>Track and manage your motorcycle parts orders</p>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <div className='text-steel-400 mb-6'>
              <Package className='h-20 w-20 mx-auto mb-4' />
            </div>

            <h2 className='text-2xl font-semibold text-steel-900 mb-4'>No orders yet</h2>
            <p className='text-steel-600 mb-8 max-w-md mx-auto'>
              Ready to upgrade your ride? Browse our premium motorcycle parts and accessories to
              place your first order.
            </p>

            <div className='space-y-4'>
              <Link
                href='/products'
                className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors shadow-sm'
              >
                <Package className='h-5 w-5 mr-2' />
                Start Shopping
              </Link>

              {/* Development Tools - Only show in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className='mt-8 pt-8 border-t border-steel-200'>
                  <p className='text-sm text-steel-500 mb-4'>Development Tools:</p>
                  <div className='flex gap-4 justify-center'>
                    <button
                      onClick={handleTestAssociation}
                      className='px-4 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50'
                    >
                      Associate Test Orders
                    </button>
                    <button
                      onClick={handleClearAssociations}
                      className='px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50'
                    >
                      Clear All Orders
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-white border-b border-steel-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-steel-900'>Order History</h1>
              <p className='mt-2 text-steel-600'>Track and manage your motorcycle parts orders</p>
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-primary-600'>{orders.length}</p>
              <p className='text-sm text-steel-500'>Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-6 mb-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-5 w-5 text-steel-400' />
                <input
                  type='text'
                  placeholder='Search orders by number or product...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className='sm:w-48'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='w-full pl-3 pr-8 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
              >
                <option value='all'>All Orders</option>
                <option value='Invoiced'>Invoiced</option>
                <option value='Shipped'>Shipped</option>
                <option value='B/O'>Backorder</option>
                <option value='Processing'>Processing</option>
                <option value='Pending'>Pending</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List - Accordion Style */}
        <div className='space-y-4'>
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || {
              color: 'bg-steel-100 text-steel-800',
              icon: Clock,
              label: order.status || 'Unknown',
            }
            const StatusIcon = status.icon
            const uniqueKey = `${order.po_number}-${order.order_number}`
            const isExpanded = showDetails === uniqueKey

            return (
              <div
                key={uniqueKey}
                className='bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden transition-all duration-200 hover:shadow-md'
              >
                {/* Accordion Header - Always Visible */}
                <button
                  onClick={() => setShowDetails(isExpanded ? null : uniqueKey)}
                  className='w-full p-6 text-left hover:bg-steel-25 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset'
                >
                  <div className='flex items-center justify-between'>
                    {/* Left Side - Order Info */}
                    <div className='flex items-center space-x-6'>
                      <div>
                        <h3 className='text-lg font-semibold text-steel-900'>
                          {order.order_number || order.po_number}
                        </h3>
                        <p className='text-sm text-steel-500 mt-1'>
                          Placed {formatDate(order.order_date || '')}
                        </p>
                      </div>

                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}
                      >
                        <StatusIcon className='h-4 w-4 mr-1.5' />
                        {status.label}
                      </div>

                      {/* Item Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className='hidden md:flex items-center space-x-3'>
                          <div className='flex -space-x-2'>
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className='w-10 h-10 rounded-lg border-2 border-white bg-steel-100 flex items-center justify-center overflow-hidden'
                              >
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.item_details?.name || `Item ${item.sku}`}
                                    className='w-full h-full object-cover'
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                ) : null}
                                <Package
                                  className={`h-5 w-5 text-steel-400 ${item.image_url ? 'hidden' : ''}`}
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className='w-10 h-10 rounded-lg border-2 border-white bg-steel-200 flex items-center justify-center'>
                                <span className='text-xs font-medium text-steel-600'>
                                  +{order.items.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className='text-sm text-steel-600'>
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Price & Expand */}
                    <div className='flex items-center space-x-2'>
                      <div className='text-right'>
                        <p className='text-xl font-bold text-steel-900'>
                          {formatPrice(order.order_total || '0')}
                        </p>
                        {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                          <p className='text-xs text-steel-500 font-mono mt-1'>
                            Track: {order.tracking_numbers[0].slice(-8)}
                          </p>
                        )}
                      </div>

                      {/* Expand Icon */}
                      <div
                        className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <svg
                          className='w-5 h-5 text-steel-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Row - Only when collapsed */}
                  {!isExpanded && (
                    <div className='mt-3 flex items-center justify-between text-sm text-steel-600'>
                      <div className='flex items-center space-x-4'>
                        {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                          <span className='flex items-center'>
                            <Truck className='h-4 w-4 mr-1' />
                            Tracking Available
                          </span>
                        )}
                        {order.ship_date && (
                          <span className='flex items-center'>
                            <Calendar className='h-4 w-4 mr-1' />
                            Shipped {formatDate(order.ship_date)}
                          </span>
                        )}
                        <span className='md:hidden'>
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </button>

                {/* Accordion Content - Expandable */}
                {isExpanded && (
                  <div className='border-t border-steel-200 bg-steel-25/50'>
                    <div className='p-6'>
                      {/* Order Details */}
                      <div className='mb-6'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                          <div>
                            <p className='font-medium text-steel-900 mb-1'>Order Details</p>
                            <p className='text-steel-600'>PO #{order.po_number}</p>
                            {order.order_number && (
                              <p className='text-steel-600'>Order #{order.order_number}</p>
                            )}
                            <p className='text-steel-600'>
                              Placed {formatDate(order.order_date || '')}
                            </p>
                            {order.invoice_number && (
                              <p className='text-steel-600'>Invoice #{order.invoice_number}</p>
                            )}
                          </div>

                          {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                            <div>
                              <p className='font-medium text-steel-900 mb-1'>Shipping</p>
                              {order.tracking_numbers.map((trackingNumber, index) => (
                                <p key={index} className='text-steel-600 font-mono text-xs'>
                                  {trackingNumber}
                                </p>
                              ))}
                              {order.ship_date && (
                                <p className='text-steel-600'>
                                  Shipped: {formatDate(order.ship_date)}
                                </p>
                              )}
                              {order.ship_via && (
                                <p className='text-steel-600'>Via: {order.ship_via}</p>
                              )}
                            </div>
                          )}

                          <div>
                            <p className='font-medium text-steel-900 mb-1'>Total</p>
                            <p className='text-xl font-bold text-steel-900'>
                              {formatPrice(order.order_total || '0')}
                            </p>
                            {order.freight && parseFloat(String(order.freight)) > 0 && (
                              <p className='text-steel-600 text-sm'>
                                Freight: {formatPrice(order.freight)}
                              </p>
                            )}
                            {order.warehouse && (
                              <p className='text-steel-600 text-sm'>Warehouse: {order.warehouse}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.length > 0 ? (
                        <div className='mb-6'>
                          <h4 className='text-lg font-semibold text-steel-900 mb-4'>
                            Items Ordered
                          </h4>
                          <div className='space-y-3'>
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className='flex items-center space-x-4 bg-white p-4 rounded-lg border border-steel-200'
                              >
                                <div className='w-16 h-16 rounded-lg bg-steel-100 flex items-center justify-center overflow-hidden'>
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.item_details?.name || `Item ${item.sku}`}
                                      className='w-full h-full object-cover'
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        e.currentTarget.nextElementSibling?.classList.remove(
                                          'hidden'
                                        )
                                      }}
                                    />
                                  ) : null}
                                  <Package
                                    className={`h-8 w-8 text-steel-400 ${item.image_url ? 'hidden' : ''}`}
                                  />
                                </div>
                                <div className='flex-1'>
                                  <h5 className='font-medium text-steel-900'>
                                    {item.item_details?.name || `Item ${item.sku}`}
                                  </h5>
                                  <p className='text-sm text-steel-500'>SKU: {item.sku}</p>
                                  <div className='flex items-center gap-4 mt-1'>
                                    <p className='text-sm text-steel-500'>
                                      Ordered: {item.order_quantity}
                                    </p>
                                    <p className='text-sm text-steel-500'>
                                      Shipped: {item.ship_quantity}
                                    </p>
                                    {item.backorder_quantity > 0 && (
                                      <p className='text-sm text-red-600'>
                                        Backorder: {item.backorder_quantity}
                                      </p>
                                    )}
                                    <p className='text-sm font-semibold text-steel-900'>
                                      {formatPrice(item.price)}
                                    </p>
                                  </div>
                                </div>
                                <div className='text-right'>
                                  <button className='text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors'>
                                    Buy Again
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className='mb-6'>
                          <h4 className='text-lg font-semibold text-steel-900 mb-4'>
                            Items Ordered
                          </h4>
                          <p className='text-steel-600'>
                            No item details available for this order.
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className='flex flex-wrap gap-3 pt-4 border-t border-steel-200'>
                        {order.tracking_numbers && order.tracking_numbers.length > 0 && (
                          <button className='inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-lg transition-colors'>
                            <Truck className='h-4 w-4 mr-2' />
                            Track Package
                          </button>
                        )}
                        <button className='inline-flex items-center px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors'>
                          <RotateCcw className='h-4 w-4 mr-2' />
                          Reorder Items
                        </button>
                        <button className='inline-flex items-center px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors'>
                          <MessageSquare className='h-4 w-4 mr-2' />
                          Contact Support
                        </button>
                        <button className='inline-flex items-center px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors'>
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
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <Search className='h-16 w-16 text-steel-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-steel-900 mb-2'>No orders found</h3>
            <p className='text-steel-600'>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
