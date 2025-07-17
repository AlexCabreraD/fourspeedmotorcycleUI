'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, 
  ChevronLeft, ChevronRight, Plus, Minus, ZoomIn, X, Maximize2,
  CheckCircle, AlertCircle, Info, Package, Eye, ThumbsUp, Award,
  Clock, MapPin, Phone, Mail, ExternalLink
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore, WishlistItem } from '@/lib/store/wishlist'
import { WPSProduct, WPSItem, ImageUtils } from '@/lib/api/wps-client'

interface ProductWithItems extends WPSProduct {
  items: WPSItem[]
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductDetails({ params }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [product, setProduct] = useState<ProductWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<WPSItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState('overview')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [justAddedToCart, setJustAddedToCart] = useState(false)
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  // Fetch product data only when product ID changes
  useEffect(() => {
    if (!resolvedParams?.id) return

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${resolvedParams.id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setProduct(data.data)
        } else {
          setError(data.error || 'Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams])

  // Handle initial item selection and URL param changes separately
  useEffect(() => {
    if (!product?.items || product.items.length === 0) return

    const itemId = searchParams.get('item')
    let itemToSelect = product.items[0] // Default to first item
    
    if (itemId) {
      const specificItem = product.items.find((item: WPSItem) => item.id.toString() === itemId)
      if (specificItem) {
        itemToSelect = specificItem
      }
    }
    
    // Only update if the selected item is actually different
    if (!selectedItem || selectedItem.id !== itemToSelect.id) {
      setSelectedItem(itemToSelect)
    }
  }, [product?.items, searchParams])

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const updateSelectedItem = (item: WPSItem) => {
    // Only update if selecting a different item
    if (selectedItem?.id === item.id) return
    
    setSelectedItem(item)
    setCurrentImageIndex(0)
    
    // Update URL with the selected item ID only if it's different from current URL
    const currentItemId = searchParams.get('item')
    if (currentItemId !== item.id.toString()) {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set('item', item.id.toString())
      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false })
    }
  }

  const getSortedItems = () => {
    if (!product?.items || !selectedItem) return product?.items || []
    
    // Sort items with selected item first, then all others in their original order
    const sortedItems = [...product.items]
    return sortedItems.sort((a, b) => {
      if (a.id === selectedItem.id) return -1
      if (b.id === selectedItem.id) return 1
      return 0
    })
  }

  const getProductImages = () => {
    if (!selectedItem) {
      return ['/placeholder-product.svg']
    }
    
    if (ImageUtils.hasImages(selectedItem)) {
      return ImageUtils.getItemImageUrls(selectedItem, '800_max')
    }
    
    return ['/placeholder-product.svg']
  }

  const handleAddToCart = async () => {
    if (selectedItem && !isAddingToCart) {
      setIsAddingToCart(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
        addItem(selectedItem, quantity)
        setJustAddedToCart(true)
        setTimeout(() => setJustAddedToCart(false), 2000)
      } finally {
        setIsAddingToCart(false)
      }
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleWishlist = () => {
    if (!selectedItem) return
    
    const wishlistItem: WishlistItem = {
      id: selectedItem.id.toString(),
      name: selectedItem.name,
      price: selectedItem.list_price,
      image: currentItemImages[0] || '',
      brand: selectedItem.brand?.name,
      sku: selectedItem.sku,
      slug: `/product/${selectedItem.product_id}?item=${selectedItem.id}`
    }
    
    toggleItem(wishlistItem)
  }

  const nextImage = () => {
    const images = getProductImages()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getProductImages()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleImageError = (index: number) => {
    setImageLoadError(prev => new Set([...prev, index]))
  }

  const getStockStatus = () => {
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
  }

  const getSavingsAmount = () => {
    if (!selectedItem?.mapp_price || !selectedItem?.list_price) return null
    const mapp = parseFloat(selectedItem.mapp_price)
    const list = parseFloat(selectedItem.list_price)
    if (mapp > list) {
      return mapp - list
    }
    return null
  }

  const inWishlist = selectedItem ? isInWishlist(selectedItem.id.toString()) : false

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isImageModalOpen) {
        if (e.key === 'Escape') {
          setIsImageModalOpen(false)
        } else if (e.key === 'ArrowLeft') {
          prevImage()
        } else if (e.key === 'ArrowRight') {
          nextImage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isImageModalOpen])

  // Reset image index when item changes
  useEffect(() => {
    setCurrentImageIndex(0)
    setImageLoadError(new Set())
  }, [selectedItem?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading Skeleton */}
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-4 bg-steel-200 rounded w-16"></div>
              <div className="h-4 bg-steel-200 rounded w-1"></div>
              <div className="h-4 bg-steel-200 rounded w-20"></div>
              <div className="h-4 bg-steel-200 rounded w-1"></div>
              <div className="h-4 bg-steel-200 rounded w-32"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-steel-200 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-steel-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-4 bg-steel-200 rounded w-24"></div>
                  <div className="h-8 bg-steel-200 rounded w-3/4"></div>
                  <div className="h-6 bg-steel-200 rounded w-1/2"></div>
                </div>
                <div className="h-12 bg-steel-200 rounded w-32"></div>
                <div className="h-16 bg-steel-200 rounded"></div>
                <div className="h-12 bg-steel-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-steel-900 mb-4">Product Not Found</h1>
            <p className="text-steel-600 mb-6">{error || 'The requested product could not be found.'}</p>
            <div className="space-y-3">
              <Link href="/products" className="btn btn-primary w-full">
                Browse All Products
              </Link>
              <Link href="/" className="btn btn-outline w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const images = getProductImages()
  const stockStatus = getStockStatus()
  const savingsAmount = getSavingsAmount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-steel-600 mb-8 p-4 bg-white rounded-lg shadow-sm">
          <Link href="/" className="hover:text-primary-600 transition-colors font-medium">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-primary-600 transition-colors font-medium">Products</Link>
          <ChevronRight className="h-4 w-4" />
          {selectedItem?.product_type && (
            <>
              <span className="text-steel-500">{selectedItem.product_type}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-steel-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Product Images - Enhanced */}
          <div className="xl:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative aspect-square bg-steel-50 group cursor-pointer"
                   onClick={() => setIsImageModalOpen(true)}>
                <Image
                  src={images[currentImageIndex]}
                  alt={selectedItem?.name || product.name}
                  fill
                  className="object-contain transition-all duration-500 group-hover:scale-105 p-4"
                  onError={() => handleImageError(currentImageIndex)}
                  priority
                />
                
                {/* Enhanced zoom hint */}
                <div className="absolute top-6 right-6 bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <ZoomIn className="h-5 w-5" />
                </div>
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6 text-steel-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6 text-steel-700" />
                    </button>
                  </>
                )}
                
                {/* Enhanced image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} of {images.length}
                  </div>
                )}

                {/* Product badges */}
                <div className="absolute top-6 left-6 space-y-2">
                  {savingsAmount && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Save {formatPrice(savingsAmount.toString())}
                    </div>
                  )}
                  {selectedItem?.status === 'STK' && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      In Stock
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Thumbnail Images */}
              {images.length > 1 && (
                <div className="p-4 bg-steel-50">
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all transform hover:scale-105 ${
                          currentImageIndex === index 
                            ? 'border-primary-500 ring-2 ring-primary-200' 
                            : 'border-steel-200 hover:border-steel-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${selectedItem?.name || product.name} ${index + 1}`}
                          fill
                          className="object-contain p-1"
                          onError={() => handleImageError(index)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details - Enhanced */}
          <div className="space-y-6">
            {/* Sticky purchase card */}
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
              <div className="space-y-2">
                {selectedItem && (
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
                )}
              </div>

              {/* Stock Status */}
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

              {/* SKU */}
              <div className="text-sm text-steel-600">
                <span className="font-medium">SKU:</span> 
                <span className="font-mono ml-1">{selectedItem?.sku}</span>
              </div>

              {/* Item Selection - Enhanced */}
              {product.items && product.items.length > 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-steel-900">Available Options</h3>
                    <span className="text-sm text-steel-500 bg-steel-100 px-3 py-1 rounded-full">
                      {product.items.length} options
                    </span>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {getSortedItems().map((item) => (
                      <button
                        key={item.id}
                        onClick={() => updateSelectedItem(item)}
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
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-steel-900">Quantity:</label>
                  <div className="flex items-center border-2 border-steel-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 hover:bg-steel-50 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-6 py-3 border-x border-steel-200 font-semibold min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 hover:bg-steel-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

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
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-steel-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'specifications', label: 'Specifications', icon: Package },
                { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
                { id: 'reviews', label: 'Reviews', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-steel-600 hover:text-steel-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Product Description */}
                {product.description && (
                  <div>
                    <h3 className="text-xl font-bold text-steel-900 mb-4">Product Description</h3>
                    <div className="prose prose-steel max-w-none">
                      <p className="text-steel-700 leading-relaxed text-lg">{product.description}</p>
                    </div>
                  </div>
                )}

                {/* Key Features */}
                {selectedItem?.features && selectedItem.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-steel-900 mb-6">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedItem.features.map((feature, index) => (
                        <div key={index} className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-100">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-steel-900 mb-2">{feature.name}</h4>
                              {feature.description && (
                                <p className="text-steel-600 text-sm leading-relaxed">{feature.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Details Grid */}
                <div>
                  <h3 className="text-xl font-bold text-steel-900 mb-6">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-steel-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-steel-900 mb-4">General Information</h4>
                      <div className="space-y-3">
                        {selectedItem?.brand?.data && (
                          <div className="flex justify-between py-2 border-b border-steel-200">
                            <span className="text-steel-600">Brand:</span>
                            <span className="font-medium">{selectedItem.brand.data.name}</span>
                          </div>
                        )}
                        {selectedItem?.product_type && (
                          <div className="flex justify-between py-2 border-b border-steel-200">
                            <span className="text-steel-600">Category:</span>
                            <span className="font-medium">{selectedItem.product_type}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b border-steel-200">
                          <span className="text-steel-600">SKU:</span>
                          <span className="font-medium font-mono">{selectedItem?.sku}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-steel-600">Availability:</span>
                          <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-steel-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-steel-900 mb-4">Physical Specifications</h4>
                      <div className="space-y-3">
                        {selectedItem?.length && (
                          <div className="flex justify-between py-2 border-b border-steel-200">
                            <span className="text-steel-600">Length:</span>
                            <span className="font-medium">{selectedItem.length}"</span>
                          </div>
                        )}
                        {selectedItem?.width && (
                          <div className="flex justify-between py-2 border-b border-steel-200">
                            <span className="text-steel-600">Width:</span>
                            <span className="font-medium">{selectedItem.width}"</span>
                          </div>
                        )}
                        {selectedItem?.height && (
                          <div className="flex justify-between py-2 border-b border-steel-200">
                            <span className="text-steel-600">Height:</span>
                            <span className="font-medium">{selectedItem.height}"</span>
                          </div>
                        )}
                        {selectedItem?.weight && (
                          <div className="flex justify-between py-2">
                            <span className="text-steel-600">Weight:</span>
                            <span className="font-medium">{selectedItem.weight} lbs</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-steel-900">Technical Specifications</h3>
                  <div className="bg-steel-50 p-6 rounded-xl">
                    <div className="space-y-4">
                      {selectedItem?.supplier_product_id && (
                        <div className="flex justify-between py-3 border-b border-steel-200">
                          <span className="text-steel-600 font-medium">Manufacturer Part #:</span>
                          <span className="font-mono font-bold">{selectedItem.supplier_product_id}</span>
                        </div>
                      )}
                      {selectedItem?.upc && (
                        <div className="flex justify-between py-3 border-b border-steel-200">
                          <span className="text-steel-600 font-medium">UPC:</span>
                          <span className="font-mono">{selectedItem.upc}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 border-b border-steel-200">
                        <span className="text-steel-600 font-medium">Product ID:</span>
                        <span className="font-mono">{selectedItem?.id}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-steel-900">Dimensions & Weight</h3>
                  <div className="bg-steel-50 p-6 rounded-xl">
                    <div className="space-y-4">
                      {selectedItem?.length && (
                        <div className="flex justify-between py-3 border-b border-steel-200">
                          <span className="text-steel-600 font-medium">Length:</span>
                          <span className="font-bold">{selectedItem.length} inches</span>
                        </div>
                      )}
                      {selectedItem?.width && (
                        <div className="flex justify-between py-3 border-b border-steel-200">
                          <span className="text-steel-600 font-medium">Width:</span>
                          <span className="font-bold">{selectedItem.width} inches</span>
                        </div>
                      )}
                      {selectedItem?.height && (
                        <div className="flex justify-between py-3 border-b border-steel-200">
                          <span className="text-steel-600 font-medium">Height:</span>
                          <span className="font-bold">{selectedItem.height} inches</span>
                        </div>
                      )}
                      {selectedItem?.weight && (
                        <div className="flex justify-between py-3">
                          <span className="text-steel-600 font-medium">Weight:</span>
                          <span className="font-bold">{selectedItem.weight} lbs</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-primary-50 p-8 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-bold text-steel-900 mb-6 flex items-center">
                    <Truck className="h-6 w-6 text-blue-600 mr-3" />
                    Shipping Information
                  </h3>
                  <div className="space-y-4 text-steel-700">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Free shipping on orders over $99</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Most orders ship same day when ordered before 3 PM EST</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Expected delivery: 2-5 business days</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200">
                  <h3 className="text-xl font-bold text-steel-900 mb-6 flex items-center">
                    <RotateCcw className="h-6 w-6 text-green-600 mr-3" />
                    Return Policy
                  </h3>
                  <div className="space-y-4 text-steel-700">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Items must be in original condition</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Free return shipping on defective items</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <span>Restocking fee may apply to special orders</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Summary */}
                <div className="bg-steel-50 p-8 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-steel-900 mb-4">Customer Reviews</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-6 w-6 ${i < 4 ? 'fill-current' : 'fill-steel-200'}`} />
                          ))}
                        </div>
                        <span className="text-2xl font-bold text-steel-900">4.0</span>
                        <span className="text-steel-600">Based on 23 reviews</span>
                      </div>
                      <button className="btn btn-outline">Write a Review</button>
                    </div>
                    
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-steel-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-steel-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${rating === 4 ? 60 : rating === 5 ? 30 : rating === 3 ? 10 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-steel-600 w-8">
                            {rating === 4 ? '14' : rating === 5 ? '7' : rating === 3 ? '2' : '0'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: 'Mike Rodriguez',
                      rating: 5,
                      date: '2 weeks ago',
                      title: 'Excellent quality and fast shipping',
                      review: 'This part exceeded my expectations. Perfect fit and excellent build quality. Shipping was fast and packaging was secure.'
                    },
                    {
                      name: 'Sarah Chen',
                      rating: 4,
                      date: '1 month ago',
                      title: 'Good value for money',
                      review: 'Solid product at a competitive price. Installation was straightforward with the included instructions.'
                    }
                  ].map((review, index) => (
                    <div key={index} className="bg-white border border-steel-200 p-6 rounded-xl">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary-600">{review.name[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold text-steel-900">{review.name}</span>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'fill-steel-200'}`} />
                              ))}
                            </div>
                            <span className="text-steel-500 text-sm">{review.date}</span>
                          </div>
                          <h4 className="font-semibold text-steel-900 mb-2">{review.title}</h4>
                          <p className="text-steel-700">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Image Modal - Enhanced */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-6 right-6 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main modal image */}
            <div className="relative max-w-[90vw] max-h-[90vh] aspect-square">
              <Image
                src={images[currentImageIndex]}
                alt={selectedItem?.name || product.name}
                fill
                className="object-contain"
                onError={() => handleImageError(currentImageIndex)}
              />
            </div>

            {/* Navigation arrows for modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all hover:scale-110"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all hover:scale-110"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Image info and thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              {/* Image counter */}
              {images.length > 1 && (
                <div className="bg-black/50 text-white px-6 py-3 rounded-full text-lg font-medium mb-6">
                  {currentImageIndex + 1} of {images.length}
                </div>
              )}

              {/* Thumbnail navigation */}
              {images.length > 1 && (
                <div className="flex gap-3 justify-center max-w-md overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all hover:scale-110 ${
                        currentImageIndex === index ? 'border-white shadow-lg' : 'border-white/30'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${selectedItem?.name || product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(index)}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Keyboard hints */}
              <div className="text-white/70 text-sm mt-4">
                Use arrow keys to navigate • Press ESC to close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}