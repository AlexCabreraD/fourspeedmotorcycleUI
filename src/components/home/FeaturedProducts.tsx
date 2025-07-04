'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { WPSItem, ImageUtils } from '@/lib/api/wps-client'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch some popular/featured products
        const response = await fetch('/api/products?page=12&sort=newest')
        const data = await response.json()
        
        if (data.success && data.data) {
          // Extract items from products - each product contains items
          const allItems: WPSItem[] = []
          data.data.forEach((product: any) => {
            if (product.items && product.items.data) {
              allItems.push(...product.items.data)
            }
          })
          setProducts(allItems.slice(0, 8)) // Show 8 featured items
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const getProductImage = (product: WPSItem) => {
    if (product.images && product.images.length > 0) {
      return ImageUtils.buildImageUrl(product.images[0], '500_max')
    }
    return '/placeholder-product.svg'
  }

  const handleAddToCart = (product: WPSItem) => {
    addItem(product, 1)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-steel-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-steel-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-steel-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-steel-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-steel-600 max-w-2xl mx-auto">
            Discover our most popular and highest-rated motorcycle parts and accessories.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-steel-200 rounded-lg overflow-hidden hover:shadow-card-hover transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-product bg-steel-50 overflow-hidden">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.svg'
                  }}
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <Link
                      href={`/product/${product.product_id}`}
                      className="btn btn-sm bg-white text-steel-900 hover:bg-steel-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-sm btn-primary"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Badge for special offers */}
                {product.status === 'sale' && (
                  <div className="absolute top-2 left-2 bg-accent-600 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Brand */}
                {product.brand && (
                  <p className="text-xs text-steel-500 uppercase tracking-wide mb-1">
                    {product.brand.name}
                  </p>
                )}

                {/* Product Name */}
                <h3 className="text-sm font-medium text-steel-900 mb-2 line-clamp-2 h-10">
                  <Link
                    href={`/product/${product.product_id}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                </h3>

                {/* Product Type */}
                {product.product_type && (
                  <p className="text-xs text-steel-500 mb-2">
                    {product.product_type}
                  </p>
                )}

                {/* Rating (mock for now) */}
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

                {/* Price and SKU */}
                <div className="flex items-center justify-between">
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
                <p className="text-xs text-steel-400 mt-1">
                  SKU: {product.sku}
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-3 btn btn-primary btn-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="btn btn-outline btn-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}