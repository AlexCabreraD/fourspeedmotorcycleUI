'use client'

import { useState } from 'react'
import { orderService, CustomerInfo, OrderItem } from '@/lib/services/order-service'
import { formatCurrency } from '@/lib/utils'

export default function TestCheckoutPage() {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)

  // Sample test data
  const sampleCustomer: CustomerInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: {
      line1: '123 Test Street',
      line2: 'Apt 4B',
      city: 'Test City',
      state: 'CA',
      zip: '90210',
    },
  }

  const sampleItems: OrderItem[] = [
    {
      sku: 'TEST-001',
      quantity: 2,
      price: 29.99,
      dealerPrice: 20.99,
      name: 'Test Product 1',
    },
    {
      sku: 'TEST-002',
      quantity: 1,
      price: 149.99,
      dealerPrice: 99.99,
      name: 'Test Product 2',
    },
  ]

  const handleValidateOrder = async () => {
    setIsValidating(true)
    try {
      const result = await orderService.validateOrder(sampleCustomer, sampleItems)
      setValidationResult(result)
    } catch (error) {
      console.error('Validation error:', error)
      setValidationResult({ 
        valid: false, 
        errors: ['Validation failed'], 
        cartData: undefined 
      })
    } finally {
      setIsValidating(false)
    }
  }

  const totals = orderService.calculateTotals(sampleItems)

  return (
    <div className="min-h-screen bg-steel-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Test Checkout Validation
          </h1>
          <p className="text-steel-600">
            Test the order validation system without submitting to WPS
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Test Data */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-steel-900 mb-4">Sample Customer</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {sampleCustomer.name}</p>
                <p><span className="font-medium">Email:</span> {sampleCustomer.email}</p>
                <p><span className="font-medium">Phone:</span> {sampleCustomer.phone}</p>
                <p><span className="font-medium">Address:</span> {sampleCustomer.address.line1}</p>
                <p><span className="font-medium">City:</span> {sampleCustomer.address.city}, {sampleCustomer.address.state} {sampleCustomer.address.zip}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-steel-900 mb-4">Sample Items</h3>
              <div className="space-y-3">
                {sampleItems.map((item, index) => (
                  <div key={index} className="border-b border-steel-200 pb-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-steel-600">SKU: {item.sku}</p>
                    <p className="text-sm">Qty: {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-steel-500">Dealer: {formatCurrency(item.dealerPrice)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-steel-200">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Customer Total:</span>
                    <span>{formatCurrency(totals.customerTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dealer Cost:</span>
                    <span>{formatCurrency(totals.dealerTotal)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Profit:</span>
                    <span className="text-green-600">{formatCurrency(totals.profit)} ({totals.profitMargin.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleValidateOrder}
              disabled={isValidating}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Validate Order'}
            </button>
          </div>

          {/* Validation Results */}
          <div className="space-y-6">
            {validationResult && (
              <>
                <div className={`rounded-lg p-4 ${validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-bold mb-2 ${validationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {validationResult.valid ? '✅ Validation Passed' : '❌ Validation Failed'}
                  </h3>
                  
                  {!validationResult.valid && validationResult.errors && (
                    <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                      {validationResult.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {validationResult.cartData && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold text-steel-900 mb-4">WPS Cart Data Preview</h3>
                    <div className="bg-steel-100 rounded p-4 overflow-auto">
                      <pre className="text-xs text-steel-800">
                        {JSON.stringify(validationResult.cartData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2">Test Mode Status</h3>
              <p className="text-blue-700 text-sm">
                Current mode: <span className="font-medium">
                  {orderService.getConfig().testMode ? 'TEST MODE' : 'LIVE MODE'}
                </span>
              </p>
              <p className="text-blue-600 text-xs mt-1">
                {orderService.getConfig().testMode 
                  ? 'Orders will be simulated without WPS submission'
                  : 'Orders will be submitted to WPS for processing'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}