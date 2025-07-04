'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
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
  const { addItem } = useCartStore()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams?.id) return

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${resolvedParams.id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setProduct(data.data)
          if (data.data.items && data.data.items.length > 0) {
            setSelectedItem(data.data.items[0])
          }
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

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const getProductImages = () => {
    if (!selectedItem || !selectedItem.images || selectedItem.images.length === 0) {
      return ['/placeholder-product.svg']
    }
    return selectedItem.images.map(img => ImageUtils.buildImageUrl(img, '800_max'))
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem(selectedItem, quantity)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    const images = getProductImages()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getProductImages()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-steel-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-steel-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-steel-200 rounded animate-pulse" />
              <div className="h-6 bg-steel-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-steel-200 rounded w-1/2 animate-pulse" />
              <div className="h-12 bg-steel-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-steel-900 mb-4">Product Not Found</h1>
          <p className="text-steel-600 mb-6">{error || 'The requested product could not be found.'}</p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const images = getProductImages()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-steel-600 mb-8">
          <Link href="/" className="hover:text-steel-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-steel-900">Products</Link>
          <span>/</span>
          <span className="text-steel-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-steel-50 rounded-lg overflow-hidden">
              <Image
                src={images[currentImageIndex]}
                alt={selectedItem?.name || product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.svg'
                }}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-steel-50 rounded border-2 overflow-hidden transition-all ${
                      currentImageIndex === index ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${selectedItem?.name || product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.svg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name & Brand */}
            <div>
              {selectedItem?.brand && (
                <p className="text-sm text-steel-500 uppercase tracking-wide mb-2">
                  {selectedItem.brand.name}
                </p>
              )}
              <h1 className="text-3xl font-display font-bold text-steel-900 mb-2">
                {product.name}
              </h1>
              {selectedItem && selectedItem.name !== product.name && (
                <p className="text-lg text-steel-700">{selectedItem.name}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-steel-600">(23 reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {selectedItem && (
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(selectedItem.list_price)}
                  </span>
                  {selectedItem.mapp_price && parseFloat(selectedItem.mapp_price) > 0 && (
                    <span className="text-xl text-steel-400 line-through">
                      {formatPrice(selectedItem.mapp_price)}
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm text-steel-600">
                SKU: {selectedItem?.sku}
              </p>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="prose prose-steel max-w-none">
                <p className="text-steel-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Item Selection */}
            {product.items && product.items.length > 1 && (
              <div>
                <h3 className="text-sm font-medium text-steel-900 mb-3">Available Options:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item)
                        setCurrentImageIndex(0)
                      }}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        selectedItem?.id === item.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-steel-200 hover:border-steel-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-steel-900">{item.name}</p>
                          <p className="text-sm text-steel-600">SKU: {item.sku}</p>
                        </div>
                        <span className="font-bold text-primary-600">
                          {formatPrice(item.list_price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-steel-900">Quantity:</label>
                <div className="flex items-center border border-steel-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-steel-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-steel-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn btn-primary btn-lg"
                  disabled={!selectedItem}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button className="btn btn-secondary">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="btn btn-secondary">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-steel-200 pt-6">
              <div className="space-y-3 text-sm text-steel-600">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-primary-600" />
                  <span>Free shipping on orders over $99</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-primary-600" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features */}
        {selectedItem?.features && selectedItem.features.length > 0 && (
          <div className="mt-16 border-t border-steel-200 pt-16">
            <h2 className="text-2xl font-display font-bold text-steel-900 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedItem.features.map((feature, index) => (
                <div key={index} className="bg-steel-50 p-4 rounded-lg">
                  <h3 className="font-medium text-steel-900 mb-2">{feature.name}</h3>
                  {feature.description && (
                    <p className="text-sm text-steel-600">{feature.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}