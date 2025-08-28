'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import StripeCheckout from '@/components/payments/StripeCheckout'
import { type ShippingAddress, useCartStore } from '@/lib/store/cart'
import { formatCurrency } from '@/lib/utils'

interface CheckoutFormProps {
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
}

interface FormData {
  // Contact Information
  email: string
  phone: string

  // Shipping Address
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string

  // Order Notes
  notes: string
}

const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
]

export default function CheckoutForm({ onSuccess, onError }: CheckoutFormProps) {
  const router = useRouter()
  const {
    items,
    getTotalPrice,
    getShippingTotal,
    setShippingAddress,
    calculateShippingRates,
    availableShippingRates,
    selectedShippingRate,
    selectShippingRate,
    shippingCalculating,
  } = useCartStore()
  const [formStep, setFormStep] = useState<'info' | 'shipping' | 'payment'>('info')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Calculate totals
  const subtotal = getTotalPrice()
  const shipping = getShippingTotal()
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email'
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.address1) {
      newErrors.address1 = 'Address is required'
    }
    if (!formData.city) {
      newErrors.city = 'City is required'
    }
    if (!formData.state) {
      newErrors.state = 'State is required'
    }
    if (!formData.zip) {
      newErrors.zip = 'ZIP code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = 'Invalid ZIP code'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission (proceed to shipping)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (items.length === 0) {
      onError?.('Cart is empty')
      return
    }

    // Set shipping address and calculate rates
    const shippingAddress: ShippingAddress = {
      name: `${formData.firstName} ${formData.lastName}`,
      street1: formData.address1,
      street2: formData.address2 || undefined,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: 'US',
      phone: formData.phone,
      email: formData.email,
    }

    setShippingAddress(shippingAddress)

    // Move to shipping step
    setFormStep('shipping')

    // Calculate shipping rates
    await calculateShippingRates()
  }

  // Handle shipping selection
  const handleShippingContinue = () => {
    if (!selectedShippingRate) {
      onError?.('Please select a shipping option')
      return
    }
    setFormStep('payment')
  }

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Prepare order data for WPS submission
      const orderData = {
        items: items.map((item) => ({
          id: item.id,
          sku: item.sku,
          quantity: item.quantity,
          price: parseFloat(item.list_price),
        })),
        customerInfo: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
        },
        shippingInfo: {
          address: formData.address1 + (formData.address2 ? ` ${formData.address2}` : ''),
          city: formData.city,
          state: formData.state,
          zipCode: formData.zip,
          country: 'US',
        },
        paymentIntentId,
        totals: { subtotal, shipping, tax, total },
        notes: formData.notes,
      }

      // Submit order to WPS and associate with user
      const orderResponse = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const orderResult = await orderResponse.json()

      if (!orderResponse.ok) {
        console.error('Order submission failed:', orderResult.error)
        // Still proceed to confirmation but show warning
        onError?.(`Payment successful but order processing failed: ${orderResult.error}`)
      }

      // Store order info for confirmation page
      localStorage.setItem(
        'lastOrder',
        JSON.stringify({
          paymentIntentId,
          poNumber: orderResult.po_number || null,
          orderNumber: orderResult.order_number || null,
          customerInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address1,
              line2: formData.address2,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
            },
          },
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.list_price,
          })),
          totals: { subtotal, shipping, tax, total },
          timestamp: new Date().toISOString(),
        })
      )

      onSuccess?.(paymentIntentId)
      router.push(`/order-confirmation?payment_intent=${paymentIntentId}`)
    } catch (error) {
      console.error('Error processing order:', error)
      onError?.('Payment successful but order processing failed. Please contact support.')
    }
  }

  // Handle payment error
  const handlePaymentError = (error: string) => {
    onError?.(error)
    // Could optionally go back to info step or show error inline
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (items.length === 0) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-2xl font-bold text-steel-900 mb-4'>Your cart is empty</h2>
        <p className='text-steel-600 mb-6'>Add some items to your cart before checking out.</p>
        <button
          onClick={() => router.push('/products')}
          className='bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors'
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  // Customer info for Stripe
  const customerInfo = {
    email: formData.email,
    name: `${formData.firstName} ${formData.lastName}`,
    phone: formData.phone,
  }

  // Shipping info for Stripe
  const shippingInfo = {
    address: formData.address1,
    city: formData.city,
    state: formData.state,
    zipCode: formData.zip,
    country: 'US',
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Progress indicator */}
        <div className='lg:col-span-3 mb-6'>
          <div className='flex items-center justify-center space-x-4'>
            <div
              className={`flex items-center space-x-2 ${
                formStep === 'info' ? 'text-orange-600' : 'text-green-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  formStep === 'info' ? 'bg-orange-600' : 'bg-green-600'
                }`}
              >
                {formStep !== 'info' ? '✓' : '1'}
              </div>
              <span className='font-medium'>Customer Info</span>
            </div>
            <div className='h-px w-16 bg-steel-300'></div>
            <div
              className={`flex items-center space-x-2 ${
                formStep === 'shipping'
                  ? 'text-orange-600'
                  : formStep === 'payment'
                    ? 'text-green-600'
                    : 'text-steel-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  formStep === 'shipping'
                    ? 'bg-orange-600'
                    : formStep === 'payment'
                      ? 'bg-green-600'
                      : 'bg-steel-400'
                }`}
              >
                {formStep === 'payment' ? '✓' : '2'}
              </div>
              <span className='font-medium'>Shipping</span>
            </div>
            <div className='h-px w-16 bg-steel-300'></div>
            <div
              className={`flex items-center space-x-2 ${
                formStep === 'payment' ? 'text-orange-600' : 'text-steel-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  formStep === 'payment' ? 'bg-orange-600' : 'bg-steel-400'
                }`}
              >
                3
              </div>
              <span className='font-medium'>Payment</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-2'>
          {formStep === 'info' ? (
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Contact Information */}
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <h3 className='text-lg font-bold text-steel-900 mb-4'>Contact Information</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-steel-700 mb-2'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.email ? 'border-red-500' : 'border-steel-300'
                      }`}
                      placeholder='your@email.com'
                    />
                    {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-steel-700 mb-2'>
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.phone ? 'border-red-500' : 'border-steel-300'
                      }`}
                      placeholder='(555) 123-4567'
                    />
                    {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <h3 className='text-lg font-bold text-steel-900 mb-4'>Shipping Address</h3>

                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-steel-700 mb-2'>
                        First Name *
                      </label>
                      <input
                        type='text'
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.firstName ? 'border-red-500' : 'border-steel-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-steel-700 mb-2'>
                        Last Name *
                      </label>
                      <input
                        type='text'
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.lastName ? 'border-red-500' : 'border-steel-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-steel-700 mb-2'>
                      Address Line 1 *
                    </label>
                    <input
                      type='text'
                      value={formData.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.address1 ? 'border-red-500' : 'border-steel-300'
                      }`}
                      placeholder='123 Main Street'
                    />
                    {errors.address1 && (
                      <p className='text-red-500 text-sm mt-1'>{errors.address1}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-steel-700 mb-2'>
                      Address Line 2
                    </label>
                    <input
                      type='text'
                      value={formData.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      className='w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      placeholder='Apartment, suite, etc.'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-steel-700 mb-2'>
                        City *
                      </label>
                      <input
                        type='text'
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.city ? 'border-red-500' : 'border-steel-300'
                        }`}
                      />
                      {errors.city && <p className='text-red-500 text-sm mt-1'>{errors.city}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-steel-700 mb-2'>
                        State *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.state ? 'border-red-500' : 'border-steel-300'
                        }`}
                      >
                        <option value=''>Select State</option>
                        {US_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className='text-red-500 text-sm mt-1'>{errors.state}</p>}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-steel-700 mb-2'>
                        ZIP Code *
                      </label>
                      <input
                        type='text'
                        value={formData.zip}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.zip ? 'border-red-500' : 'border-steel-300'
                        }`}
                        placeholder='12345'
                      />
                      {errors.zip && <p className='text-red-500 text-sm mt-1'>{errors.zip}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <h3 className='text-lg font-bold text-steel-900 mb-4'>Order Notes (Optional)</h3>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className='w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  rows={3}
                  placeholder='Special delivery instructions, questions, etc.'
                />
              </div>

              {/* Submit Button */}
              <div className='flex space-x-4'>
                <button
                  type='submit'
                  className='flex-1 bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors'
                >
                  Continue to Shipping
                </button>
              </div>
            </form>
          ) : formStep === 'shipping' ? (
            <div className='space-y-6'>
              {/* Back button */}
              <button
                onClick={() => setFormStep('info')}
                className='flex items-center text-steel-600 hover:text-steel-900 transition-colors'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Back to Customer Info
              </button>

              {/* Shipping Options */}
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <h3 className='text-lg font-bold text-steel-900 mb-4'>Choose Shipping Method</h3>

                {shippingCalculating ? (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4'></div>
                    <p className='text-steel-600'>Calculating shipping rates...</p>
                  </div>
                ) : availableShippingRates.length > 0 ? (
                  <div className='space-y-3'>
                    {availableShippingRates.map((rate) => (
                      <label key={rate.id} className='block'>
                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedShippingRate?.id === rate.id
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-steel-200 hover:border-steel-300'
                          }`}
                        >
                          <div className='flex items-center'>
                            <input
                              type='radio'
                              name='shipping'
                              value={rate.id}
                              checked={selectedShippingRate?.id === rate.id}
                              onChange={() => selectShippingRate(rate)}
                              className='mr-3 text-orange-600'
                            />
                            <div className='flex-1'>
                              <div className='flex justify-between items-center'>
                                <div>
                                  <h4 className='font-semibold text-steel-900'>{rate.service}</h4>
                                  <p className='text-sm text-steel-600'>{rate.carrier}</p>
                                </div>
                                <div className='text-right'>
                                  <p className='font-bold text-lg'>
                                    {rate.rate === 0 ? 'FREE' : formatCurrency(rate.rate)}
                                  </p>
                                  {rate.delivery_days && (
                                    <p className='text-sm text-steel-600'>
                                      {rate.delivery_days} business day
                                      {rate.delivery_days !== 1 ? 's' : ''}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-steel-600'>No shipping rates available for this address.</p>
                  </div>
                )}

                {/* Continue Button */}
                <div className='mt-6'>
                  <button
                    onClick={handleShippingContinue}
                    disabled={!selectedShippingRate}
                    className='w-full bg-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors disabled:bg-steel-300 disabled:cursor-not-allowed'
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Back button */}
              <button
                onClick={() => setFormStep('info')}
                className='flex items-center text-steel-600 hover:text-steel-900 transition-colors'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Back to Customer Info
              </button>

              {/* Stripe Checkout */}
              <StripeCheckout
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerInfo={customerInfo}
                shippingInfo={shippingInfo}
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow-lg p-6 sticky top-6'>
            <h3 className='text-lg font-bold text-steel-900 mb-4'>Order Summary</h3>

            {/* Cart Items */}
            <div className='space-y-3 mb-6'>
              {items.map((item) => (
                <div key={item.id} className='flex justify-between text-sm'>
                  <div className='flex-1'>
                    <p className='font-medium text-steel-900'>{item.name}</p>
                    <p className='text-steel-600'>Qty: {item.quantity}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>
                      {formatCurrency(parseFloat(item.list_price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className='border-t border-steel-200 pt-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Shipping</span>
                <span>
                  {!selectedShippingRate
                    ? 'TBD'
                    : shipping === 0
                      ? 'FREE'
                      : formatCurrency(shipping)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className='border-t border-steel-200 pt-2'>
                <div className='flex justify-between font-bold text-lg'>
                  <span>Total</span>
                  <span>{!selectedShippingRate ? 'TBD' : formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {selectedShippingRate && shipping === 0 && (
              <p className='text-green-600 text-sm mt-3 font-medium'>
                🎉 You qualify for free shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
