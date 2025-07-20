'use client'

import { memo, useState, useCallback, useMemo } from 'react'
import { 
  Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, 
  Plus, Minus, CheckCircle, Award, Clock
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore, WishlistItem } from '@/lib/store/wishlist'
import { WPSProduct, WPSItem, ImageUtils } from '@/lib/api/wps-client'

interface ProductWithItems extends WPSProduct {
  items: WPSItem[]
}

interface OptimizedProductDetailsProps {
  product: ProductWithItems
  selectedItem: WPSItem | null
  onItemSelect: (item: WPSItem) => void
}

// Memoized price display component
const PriceDisplay = memo(({ 
  selectedItem, 
  savingsAmount 
}: {
  selectedItem: WPSItem | null
  savingsAmount?: number | null
}) => {
  const formatPrice = useCallback((price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }, [])

  if (!selectedItem) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold text-primary-600">
          {formatPrice(selectedItem.list_price)}
        </span>
        {selectedItem.mapp_price && parseFloat(selectedItem.mapp_price) > 0 && (
          <span className="text-xl text-steel-400 line-through">
            {formatPrice(selectedItem.mapp_price)}
          </span>
        )}
      </div>
      {savingsAmount && (
        <div className="text-green-600 font-semibold">
          You save {formatPrice(savingsAmount.toString())}
        </div>
      )}
    </div>
  )
})

PriceDisplay.displayName = 'PriceDisplay'

// Memoized stock status component
const StockStatus = memo(({ selectedItem }: { selectedItem: WPSItem | null }) => {
  const stockStatus = useMemo(() => {
    if (!selectedItem) return { status: 'unknown', text: 'Unknown', color: 'text-steel-500' }
    
    switch (selectedItem.status) {
      case 'STK':
        return { status: 'in-stock', text: 'In Stock', color: 'text-green-600' }
      case 'LTD':
        return { status: 'limited', text: 'Limited Stock', color: 'text-yellow-600' }
      case 'OOS':
        return { status: 'out-of-stock', text: 'Out of Stock', color: 'text-red-600' }
      default:
        return { status: 'check', text: 'Check Availability', color: 'text-steel-500' }
    }
  }, [selectedItem?.status])

  return (
    <div className="flex items-center space-x-2 p-3 bg-steel-50 rounded-lg">
      <CheckCircle className={`h-5 w-5 ${stockStatus.color}`} />
      <span className={`font-semibold ${stockStatus.color}`}>
        {stockStatus.text}
      </span>
      {selectedItem?.status === 'STK' && (
        <span className="text-steel-600 text-sm">
          • Ready to ship
        </span>
      )}
    </div>
  )
})

StockStatus.displayName = 'StockStatus'

// Memoized item selector component
const ItemSelector = memo(({ 
  product, 
  selectedItem, 
  onItemSelect 
}: {
  product: ProductWithItems
  selectedItem: WPSItem | null
  onItemSelect: (item: WPSItem) => void
}) => {
  const formatPrice = useCallback((price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }, [])

  const sortedItems = useMemo(() => {
    if (!product?.items || !selectedItem) return product?.items || []
    
    // Sort items with selected item first, then all others in their original order
    const items = [...product.items]
    return items.sort((a, b) => {
      if (a.id === selectedItem.id) return -1
      if (b.id === selectedItem.id) return 1
      return 0
    })
  }, [product.items, selectedItem?.id])

  if (!product.items || product.items.length <= 1) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-steel-900">Available Options</h3>
        <span className="text-sm text-steel-500 bg-steel-100 px-3 py-1 rounded-full">
          {product.items.length} options
        </span>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {sortedItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemSelect(item)}
            className={`w-full p-3 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
              selectedItem?.id === item.id
                ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-blue-50 ring-2 ring-primary-200 shadow-md'
                : 'border-steel-200 hover:border-primary-300 bg-white hover:bg-primary-25'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                  {selectedItem?.id === item.id && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 animate-pulse"></div>
                  )}
                  <p className="font-semibold text-steel-900 text-base leading-tight">{item.name}</p>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-steel-600 bg-steel-100 px-2 py-1 rounded-md font-mono">
                    SKU: {item.sku}
                  </span>
                  {item.status && (
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      item.status === 'STK' 
                        ? 'bg-green-100 text-green-700' 
                        : item.status === 'LTD'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'STK' ? 'In Stock' : item.status === 'LTD' ? 'Limited' : 'Out of Stock'}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-primary-600 block">
                  {formatPrice(item.list_price)}
                </span>
                {item.mapp_price && parseFloat(item.mapp_price) > parseFloat(item.list_price) && (
                  <span className="text-sm text-steel-400 line-through">
                    {formatPrice(item.mapp_price)}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Helper text */}
      <div className="text-xs text-steel-500 text-center bg-steel-50 rounded-lg p-2">
        Click on an option above to view details and pricing
      </div>
    </div>
  )
})

ItemSelector.displayName = 'ItemSelector'

// Memoized quantity selector component
const QuantitySelector = memo(({ 
  quantity, 
  onQuantityChange 
}: {
  quantity: number
  onQuantityChange: (delta: number) => void
}) => (
  <div className="flex items-center space-x-4">
    <label className="font-semibold text-steel-900">Quantity:</label>
    <div className="flex items-center border-2 border-steel-200 rounded-lg overflow-hidden">
      <button
        onClick={() => onQuantityChange(-1)}
        className="p-3 hover:bg-steel-50 transition-colors disabled:opacity-50"
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="px-6 py-3 border-x border-steel-200 font-semibold min-w-[60px] text-center">
        {quantity}
      </span>
      <button
        onClick={() => onQuantityChange(1)}
        className="p-3 hover:bg-steel-50 transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
))

QuantitySelector.displayName = 'QuantitySelector'

// Memoized trust badges component
const TrustBadges = memo(() => (
  <div className="border-t border-steel-200 pt-6 space-y-3">
    <div className="flex items-center space-x-3 text-sm text-steel-600">
      <Truck className="h-5 w-5 text-green-600" />
      <span>Free shipping on orders over $99</span>
    </div>
    <div className="flex items-center space-x-3 text-sm text-steel-600">
      <Shield className="h-5 w-5 text-blue-600" />
      <span>Secure checkout with SSL encryption</span>
    </div>
    <div className="flex items-center space-x-3 text-sm text-steel-600">
      <RotateCcw className="h-5 w-5 text-purple-600" />
      <span>30-day return policy</span>
    </div>
    <div className="flex items-center space-x-3 text-sm text-steel-600">
      <Clock className="h-5 w-5 text-orange-600" />
      <span>Ships same day if ordered by 3 PM EST</span>
    </div>
  </div>
))

TrustBadges.displayName = 'TrustBadges'

const OptimizedProductDetails = memo(function OptimizedProductDetails({
  product,
  selectedItem,
  onItemSelect
}: OptimizedProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [justAddedToCart, setJustAddedToCart] = useState(false)
  
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  // Memoized calculations
  const savingsAmount = useMemo(() => {
    if (!selectedItem?.mapp_price || !selectedItem?.list_price) return null
    const mapp = parseFloat(selectedItem.mapp_price)
    const list = parseFloat(selectedItem.list_price)
    if (mapp > list) {
      return mapp - list
    }
    return null
  }, [selectedItem?.mapp_price, selectedItem?.list_price])

  const inWishlist = useMemo(() => 
    selectedItem ? isInWishlist(selectedItem.id.toString()) : false,
    [selectedItem?.id, isInWishlist]
  )

  // Optimized handlers
  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity(prev => {
      const newQuantity = prev + delta
      return newQuantity >= 1 ? newQuantity : prev
    })
  }, [])

  const handleAddToCart = useCallback(async () => {
    if (selectedItem && !isAddingToCart) {
      setIsAddingToCart(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call
        addItem(selectedItem, quantity)
        setJustAddedToCart(true)
        setTimeout(() => setJustAddedToCart(false), 2000)
      } finally {
        setIsAddingToCart(false)
      }
    }
  }, [selectedItem, quantity, isAddingToCart, addItem])

  const handleWishlist = useCallback(() => {
    if (!selectedItem) return
    
    // Get the current image URL for wishlist
    const imageUrl = selectedItem && ImageUtils.hasImages(selectedItem) 
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
      productType: selectedItem.product_type
    }
    
    toggleItem(wishlistItem)
  }, [selectedItem, toggleItem])

  return (
    <div className="sticky top-8 bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Brand & Title */}
      <div className="space-y-3">
        {selectedItem?.brand?.data && (
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-primary-600" />
            <span className="text-sm text-primary-600 font-semibold uppercase tracking-wider">
              {selectedItem.brand.data.name}
            </span>
          </div>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold text-steel-900 leading-tight">
          {product.name}
        </h1>
        {selectedItem && selectedItem.name !== product.name && (
          <p className="text-lg text-steel-700 font-medium">{selectedItem.name}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-3">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < 4 ? 'fill-current' : 'fill-steel-200'}`}
            />
          ))}
        </div>
        <span className="text-steel-600 font-medium">4.0</span>
        <span className="text-steel-500">(23 reviews)</span>
      </div>

      {/* Price & Savings */}
      <PriceDisplay selectedItem={selectedItem} savingsAmount={savingsAmount} />

      {/* Stock Status */}
      <StockStatus selectedItem={selectedItem} />

      {/* SKU */}
      {selectedItem && (
        <div className="text-sm text-steel-600">
          <span className="font-medium">SKU:</span> 
          <span className="font-mono ml-1">{selectedItem.sku}</span>
        </div>
      )}

      {/* Item Selection */}
      <ItemSelector 
        product={product}
        selectedItem={selectedItem}
        onItemSelect={onItemSelect}
      />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <QuantitySelector 
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
        />

        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={!selectedItem || isAddingToCart || selectedItem?.status === 'OOS'}
            className={`w-full btn btn-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              justAddedToCart
                ? 'btn-success'
                : isAddingToCart
                ? 'btn-primary opacity-75'
                : selectedItem?.status === 'OOS'
                ? 'btn-outline cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {justAddedToCart ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Added to Cart!
              </>
            ) : isAddingToCart ? (
              <>
                <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Adding...
              </>
            ) : selectedItem?.status === 'OOS' ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            )}
          </button>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleWishlist}
              className={`flex-1 btn transition-colors ${
                inWishlist 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'btn-outline hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              }`}
            >
              <Heart className={`h-5 w-5 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button className="flex-1 btn btn-outline">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <TrustBadges />
    </div>
  )
})

OptimizedProductDetails.displayName = 'OptimizedProductDetails'

export default OptimizedProductDetails