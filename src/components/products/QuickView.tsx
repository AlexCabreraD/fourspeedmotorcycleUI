'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingCart, Heart, Star, Package, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { WPSItem, ImageUtils, createWPSClient } from '@/lib/api/wps-client'
import { useCartStore } from '@/lib/store/cart'
import { useItemImage } from '@/hooks/useItemImages'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

interface QuickViewProps {
  isOpen: boolean
  onClose: () => void
  productId: number | null
}

export default function QuickView({ isOpen, onClose, productId }: QuickViewProps) {
  const [product, setProduct] = useState<WPSItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const { addItem } = useCartStore()
  const { imageUrl, loading: imageLoading, hasImages } = useItemImage(product, 'detail')

  // Fetch product data when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct(productId)
    }
  }, [isOpen, productId])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProduct(null)
      setError(null)
      setCurrentImageIndex(0)
      setQuantity(1)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const fetchProduct = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const client = createWPSClient({ enableCaching: true })
      const response = await client.getItem(id, { include: 'images,brand' })

      if (response.data) {
        setProduct(response.data)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product'
      setError(errorMessage)
      console.error('Error fetching product for QuickView:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      onClose()
    }
  }

  const getImageUrls = () => {
    if (product && hasImages) {
      return ImageUtils.getItemImageUrls(product, '1000_max')
    }
    return []
  }

  const imageUrls = getImageUrls()

  const nextImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length)
    }
  }

  const prevImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <X className="h-5 w-5 text-steel-600" />
          </button>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-steel-500 mb-2">
                  <Package className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-steel-600">{error}</p>
              </div>
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-steel-50 rounded-lg overflow-hidden">
                  {imageLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : hasImages && imageUrls.length > 0 ? (
                    <>
                      <img
                        src={imageUrls[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.svg'
                        }}
                      />
                      
                      {/* Image Navigation */}
                      {imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <ImagePlaceholder 
                      message="Image coming soon"
                      className="w-full h-full"
                    />
                  )}
                </div>

                {/* Thumbnail Images */}
                {imageUrls.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                          index === currentImageIndex 
                            ? 'border-primary-500' 
                            : 'border-steel-200 hover:border-steel-300'
                        }`}
                      >
                        <img
                          src={ImageUtils.buildImageUrl(ImageUtils.getAllImages(product)[index], '200_max')}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Brand */}
                {product.brand?.data && (
                  <div className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                    {product.brand.data.name}
                  </div>
                )}

                {/* Product Name */}
                <h1 className="text-2xl font-display font-bold text-steel-900">
                  {product.name}
                </h1>

                {/* Product Type & SKU */}
                <div className="flex items-center space-x-4 text-sm text-steel-500">
                  <span>Type: {product.product_type}</span>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-steel-500">(23 reviews)</span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatPrice(product.list_price)}
                    </span>
                    {product.mapp_price && parseFloat(product.mapp_price) > 0 && (
                      <span className="text-lg text-steel-400 line-through">
                        {formatPrice(product.mapp_price)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-steel-600">
                    Dealer Price: {formatPrice(product.standard_dealer_price)}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-steel-700">Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-steel-700">
                      {product.drop_ship_eligible ? 'Drop Ship Available' : 'Standard Shipping'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4 text-primary-600" />
                    <span className="text-steel-700">
                      Status: {product.status === 'STK' ? 'In Stock' : product.status}
                    </span>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-steel-700">Quantity:</label>
                    <div className="flex items-center border border-steel-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 hover:bg-steel-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-steel-300">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 hover:bg-steel-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 btn btn-primary flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <button className="btn btn-outline p-3">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="border-t border-steel-200 pt-6">
                  <h3 className="text-lg font-semibold text-steel-900 mb-3">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-steel-500">Length:</span>
                      <span className="ml-2 text-steel-900">{product.length}"</span>
                    </div>
                    <div>
                      <span className="text-steel-500">Width:</span>
                      <span className="ml-2 text-steel-900">{product.width}"</span>
                    </div>
                    <div>
                      <span className="text-steel-500">Height:</span>
                      <span className="ml-2 text-steel-900">{product.height}"</span>
                    </div>
                    <div>
                      <span className="text-steel-500">Weight:</span>
                      <span className="ml-2 text-steel-900">{product.weight} lbs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}