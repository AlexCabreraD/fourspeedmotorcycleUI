'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCartStore, selectTotalItems, selectTotalPrice, selectShippingTotal, selectGrandTotal } from '@/lib/store/cart'
import { ImageUtils } from '@/lib/api/wps-client'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, isLoading } = useCartStore()
  const totalItems = useCartStore(selectTotalItems)
  const totalPrice = useCartStore(selectTotalPrice)
  const shippingTotal = useCartStore(selectShippingTotal)
  const grandTotal = useCartStore(selectGrandTotal)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<any>(null)

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const getItemImage = (item: any) => {
    // If item has images, use the first one
    if (item.images && item.images.length > 0) {
      return ImageUtils.buildImageUrl(item.images[0], '200_max')
    }
    
    // If item has product with images, use those
    if (item.product && item.product.images && item.product.images.length > 0) {
      return ImageUtils.buildImageUrl(item.product.images[0], '200_max')
    }
    
    // Fallback placeholder
    return '/placeholder-product.svg'
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

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-steel-200">
          <h2 className="text-lg font-semibold text-steel-900">
            Shopping Cart ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-steel-400 hover:text-steel-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-steel-500">Syncing your cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-steel-300 mb-4" />
              <h3 className="text-lg font-medium text-steel-900 mb-2">Your cart is empty</h3>
              <p className="text-steel-500 mb-6">Add some motorcycle parts to get started!</p>
              <button
                onClick={closeCart}
                className="btn btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 bg-steel-50 rounded-lg p-3">
                  {/* Product Image */}
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md bg-white"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.svg'
                    }}
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-steel-900 line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-sm text-steel-500">SKU: {item.sku}</p>
                    {item.product_type && (
                      <p className="text-xs text-steel-400">{item.product_type}</p>
                    )}
                    
                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-primary-600">
                        {formatPrice(item.list_price)}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          }}
                          disabled={item.quantity <= 1}
                          className={`w-6 h-6 flex items-center justify-center bg-white border border-steel-300 rounded transition-colors ${
                            item.quantity <= 1 
                              ? 'text-steel-300' 
                              : 'text-steel-600 hover:bg-steel-50'
                          }`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-steel-300 rounded text-steel-600 hover:bg-steel-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveClick(item)}
                      className="text-xs text-accent-600 hover:text-accent-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-steel-200 p-4 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-steel-600">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-steel-600">Shipping</span>
                <span className="font-medium">
                  {shippingTotal === 0 ? 'FREE' : formatPrice(shippingTotal)}
                </span>
              </div>
              {shippingTotal > 0 && (
                <p className="text-xs text-steel-500">
                  Free shipping on orders over $99
                </p>
              )}
              <div className="border-t border-steel-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-steel-900">Total</span>
                  <span className="font-bold text-lg text-primary-600">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full btn btn-outline text-center block"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full btn btn-primary text-center block"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
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
    </>
  )
}