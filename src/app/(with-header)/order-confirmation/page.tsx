'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface OrderData {
  paymentIntentId?: string
  poNumber?: string
  orderNumber?: string
  customerInfo: {
    name: string
    email: string
    phone?: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      zip: string
    }
  }
  items: Array<{
    id?: number
    sku: string
    name: string
    quantity: number
    price: number | string
  }>
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  timestamp: string
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent')
    const poNumber = searchParams.get('po')

    // Try to get order data from localStorage first
    const storedOrder = localStorage.getItem('lastOrder')
    
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        
        // Check if this matches either payment intent or PO number
        const isMatchingOrder = 
          (paymentIntentId && parsedOrder.paymentIntentId === paymentIntentId) ||
          (poNumber && parsedOrder.poNumber === poNumber)

        if (isMatchingOrder) {
          setOrderData(parsedOrder)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error('Failed to parse stored order:', error)
      }
    }

    // If no stored order or identifiers don't match, redirect
    if (!paymentIntentId && !poNumber) {
      router.push('/')
      return
    }

    // Could implement order lookup by payment intent or PO number here
    setLoading(false)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-steel-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-steel-900 mb-2">Order Not Found</h1>
          <p className="text-steel-600 mb-6">We couldn't find details for this order.</p>
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
                {orderData.poNumber && (
                  <p className="text-orange-100">Order #: {orderData.poNumber}</p>
                )}
                {orderData.orderNumber && (
                  <p className="text-orange-100">WPS Order #: {orderData.orderNumber}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-sm">Order Date</p>
                <p className="font-semibold">
                  {new Date(orderData.timestamp).toLocaleDateString()}
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
                  <p className="font-medium text-steel-900">{orderData.customerInfo.name}</p>
                  <p>{orderData.customerInfo.address.line1}</p>
                  {orderData.customerInfo.address.line2 && (
                    <p>{orderData.customerInfo.address.line2}</p>
                  )}
                  <p>
                    {orderData.customerInfo.address.city}, {orderData.customerInfo.address.state} {orderData.customerInfo.address.zip}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-bold text-steel-900 mb-3">Contact Information</h3>
                <div className="text-steel-600">
                  <p>{orderData.customerInfo.email}</p>
                  {orderData.customerInfo.phone && (
                    <p>{orderData.customerInfo.phone}</p>
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
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-steel-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-steel-900">{item.name}</h4>
                    <p className="text-sm text-steel-600">SKU: {item.sku}</p>
                    <p className="text-sm text-steel-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(parseFloat(String(item.price)) * item.quantity)}</p>
                    <p className="text-sm text-steel-600">{formatCurrency(parseFloat(String(item.price)))} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t border-steel-200 mt-6 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-steel-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderData.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-steel-600">
                  <span>Shipping</span>
                  <span>{orderData.totals.shipping === 0 ? 'FREE' : formatCurrency(orderData.totals.shipping)}</span>
                </div>
                <div className="flex justify-between text-steel-600">
                  <span>Tax</span>
                  <span>{formatCurrency(orderData.totals.tax)}</span>
                </div>
                <div className="border-t border-steel-200 pt-2">
                  <div className="flex justify-between font-bold text-lg text-steel-900">
                    <span>Total</span>
                    <span>{formatCurrency(orderData.totals.total)}</span>
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
              {orderData.paymentIntentId || orderData.poNumber}
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