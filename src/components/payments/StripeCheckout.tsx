'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise, stripeAppearance, paymentElementOptions, type PaymentIntentData } from '@/lib/stripe/config'
import PaymentForm from './PaymentForm'
import { useCartStore, selectTotalPrice } from '@/lib/store/cart'

interface StripeCheckoutProps {
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
  customerInfo?: {
    email?: string
    name?: string
    phone?: string
  }
  shippingInfo?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

export default function StripeCheckout({ 
  onSuccess, 
  onError, 
  customerInfo,
  shippingInfo 
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { items, clearCart } = useCartStore()
  const totalPrice = useCartStore(selectTotalPrice)

  useEffect(() => {
    createPaymentIntent()
  }, [items, totalPrice])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!items.length) {
        setError('Cart is empty')
        setLoading(false)
        return
      }

      // Prepare order metadata
      const metadata = {
        orderId: `order_${Date.now()}`,
        customerEmail: customerInfo?.email || '',
        customerName: customerInfo?.name || '',
        items: JSON.stringify(items.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.list_price
        }))),
        itemCount: items.length.toString(),
        shippingCity: shippingInfo?.city || '',
        shippingState: shippingInfo?.state || '',
      }

      const paymentData: PaymentIntentData = {
        amount: totalPrice,
        currency: 'usd',
        metadata
      }

      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      setClientSecret(data.clientSecret)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to initialize payment'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // Clear the cart after successful payment
    clearCart()
    onSuccess?.(paymentIntentId)
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
    onError?.(errorMessage)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-steel-600">Initializing payment...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={createPaymentIntent}
                className="btn btn-outline text-red-700 border-red-300 hover:bg-red-50"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="text-yellow-800">
          <p>Unable to initialize payment. Please try again.</p>
        </div>
      </div>
    )
  }

  const elementsOptions = {
    clientSecret,
    appearance: stripeAppearance,
  }

  return (
    <div className="bg-white rounded-lg border border-steel-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-steel-900 mb-2">
          Payment Information
        </h3>
        <p className="text-sm text-steel-600">
          Complete your order with secure payment processing by Stripe
        </p>
      </div>

      <Elements stripe={stripePromise} options={elementsOptions}>
        <PaymentForm
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          customerInfo={customerInfo}
          paymentElementOptions={paymentElementOptions}
        />
      </Elements>

      {/* Security badges */}
      <div className="mt-6 pt-4 border-t border-steel-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-steel-500">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure SSL Encryption
          </div>
          <div className="text-steel-300">•</div>
          <div>Powered by Stripe</div>
          <div className="text-steel-300">•</div>
          <div>PCI Compliant</div>
        </div>
      </div>
    </div>
  )
}