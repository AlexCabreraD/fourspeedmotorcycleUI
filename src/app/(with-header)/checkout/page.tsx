'use client'

import dynamicImport from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

// Dynamically import the checkout form to avoid SSR issues with Zustand persist
const CheckoutForm = dynamicImport(() => import('@/components/checkout/CheckoutForm'), {
  ssr: false,
  loading: () => (
    <div className='min-h-screen bg-steel-50 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <div className='h-8 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse' />
          <div className='h-4 bg-steel-200 rounded w-96 mx-auto animate-pulse' />
        </div>
        <div className='max-w-4xl mx-auto'>
          <div className='h-96 bg-steel-200 rounded animate-pulse' />
        </div>
      </div>
    </div>
  ),
})

function CheckoutContent() {
  const router = useRouter()
  const [orderStatus, setOrderStatus] = useState<'form' | 'processing' | 'success' | 'error'>(
    'form'
  )
  const [statusMessage, setStatusMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSuccess = (paymentIntentId: string) => {
    setOrderStatus('success')
    setStatusMessage(`Payment successful! Transaction ID: ${paymentIntentId}`)
    // Redirect to order confirmation page
    router.push(`/order-confirmation?payment_intent=${paymentIntentId}`)
  }

  const handleError = (error: string) => {
    setOrderStatus('error')
    setStatusMessage(error)
  }

  if (!mounted) {
    return (
      <div className='min-h-screen bg-steel-50 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <div className='h-8 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse' />
            <div className='h-4 bg-steel-200 rounded w-96 mx-auto animate-pulse' />
          </div>
          <div className='max-w-4xl mx-auto'>
            <div className='h-96 bg-steel-200 rounded animate-pulse' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-steel-50 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-display font-bold text-steel-900 mb-4'>Checkout</h1>
          <p className='text-steel-600'>Complete your order securely</p>
        </div>

        {/* Status Messages */}
        {orderStatus === 'error' && (
          <div className='max-w-4xl mx-auto mb-6'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>Order Error</h3>
                  <p className='text-sm text-red-700 mt-1'>{statusMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        <CheckoutForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
