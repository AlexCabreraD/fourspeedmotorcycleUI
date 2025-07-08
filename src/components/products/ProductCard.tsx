'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { WPSItem, ImageUtils } from '@/lib/api/wps-client'
import { useItemImage } from '@/hooks/useItemImages'
import QuickView from './QuickView'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

interface ProductCardProps {
  product: WPSItem
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { imageUrl, loading: imageLoading, hasImages } = useItemImage(product, 'card')
  const [showQuickView, setShowQuickView] = useState(false)

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id)
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/product/${product.product_id}`} className="block">
        <div className="bg-white border border-steel-200 rounded-lg overflow-hidden hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
          <div className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 bg-steel-50 flex-shrink-0">
            {imageLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-steel-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : hasImages ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.svg'
                }}
              />
            ) : (
              <ImagePlaceholder 
                message="Image coming soon"
                className="w-full h-full"
              />
            )}
            
            {/* Status Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.status === 'sale' && (
                <div className="bg-accent-600 text-white text-xs font-bold px-2 py-1 rounded">
                  SALE
                </div>
              )}
              {!hasImages && !imageLoading && (
                <div className="bg-steel-500 text-white text-xs px-2 py-1 rounded">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Brand */}
              {product.brand?.data && (
                <p className="text-sm text-steel-500 uppercase tracking-wide mb-1">
                  {product.brand.data.name}
                </p>
              )}

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-steel-900 mb-2 hover:text-primary-600 transition-colors">
                {product.name}
              </h3>

              {/* Product Type & SKU */}
              <div className="flex items-center text-sm text-steel-500 mb-3 space-x-4">
                {product.product_type && (
                  <span>{product.product_type}</span>
                )}
                <span>SKU: {product.sku}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-steel-500 ml-2">(23 reviews)</span>
              </div>

              {/* Description snippet */}
              <p className="text-steel-600 text-sm line-clamp-2 mb-4">
                High-quality {product.product_type?.toLowerCase()} designed for performance and durability.
              </p>
            </div>

            <div className="flex items-center justify-between">
              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(product.list_price)}
                </span>
                {product.mapp_price && parseFloat(product.mapp_price) > 0 && (
                  <span className="text-sm text-steel-400 line-through">
                    {formatPrice(product.mapp_price)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWishlist}
                  className="btn btn-sm btn-outline p-2"
                  title="Add to Wishlist"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  onClick={handleQuickView}
                  className="btn btn-sm btn-outline p-2"
                  title="Quick View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-sm btn-primary flex items-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view (default)
  return (
    <Link href={`/product/${product.product_id}`} className="block">
      <div className="bg-white border border-steel-200 rounded-lg overflow-hidden hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-product bg-steel-50 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-steel-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : hasImages ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.svg'
            }}
          />
        ) : (
          <ImagePlaceholder 
            message="Image coming soon"
            className="w-full h-full"
          />
        )}
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={handleQuickView}
              className="btn btn-sm bg-white text-steel-900 hover:bg-steel-100 p-2"
              title="Quick View"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleWishlist}
              className="btn btn-sm bg-white text-steel-900 hover:bg-steel-100 p-2"
              title="Add to Wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="btn btn-sm btn-primary p-2"
              title="Add to Cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.status === 'sale' && (
            <div className="bg-accent-600 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </div>
          )}
          {!hasImages && !imageLoading && (
            <div className="bg-steel-500 text-white text-xs px-2 py-1 rounded">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand?.data && (
          <p className="text-xs text-steel-500 uppercase tracking-wide mb-1">
            {product.brand.data.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-medium text-steel-900 mb-2 line-clamp-2 h-10 hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Product Type */}
        {product.product_type && (
          <p className="text-xs text-steel-500 mb-2">
            {product.product_type}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-steel-500 ml-1">(23)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.list_price)}
            </span>
            {product.mapp_price && parseFloat(product.mapp_price) > 0 && (
              <span className="text-sm text-steel-400 line-through ml-2">
                {formatPrice(product.mapp_price)}
              </span>
            )}
          </div>
        </div>

        {/* SKU */}
        <p className="text-xs text-steel-400 mb-3">
          SKU: {product.sku}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn btn-primary btn-sm"
        >
          Add to Cart
        </button>
      </div>

        {/* Quick View Modal */}
        <QuickView 
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          productId={product.product_id}
        />
      </div>
    </Link>
  )
}