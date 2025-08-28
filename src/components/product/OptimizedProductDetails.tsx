'use client'

import {
  Award,
  CheckCircle,
  Clock,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { ImageUtils, WPSItem, WPSProduct } from '@/lib/api/wps-client'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore, WishlistItem } from '@/lib/store/wishlist'

interface ProductWithItems extends WPSProduct {
  items: WPSItem[]
}

interface OptimizedProductDetailsProps {
  product: ProductWithItems
  selectedItem: WPSItem | null
  onItemSelect: (item: WPSItem) => void
}

// Memoized price display component
const PriceDisplay = memo(
  ({
    selectedItem,
    savingsAmount,
  }: {
    selectedItem: WPSItem | null
    savingsAmount?: number | null
  }) => {
    const formatPrice = useCallback((price: string) => {
      const numPrice = parseFloat(price)
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(numPrice)
    }, [])

    if (!selectedItem) {
      return null
    }

    return (
      <div className='flex flex-col space-y-1'>
        <div className='flex items-baseline space-x-2'>
          <span className='text-lg font-bold text-primary-600'>
            {formatPrice(selectedItem.list_price)}
          </span>
          {selectedItem.mapp_price && parseFloat(selectedItem.mapp_price) > 0 && (
            <span className='text-xs text-steel-400 line-through'>
              {formatPrice(selectedItem.mapp_price)}
            </span>
          )}
        </div>
        {savingsAmount && (
          <div className='inline-flex items-center bg-accent-600 text-white px-1.5 py-0.5 rounded text-xs font-medium w-fit'>
            Save {formatPrice(savingsAmount.toString())}
          </div>
        )}
      </div>
    )
  }
)

PriceDisplay.displayName = 'PriceDisplay'

// Simplified stock status component
const StockStatus = memo(({ selectedItem }: { selectedItem: WPSItem | null }) => {
  if (!selectedItem) {
    return (
      <div className='flex items-center space-x-2 p-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded border border-steel-200'>
        <span className='text-sm'>❓</span>
        <span className='font-medium text-sm text-slate-500'>Unknown</span>
      </div>
    )
  }

  let stockConfig
  switch (selectedItem.status) {
    case 'STK':
      stockConfig = {
        text: 'In Stock',
        color: 'text-emerald-700',
        bgGradient: 'from-emerald-100 to-green-100',
        icon: '',
      }
      break
    case 'LTD':
      stockConfig = {
        text: 'Limited Stock',
        color: 'text-amber-700',
        bgGradient: 'from-amber-100 to-yellow-100',
        icon: '⚠️',
      }
      break
    case 'OOS':
      stockConfig = {
        text: 'Out of Stock',
        color: 'text-red-700',
        bgGradient: 'from-red-100 to-rose-100',
        icon: '❌',
      }
      break
    default:
      stockConfig = {
        text: 'Check Availability',
        color: 'text-slate-700',
        bgGradient: 'from-slate-100 to-gray-100',
        icon: '🔍',
      }
  }

  return (
    <div
      className={`flex items-center ${stockConfig.icon ? 'space-x-2' : ''} p-2 bg-gradient-to-r ${stockConfig.bgGradient} rounded border border-steel-200`}
    >
      {stockConfig.icon && <span className='text-sm'>{stockConfig.icon}</span>}
      <span className={`font-medium text-sm ${stockConfig.color}`}>{stockConfig.text}</span>
    </div>
  )
})

StockStatus.displayName = 'StockStatus'

// Memoized item selector component
const ItemSelector = memo(
  ({
    product,
    selectedItem,
    onItemSelect,
  }: {
    product: ProductWithItems
    selectedItem: WPSItem | null
    onItemSelect: (item: WPSItem) => void
  }) => {
    const formatPrice = useCallback((price: string) => {
      const numPrice = parseFloat(price)
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(numPrice)
    }, [])

    // Sort items with selected item first to prevent flickering
    const getSortedItems = () => {
      if (!product?.items || !selectedItem) {
        return product?.items || []
      }

      // Sort items with selected item first, then all others in their original order
      const sortedItems = [...product.items]
      return sortedItems.sort((a, b) => {
        if (a.id === selectedItem.id) {
          return -1
        }
        if (b.id === selectedItem.id) {
          return 1
        }
        return 0
      })
    }

    const items = getSortedItems()

    if (!product.items || product.items.length <= 1) {
      return null
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='text-sm font-medium text-steel-900'>Available Options</h4>
          <span className='text-xs text-steel-500 bg-steel-100 px-2 py-0.5 rounded'>
            {product.items.length}
          </span>
        </div>
        <div className='space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar'>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemSelect(item)}
              className={`w-full p-2 border rounded text-left transition-all duration-200 text-sm ${
                selectedItem?.id === item.id
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200'
                  : 'border-steel-200 hover:border-primary-300 bg-white hover:bg-primary-25'
              }`}
            >
              <div className='flex justify-between items-start'>
                <div className='flex-1 pr-2'>
                  <div className='flex items-center space-x-1 mb-1'>
                    {selectedItem?.id === item.id && (
                      <div className='w-2 h-2 bg-primary-500 rounded-full flex-shrink-0'></div>
                    )}
                    <p className='font-medium text-steel-900 text-sm leading-tight truncate'>
                      {item.name}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2 text-xs'>
                    <span className='text-steel-500 font-mono'>{item.sku}</span>
                    {item.status && (
                      <span
                        className={`px-1 py-0.5 rounded text-xs ${
                          item.status === 'STK'
                            ? 'bg-green-100 text-green-600'
                            : item.status === 'LTD'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {item.status === 'STK' ? '✓' : item.status === 'LTD' ? '!' : '✗'}
                      </span>
                    )}
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-sm font-bold text-primary-600 block'>
                    {formatPrice(item.list_price)}
                  </span>
                  {item.mapp_price && parseFloat(item.mapp_price) > parseFloat(item.list_price) && (
                    <span className='text-xs text-steel-400 line-through'>
                      {formatPrice(item.mapp_price)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className='text-xs text-steel-500 text-center pt-1'>Click option to select</div>
      </div>
    )
  }
)

ItemSelector.displayName = 'ItemSelector'

// Memoized quantity selector component
const QuantitySelector = memo(
  ({
    quantity,
    onQuantityChange,
  }: {
    quantity: number
    onQuantityChange: (delta: number) => void
  }) => (
    <div className='flex items-center space-x-4'>
      <label className='font-semibold text-steel-900'>Quantity:</label>
      <div className='flex items-center border-2 border-steel-200 rounded-lg overflow-hidden'>
        <button
          onClick={() => onQuantityChange(-1)}
          className='p-3 hover:bg-steel-50 transition-colors disabled:opacity-50'
          disabled={quantity <= 1}
        >
          <Minus className='h-4 w-4' />
        </button>
        <span className='px-6 py-3 border-x border-steel-200 font-semibold min-w-[60px] text-center'>
          {quantity}
        </span>
        <button
          onClick={() => onQuantityChange(1)}
          className='p-3 hover:bg-steel-50 transition-colors'
        >
          <Plus className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
)

QuantitySelector.displayName = 'QuantitySelector'

// Memoized trust badges component
const TrustBadges = memo(() => (
  <div className='space-y-2'>
    <h4 className='text-sm font-medium text-steel-700 mb-2'>Why Shop With Us</h4>
    <div className='grid grid-cols-2 gap-2 text-xs'>
      <div className='flex items-center space-x-1 text-steel-600'>
        <Truck className='h-3 w-3 text-accent-600' />
        <span>Free Ship $99+</span>
      </div>
      <div className='flex items-center space-x-1 text-steel-600'>
        <Shield className='h-3 w-3 text-primary-600' />
        <span>Secure Checkout</span>
      </div>
      <div className='flex items-center space-x-1 text-steel-600'>
        <RotateCcw className='h-3 w-3 text-steel-600' />
        <span>30-Day Returns</span>
      </div>
      <div className='flex items-center space-x-1 text-steel-600'>
        <Clock className='h-3 w-3 text-accent-600' />
        <span>Same Day Ship</span>
      </div>
    </div>
  </div>
))

TrustBadges.displayName = 'TrustBadges'

const OptimizedProductDetails = memo(function OptimizedProductDetails({
  product,
  selectedItem,
  onItemSelect,
}: OptimizedProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [justAddedToCart, setJustAddedToCart] = useState(false)

  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  // Simplified calculations
  const savingsAmount =
    selectedItem?.mapp_price && selectedItem?.list_price
      ? (() => {
          const mapp = parseFloat(selectedItem.mapp_price)
          const list = parseFloat(selectedItem.list_price)
          return mapp > list ? mapp - list : null
        })()
      : null

  const inWishlist = selectedItem ? isInWishlist(selectedItem.id.toString()) : false

  // Reset quantity when item changes
  const prevSelectedItemId = useRef(selectedItem?.id)
  useEffect(() => {
    if (selectedItem?.id !== prevSelectedItemId.current) {
      setQuantity(1)
      prevSelectedItemId.current = selectedItem?.id
    }
  }, [selectedItem?.id])

  // Optimized handlers
  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta
      return newQuantity >= 1 ? newQuantity : prev
    })
  }, [])

  const handleAddToCart = useCallback(async () => {
    if (selectedItem && !isAddingToCart) {
      setIsAddingToCart(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call
        addItem(selectedItem, quantity)
        setJustAddedToCart(true)
        setTimeout(() => setJustAddedToCart(false), 2000)
      } finally {
        setIsAddingToCart(false)
      }
    }
  }, [selectedItem, quantity, isAddingToCart, addItem])

  const handleWishlist = useCallback(() => {
    if (!selectedItem) {
      return
    }

    // Get the current image URL for wishlist
    const imageUrl =
      selectedItem && ImageUtils.hasImages(selectedItem)
        ? ImageUtils.getItemImageUrls(selectedItem, '300_max')[0] || ''
        : ''

    const wishlistItem: WishlistItem = {
      id: selectedItem.id.toString(),
      name: selectedItem.name,
      price: selectedItem.list_price,
      image: imageUrl,
      brand: selectedItem.brand?.data?.name,
      sku: selectedItem.sku,
      slug: `/product/${selectedItem.product_id}?item=${selectedItem.id}`,
      productType: selectedItem.product_type,
    }

    toggleItem(wishlistItem)
  }, [selectedItem, toggleItem])

  return (
    <div className='space-y-4'>
      {/* Essential Purchase Info - Compact */}
      <div className='card p-4 space-y-4'>
        {/* Header with Brand & SKU */}
        <div className='flex items-center justify-between'>
          {selectedItem?.brand?.data && (
            <div className='inline-flex items-center space-x-1 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium'>
              <Award className='h-3 w-3' />
              <span className='uppercase tracking-wide'>{selectedItem.brand.data.name}</span>
            </div>
          )}
          {selectedItem && (
            <div className='text-xs text-steel-500 font-mono'>SKU: {selectedItem.sku}</div>
          )}
        </div>

        {/* Product Title - Compact */}
        <div>
          <h1 className='text-lg lg:text-xl font-display font-bold text-steel-900 leading-tight'>
            {product.name}
          </h1>
          {selectedItem && selectedItem.name !== product.name && (
            <p className='text-sm text-steel-600 mt-1'>{selectedItem.name}</p>
          )}
        </div>

        {/* Price & Stock - Side by Side */}
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline space-x-2'>
            <PriceDisplay selectedItem={selectedItem} savingsAmount={savingsAmount} />
          </div>
          <StockStatus selectedItem={selectedItem} />
        </div>
      </div>

      {/* Item Selection - Compact */}
      {product.items && product.items.length > 1 && (
        <div className='card p-3'>
          <ItemSelector product={product} selectedItem={selectedItem} onItemSelect={onItemSelect} />
        </div>
      )}

      {/* Purchase Actions - Compact */}
      <div className='card p-4 space-y-3'>
        {/* Quantity & Actions in Grid */}
        <div className='grid grid-cols-2 gap-3 items-center'>
          <div className='flex items-center space-x-2'>
            <label className='text-sm font-medium text-steel-700'>Qty:</label>
            <div className='flex items-center border border-steel-200 rounded'>
              <button
                onClick={() => handleQuantityChange(-1)}
                className='p-1 hover:bg-steel-50 transition-colors disabled:opacity-50'
                disabled={quantity <= 1}
              >
                <Minus className='h-3 w-3' />
              </button>
              <span className='px-2 py-1 border-x border-steel-200 text-sm font-medium min-w-[40px] text-center'>
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className='p-1 hover:bg-steel-50 transition-colors'
              >
                <Plus className='h-3 w-3' />
              </button>
            </div>
          </div>

          <button
            onClick={handleWishlist}
            className={`p-2 rounded border transition-all duration-200 ${
              inWishlist
                ? 'bg-red-50 text-red-600 border-red-300'
                : 'bg-white text-steel-600 border-steel-300 hover:bg-red-50 hover:text-red-600'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedItem || isAddingToCart || selectedItem?.status === 'OOS'}
          className={`w-full py-2.5 px-4 rounded font-medium transition-all duration-200 text-sm ${
            justAddedToCart
              ? 'bg-accent-600 text-white'
              : isAddingToCart
                ? 'bg-primary-600 text-white opacity-75'
                : selectedItem?.status === 'OOS'
                  ? 'bg-steel-300 text-steel-500 cursor-not-allowed'
                  : 'btn-primary'
          }`}
        >
          {justAddedToCart ? (
            <>
              <CheckCircle className='h-4 w-4 mr-2 inline' />
              Added to Cart!
            </>
          ) : isAddingToCart ? (
            <>
              <div className='animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full inline-block'></div>
              Adding...
            </>
          ) : selectedItem?.status === 'OOS' ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className='h-4 w-4 mr-2 inline' />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Trust Badges - Compact */}
      <div className='card p-3'>
        <TrustBadges />
      </div>
    </div>
  )
})

OptimizedProductDetails.displayName = 'OptimizedProductDetails'

export default OptimizedProductDetails
