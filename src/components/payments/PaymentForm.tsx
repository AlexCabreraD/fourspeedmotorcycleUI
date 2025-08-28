'use client'

import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { CheckCircle, CreditCard, Lock } from 'lucide-react'
import { useState } from 'react'

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  customerInfo?: {
    email?: string
    name?: string
    phone?: string
  }
  paymentElementOptions?: any
}

export default function PaymentForm({
  onSuccess,
  onError,
  customerInfo,
  paymentElementOptions,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [paymentType, setPaymentType] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setMessage('Payment system not ready. Please try again.')
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          payment_method_data: {
            billing_details: {
              name: customerInfo?.name,
              email: customerInfo?.email,
              phone: customerInfo?.phone,
            },
          },
        },
        redirect: 'if_required', // Only redirect if absolutely necessary
      })

      if (error) {
        // Payment failed
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(
            error.message || 'Payment failed. Please check your information and try again.'
          )
        } else {
          setMessage('An unexpected error occurred. Please try again.')
        }
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        setMessage('Payment successful!')
        onSuccess(paymentIntent.id)
      } else {
        // Payment requires additional action or is still processing
        setMessage('Payment is being processed...')
      }
    } catch (err: any) {
      setMessage('An unexpected error occurred. Please try again.')
      onError(err.message || 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Payment Element - includes card, Apple Pay, Google Pay */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2 mb-4'>
          <CreditCard className='h-5 w-5 text-steel-600' />
          <span className='font-medium text-steel-900'>Payment Method</span>
        </div>

        <PaymentElement
          options={paymentElementOptions}
          onChange={(event) => {
            if (event.value.type) {
              setPaymentType(event.value.type)
            }
          }}
        />
      </div>

      {/* Billing Address */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2 mb-4'>
          <Lock className='h-5 w-5 text-steel-600' />
          <span className='font-medium text-steel-900'>Billing Address</span>
        </div>

        <AddressElement
          options={{
            mode: 'billing',
            allowedCountries: ['US', 'CA'],
            fields: {
              phone: 'auto',
            },
            validation: {
              phone: {
                required: 'never',
              },
            },
          }}
        />
      </div>

      {/* Error/Success Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('successful')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className='flex items-center'>
            {message.includes('successful') ? (
              <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
            ) : (
              <svg className='h-5 w-5 text-red-400 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            <span className={message.includes('successful') ? 'text-green-800' : 'text-red-800'}>
              {message}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type='submit'
        disabled={!stripe || !elements || isProcessing}
        className={`w-full btn btn-lg font-semibold transition-all duration-200 ${
          isProcessing
            ? 'btn-outline opacity-75 cursor-not-allowed'
            : 'btn-primary hover:scale-[1.02] shadow-lg'
        }`}
      >
        {isProcessing ? (
          <>
            <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3'></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className='h-5 w-5 mr-2' />
            Complete Order
          </>
        )}
      </button>

      {/* Payment method hints */}
      <div className='text-center'>
        <p className='text-xs text-steel-500 mb-2'>
          We accept all major credit cards, Apple Pay, and Google Pay
        </p>
        <div className='flex justify-center items-center space-x-3 opacity-60'>
          <div className='text-xs bg-steel-100 px-2 py-1 rounded'>Visa</div>
          <div className='text-xs bg-steel-100 px-2 py-1 rounded'>Mastercard</div>
          <div className='text-xs bg-steel-100 px-2 py-1 rounded'>Amex</div>
          <div className='text-xs bg-steel-100 px-2 py-1 rounded'>Discover</div>
          <div className='text-xs bg-steel-100 px-2 py-1 rounded'>Apple Pay</div>
          <div className='text-xs bg-steel-100 px-2 py-1 rounded'>Google Pay</div>
        </div>
      </div>
    </form>
  )
}
