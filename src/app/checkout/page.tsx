'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useItemImage } from '@/hooks/useItemImages'

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, title: 'Information', description: 'Contact & Shipping' },
    { number: 2, title: 'Payment', description: 'Payment Method' },
    { number: 3, title: 'Review', description: 'Review Order' }
  ]

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step.number
                ? 'bg-primary-600 text-white'
                : 'bg-steel-200 text-steel-500'
            }`}>
              {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-steel-900' : 'text-steel-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-steel-500">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-px mx-6 ${
              currentStep > step.number ? 'bg-primary-600' : 'bg-steel-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// Order item component with image loading
function OrderItem({ item }: { item: any }) {
  const { imageUrl, loading: imageLoading } = useItemImage(item, 'thumbnail')

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-steel-200 last:border-b-0">
      <div className="flex-shrink-0">
        {imageLoading ? (
          <div className="w-16 h-16 bg-steel-100 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg bg-steel-50"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.svg'
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-steel-900 line-clamp-2">
          {item.name}
        </h4>
        <p className="text-xs text-steel-500">SKU: {item.sku}</p>
        <p className="text-xs text-steel-500">Qty: {item.quantity}</p>
      </div>
      <div className="text-sm font-semibold text-steel-900">
        {formatPrice(parseFloat(item.list_price) * item.quantity)}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, shippingTotal, taxTotal, grandTotal } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Customer Information
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Shipping Address
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // Options
    saveInfo: false,
    sameAsShipping: true,
    
    // Billing Address (if different)
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States'
  })

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      window.location.href = '/cart'
    }
  }, [items])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Format card number with spaces (1234 5678 9012 3456)
  const formatCardNumber = (value: string, previousValue?: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '')
    // Limit to 16 digits
    const limitedValue = cleanValue.slice(0, 16)
    // Add spaces every 4 digits
    const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formattedValue
  }

  // Format expiry date as MM/YY with better deletion handling
  const formatExpiryDate = (value: string, previousValue: string = '') => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '')
    const prevClean = previousValue.replace(/\D/g, '')
    
    // Handle deletion scenarios
    if (value.length < previousValue.length) {
      // If user backspaced on the slash (e.g., "12/" -> "12"), remove the last digit too
      if (previousValue.includes('/') && !value.includes('/') && cleanValue.length === prevClean.length) {
        // Remove the last digit from the month part
        const adjustedValue = cleanValue.slice(0, -1)
        if (adjustedValue.length >= 2) {
          return `${adjustedValue.slice(0, 2)}/${adjustedValue.slice(2)}`
        }
        return adjustedValue
      }
    }
    
    // Limit to 4 digits
    const limitedValue = cleanValue.slice(0, 4)
    
    // Add slash after 2 digits
    if (limitedValue.length >= 2) {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`
    }
    return limitedValue
  }

  // Format CVV (3-4 digits only)
  const formatCVV = (value: string, previousValue?: string) => {
    // Remove all non-digits and limit to 4 digits
    return value.replace(/\D/g, '').slice(0, 4)
  }

  // Format phone number
  const formatPhoneNumber = (value: string, previousValue?: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '')
    // Limit to 10 digits
    const limitedValue = cleanValue.slice(0, 10)
    // Format as (XXX) XXX-XXXX
    if (limitedValue.length >= 6) {
      return `(${limitedValue.slice(0, 3)}) ${limitedValue.slice(3, 6)}-${limitedValue.slice(6)}`
    } else if (limitedValue.length >= 3) {
      return `(${limitedValue.slice(0, 3)}) ${limitedValue.slice(3)}`
    }
    return limitedValue
  }

  // Format ZIP code (5 digits or 5+4 format)
  const formatZipCode = (value: string, previousValue?: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '')
    // Limit to 9 digits
    const limitedValue = cleanValue.slice(0, 9)
    // Add dash after 5 digits for ZIP+4
    if (limitedValue.length > 5) {
      return `${limitedValue.slice(0, 5)}-${limitedValue.slice(5)}`
    }
    return limitedValue
  }

  // Format name fields (letters, spaces, hyphens, apostrophes only)
  const formatNameField = (value: string, previousValue?: string) => {
    // Allow only letters, spaces, hyphens, and apostrophes
    return value.replace(/[^a-zA-Z\s\-']/g, '').slice(0, 50)
  }

  // Handle formatted input changes
  const handleFormattedInputChange = (field: string, value: string, formatter?: (val: string, prev?: string) => string) => {
    const previousValue = formData[field as keyof typeof formData] as string
    const formattedValue = formatter ? formatter(value, previousValue) : value
    setFormData(prev => ({ ...prev, [field]: formattedValue }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.firstName && formData.lastName && 
                 formData.address && formData.city && formData.state && formData.zipCode)
      case 2:
        return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.nameOnCard)
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = () => {
    // TODO: Implement order placement logic
    alert('Order placement functionality will be implemented here!')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-steel-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-steel-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-steel-900">Checkout</h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Step 1: Customer Information & Shipping */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-steel-900 mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="your@email.com"
                        maxLength={100}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleFormattedInputChange('firstName', e.target.value, formatNameField)}
                          className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleFormattedInputChange('lastName', e.target.value, formatNameField)}
                          className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          maxLength={50}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormattedInputChange('phone', e.target.value, formatPhoneNumber)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-steel-900 mb-6 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-primary-600" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="1234 Main Street"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        Apartment, suite, etc.
                      </label>
                      <input
                        type="text"
                        value={formData.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Apartment, suite, unit, etc."
                        maxLength={50}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleFormattedInputChange('city', e.target.value, formatNameField)}
                          className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                          State *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select State</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleFormattedInputChange('zipCode', e.target.value, formatZipCode)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="12345 or 12345-6789"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-steel-900 mb-6 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleFormattedInputChange('cardNumber', e.target.value, formatCardNumber)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19} // 16 digits + 3 spaces
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => handleFormattedInputChange('expiryDate', e.target.value, formatExpiryDate)}
                          className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="MM/YY"
                          maxLength={5} // MM/YY format
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => handleFormattedInputChange('cvv', e.target.value, formatCVV)}
                          className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="123"
                          maxLength={4} // 3-4 digits max
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-steel-700 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        value={formData.nameOnCard}
                        onChange={(e) => handleFormattedInputChange('nameOnCard', e.target.value, formatNameField)}
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="John Smith"
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-steel-900 mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary-600" />
                    Review Your Order
                  </h2>
                  
                  {/* Order Summary */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-steel-900 mb-3">Contact Information</h3>
                      <p className="text-steel-600">{formData.email}</p>
                      <p className="text-steel-600">{formData.firstName} {formData.lastName}</p>
                      {formData.phone && <p className="text-steel-600">{formData.phone}</p>}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-steel-900 mb-3">Shipping Address</h3>
                      <p className="text-steel-600">
                        {formData.address}
                        {formData.apartment && `, ${formData.apartment}`}
                        <br />
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-steel-900 mb-3">Payment Method</h3>
                      <p className="text-steel-600">
                        Card ending in {formData.cardNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="btn btn-outline"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!validateStep(currentStep)}
                  className={`btn ml-auto ${
                    validateStep(currentStep) 
                      ? 'btn-primary' 
                      : 'btn-outline opacity-50 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="btn btn-primary ml-auto"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-steel-900 mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-steel-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-steel-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-steel-600">Shipping</span>
                  <span className="font-medium">
                    {shippingTotal === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingTotal)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-steel-600">Tax</span>
                  <span className="font-medium">{formatPrice(taxTotal)}</span>
                </div>
                <div className="border-t border-steel-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-steel-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <p className="text-xs text-steel-500">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}