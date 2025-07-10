'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useItemImage } from '@/hooks/useItemImages'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

// Component for individual cart item with proper image loading
function CartItem({ item, updateQuantity, onRemoveClick }: {
  item: any
  updateQuantity: (id: number, quantity: number) => void
  onRemoveClick: (item: any) => void
}) {
  const { imageUrl, loading: imageLoading, hasImages } = useItemImage(item, 'card')

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-start space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {imageLoading ? (
            <div className="w-24 h-24 bg-steel-100 rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl bg-steel-50"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.svg'
              }}
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-steel-900 mb-2">
                {item.name}
              </h3>
              <div className="space-y-1 text-sm text-steel-600">
                <p>SKU: <span className="font-medium">{item.sku}</span></p>
                {item.product_type && (
                  <p>Type: <span className="font-medium">{item.product_type}</span></p>
                )}
              </div>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => onRemoveClick(item)}
              className="p-2 text-steel-400 hover:text-accent-600 transition-colors"
              title="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xl font-bold text-primary-600">
              {formatPrice(item.list_price)}
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-steel-600 font-medium">Qty:</span>
              <div className="flex items-center border border-steel-300 rounded-lg">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  }}
                  disabled={item.quantity <= 1}
                  className={`p-2 transition-colors ${
                    item.quantity <= 1 
                      ? 'text-steel-300' 
                      : 'text-steel-600 hover:bg-steel-50'
                  }`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium bg-steel-50 min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 text-steel-600 hover:bg-steel-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Item Total */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-steel-200">
            <span className="text-sm text-steel-600">Item Total:</span>
            <span className="text-lg font-bold text-steel-900">
              {formatPrice(parseFloat(item.list_price) * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, shippingTotal, taxTotal, grandTotal } = useCartStore()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<any>(null)

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const handleRemoveClick = (item: any) => {
    setItemToRemove(item)
    setShowConfirmModal(true)
  }

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.id)
      setItemToRemove(null)
    }
  }

  const handleCloseModal = () => {
    setShowConfirmModal(false)
    setItemToRemove(null)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-steel-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-steel-900">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-steel-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-steel-900 mb-4">Your cart is empty</h2>
            <p className="text-steel-600 mb-8">
              Looks like you haven't added any motorcycle parts yet. 
              Start exploring our collection!
            </p>
            <Link
              href="/products"
              className="btn btn-primary btn-lg"
            >
              Shop Parts
            </Link>
          </div>
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
            href="/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-steel-900">Shopping Cart</h1>
            <p className="text-steel-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                onRemoveClick={handleRemoveClick}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-steel-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-steel-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-steel-600">Shipping</span>
                  <span className="font-medium">
                    {shippingTotal === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingTotal)
                    )}
                  </span>
                </div>

                {/* Free shipping notice */}
                {shippingTotal > 0 && (
                  <div className="text-xs text-steel-500 bg-steel-50 p-3 rounded-lg">
                    Add {formatPrice(99 - totalPrice)} more for free shipping!
                  </div>
                )}

                {/* Tax */}
                <div className="flex justify-between">
                  <span className="text-steel-600">Tax (8.5%)</span>
                  <span className="font-medium">{formatPrice(taxTotal)}</span>
                </div>

                {/* Total */}
                <div className="border-t border-steel-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-steel-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full btn btn-primary btn-lg text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="w-full btn btn-outline text-center block"
                >
                  Continue Shopping
                </Link>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        title="Remove Item"
        message={`Are you sure you want to remove "${itemToRemove?.name}" from your cart?`}
        confirmText="Remove"
        cancelText="Keep Item"
        confirmVariant="danger"
        icon="warning"
      />
    </div>
  )
}