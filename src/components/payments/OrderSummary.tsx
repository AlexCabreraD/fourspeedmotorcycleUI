'use client'

import { useCartStore, selectTotalItems, selectTotalPrice } from '@/lib/store/cart'
import { ImageUtils } from '@/lib/api/wps-client'
import Image from 'next/image'

interface OrderSummaryProps {
  shippingCost?: number
  taxAmount?: number
  discountAmount?: number
}

export default function OrderSummary({ 
  shippingCost = 0, 
  taxAmount = 0, 
  discountAmount = 0 
}: OrderSummaryProps) {
  const { items } = useCartStore()
  const totalPrice = useCartStore(selectTotalPrice)
  const totalItems = useCartStore(selectTotalItems)

  const subtotal = totalPrice - shippingCost - taxAmount + discountAmount
  const finalTotal = totalPrice

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getItemImage = (item: any) => {
    if (ImageUtils.hasImages(item)) {
      return ImageUtils.getOptimizedImageUrl(item, 'thumb', '/placeholder-product.svg')
    }
    return '/placeholder-product.svg'
  }

  return (
    <div className="bg-steel-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-steel-900 mb-6">
        Order Summary
      </h3>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.id}-${item.sku}`} className="flex items-center space-x-4">
            <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-steel-200">
              <Image
                src={getItemImage(item)}
                alt={item.name}
                fill
                className="object-contain p-2"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.svg'
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-steel-900 truncate">
                {item.name}
              </h4>
              <p className="text-xs text-steel-500">
                SKU: {item.sku}
              </p>
              <p className="text-xs text-steel-600">
                Qty: {item.quantity}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-steel-900">
                {formatPrice(parseFloat(item.list_price) * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-steel-500">
                  {formatPrice(parseFloat(item.list_price))} each
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t border-steel-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-steel-600">
            Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </span>
          <span className="font-medium text-steel-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-steel-600">Shipping</span>
            <span className="font-medium text-steel-900">
              {formatPrice(shippingCost)}
            </span>
          </div>
        )}

        {shippingCost === 0 && subtotal >= 99 && (
          <div className="flex justify-between text-sm">
            <span className="text-steel-600">Shipping</span>
            <span className="font-medium text-green-600">
              FREE
            </span>
          </div>
        )}

        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-steel-600">Tax</span>
            <span className="font-medium text-steel-900">
              {formatPrice(taxAmount)}
            </span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-steel-600">Discount</span>
            <span className="font-medium text-green-600">
              -{formatPrice(discountAmount)}
            </span>
          </div>
        )}

        <div className="border-t border-steel-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-steel-900">
              Total
            </span>
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Free Shipping Incentive */}
      {subtotal < 99 && shippingCost > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">
              Add {formatPrice(99 - subtotal)} more for FREE shipping!
            </span>
          </p>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-steel-200">
        <div className="space-y-2 text-xs text-steel-500">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            30-day return policy
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure checkout
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fast shipping
          </div>
        </div>
      </div>
    </div>
  )
}