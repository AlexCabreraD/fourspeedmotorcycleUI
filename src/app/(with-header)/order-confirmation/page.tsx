'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic'

interface WPSOrderItem {
  id: number
  sku: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface WPSOrder {
  po_number: string
  order_date: string
  order_status: string
  total_amount: number
  subtotal: number
  tax_amount: number
  shipping_amount: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    zip_code: string
    phone?: string
  }
  items: WPSOrderItem[]
}

interface OrderData {
  wpsOrder?: WPSOrder
  paymentIntentId?: string
  status: 'found' | 'not_found' | 'loading'
  error?: string
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const [orderData, setOrderData] = useState<OrderData>({ status: 'loading' })

  useEffect(() => {
    const fetchOrderData = async () => {
      const paymentIntentId = searchParams.get('payment_intent')
      const poNumber = searchParams.get('po')

      // Redirect if no identifiers
      if (!paymentIntentId && !poNumber) {
        router.push('/')
        return
      }

      try {
        if (poNumber) {
          // Direct PO number lookup from WPS
          const response = await fetch(`/api/wps/orders/${poNumber}`)
          if (response.ok) {
            const wpsOrder = await response.json()
            setOrderData({
              wpsOrder: wpsOrder.data,
              paymentIntentId,
              status: 'found'
            })
            return
          }
        }

        // If user is logged in, check their order history
        if (user) {
          const response = await fetch('/api/user/orders')
          if (response.ok) {
            const ordersData = await response.json()
            
            // Find matching order by payment intent or recent order
            const matchingOrder = ordersData.orders.find((order: WPSOrder) => 
              order.po_number === poNumber || 
              (paymentIntentId && (order as any).payment_intent_id === paymentIntentId)
            )

            if (matchingOrder && (matchingOrder as any).status === 'found') {
              setOrderData({
                wpsOrder: matchingOrder,
                paymentIntentId,
                status: 'found'
              })
              return
            }
          }
        }

        // Fall back to localStorage for guest users or recent orders
        const storedOrder = localStorage.getItem('lastOrder')
        if (storedOrder) {
          try {
            const parsedOrder = JSON.parse(storedOrder)
            
            // Check if this matches either payment intent or PO number
            const isMatchingOrder = 
              (paymentIntentId && parsedOrder.paymentIntentId === paymentIntentId) ||
              (poNumber && parsedOrder.poNumber === poNumber)

            if (isMatchingOrder) {
              setOrderData({
                paymentIntentId,
                status: 'found',
                // Convert legacy format to new format if needed
                wpsOrder: parsedOrder.wpsOrder || {
                  po_number: parsedOrder.poNumber || `FS_${Date.now()}`,
                  order_date: parsedOrder.timestamp || new Date().toISOString(),
                  order_status: 'confirmed',
                  total_amount: parsedOrder.totals?.total || 0,
                  subtotal: parsedOrder.totals?.subtotal || 0,
                  tax_amount: parsedOrder.totals?.tax || 0,
                  shipping_amount: parsedOrder.totals?.shipping || 0,
                  customer_name: parsedOrder.customerInfo?.name || 'Customer',
                  customer_email: parsedOrder.customerInfo?.email || '',
                  customer_phone: parsedOrder.customerInfo?.phone,
                  shipping_address: {
                    name: parsedOrder.customerInfo?.name || 'Customer',
                    address1: parsedOrder.customerInfo?.address?.line1 || '',
                    address2: parsedOrder.customerInfo?.address?.line2,
                    city: parsedOrder.customerInfo?.address?.city || '',
                    state: parsedOrder.customerInfo?.address?.state || '',
                    zip_code: parsedOrder.customerInfo?.address?.zip || '',
                    phone: parsedOrder.customerInfo?.phone
                  },
                  items: parsedOrder.items?.map((item: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
                    id: item.id || Math.random(),
                    sku: item.sku,
                    name: item.name,
                    quantity: item.quantity,
                    unit_price: parseFloat(String(item.price)),
                    total_price: parseFloat(String(item.price)) * item.quantity
                  })) || []
                }
              })
              return
            }
          } catch (error) {
            console.error('Failed to parse stored order:', error)
          }
        }

        // Order not found
        setOrderData({
          paymentIntentId,
          status: 'not_found',
          error: 'Order not found'
        })

      } catch (error) {
        console.error('Error fetching order data:', error)
        setOrderData({
          paymentIntentId,
          status: 'not_found',
          error: 'Failed to load order details'
        })
      }
    }

    fetchOrderData()
  }, [searchParams, router, user])

  if (orderData.status === 'loading') {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-steel-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (orderData.status === 'not_found' || !orderData.wpsOrder) {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-steel-900 mb-2">Order Not Found</h1>
          <p className="text-steel-600 mb-6">{orderData.error || "We couldn't find details for this order."}</p>
          <Link
            href="/"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const { wpsOrder } = orderData

  return (
    <div className="min-h-screen bg-steel-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-steel-600">
            Thank you for your order. We've received it and will begin processing shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-orange-600 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Order Details</h2>
                {orderData.paymentIntentId && (
                  <p className="text-orange-100">Payment ID: {orderData.paymentIntentId}</p>
                )}
                <p className="text-orange-100">Order #: {wpsOrder.po_number}</p>
                <p className="text-orange-100">Status: {wpsOrder.order_status || 'Confirmed'}</p>
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-sm">Order Date</p>
                <p className="font-semibold">
                  {new Date(wpsOrder.order_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Shipping Information */}
              <div>
                <h3 className="font-bold text-steel-900 mb-3">Shipping Address</h3>
                <div className="text-steel-600">
                  <p className="font-medium text-steel-900">{wpsOrder.shipping_address.name}</p>
                  <p>{wpsOrder.shipping_address.address1}</p>
                  {wpsOrder.shipping_address.address2 && (
                    <p>{wpsOrder.shipping_address.address2}</p>
                  )}
                  <p>
                    {wpsOrder.shipping_address.city}, {wpsOrder.shipping_address.state} {wpsOrder.shipping_address.zip_code}
                  </p>
                  {wpsOrder.shipping_address.phone && (
                    <p className="mt-2">Phone: {wpsOrder.shipping_address.phone}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-bold text-steel-900 mb-3">Contact Information</h3>
                <div className="text-steel-600">
                  <p className="font-medium text-steel-900">{wpsOrder.customer_name}</p>
                  <p>{wpsOrder.customer_email}</p>
                  {wpsOrder.customer_phone && (
                    <p>{wpsOrder.customer_phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-steel-200">
            <h3 className="text-lg font-bold text-steel-900">Order Items</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {wpsOrder.items.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center border-b border-steel-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-steel-900">{item.name}</h4>
                    <p className="text-sm text-steel-600">SKU: {item.sku}</p>
                    <p className="text-sm text-steel-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.total_price)}</p>
                    <p className="text-sm text-steel-600">{formatCurrency(item.unit_price)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t border-steel-200 mt-6 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-steel-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(wpsOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-steel-600">
                  <span>Shipping</span>
                  <span>{wpsOrder.shipping_amount === 0 ? 'FREE' : formatCurrency(wpsOrder.shipping_amount)}</span>
                </div>
                <div className="flex justify-between text-steel-600">
                  <span>Tax</span>
                  <span>{formatCurrency(wpsOrder.tax_amount)}</span>
                </div>
                <div className="border-t border-steel-200 pt-2">
                  <div className="flex justify-between font-bold text-lg text-steel-900">
                    <span>Total</span>
                    <span>{formatCurrency(wpsOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-steel-900 mb-4">What Happens Next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-steel-900">Order Processing</h4>
                <p className="text-steel-600 text-sm">
                  Your order is being processed and will be shipped from our warehouse within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <Package className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-steel-900">Order Packaged</h4>
                <p className="text-steel-600 text-sm">
                  Your items will be carefully packaged and prepared for shipment.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <Truck className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-steel-900">Shipping & Tracking</h4>
                <p className="text-steel-600 text-sm">
                  You'll receive tracking information via email once your order ships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-2">Order Tracking</h3>
          <p className="text-blue-800 text-sm mb-4">
            To track your order status, please save this reference: 
            <strong>
              {wpsOrder.po_number}
            </strong>
          </p>
          <p className="text-blue-700 text-sm">
            You can also check your email for order updates and tracking information.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <Link
            href="/products"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="bg-steel-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-steel-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-steel-600">Loading order details...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}