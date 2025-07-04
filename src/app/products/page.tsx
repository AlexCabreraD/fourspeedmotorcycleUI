'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Grid, List, Search, SlidersHorizontal, Package } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { WPSItem, ImageUtils } from '@/lib/api/wps-client'

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name A-Z' },
  { value: 'name_desc', label: 'Name Z-A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<WPSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name_asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', '20')
        params.set('sort', sortBy)
        if (searchTerm) params.set('search', searchTerm)

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()

        if (data.success && data.data) {
          // Extract items from products
          const allItems: WPSItem[] = []
          data.data.forEach((product: any) => {
            if (product.items && product.items.data) {
              allItems.push(...product.items.data)
            }
          })
          setProducts(allItems)
          setTotalCount(allItems.length)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [sortBy, searchTerm])

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const getProductImage = (product: WPSItem) => {
    if (product.images && product.images.length > 0) {
      return ImageUtils.buildImageUrl(product.images[0], '400_max')
    }
    return '/placeholder-product.svg'
  }

  const handleAddToCart = (product: WPSItem) => {
    addItem(product, 1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger search with current searchTerm
    const currentSearch = searchTerm
    setSearchTerm(currentSearch)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-steel-200 rounded w-64 mb-6" />
            <div className="h-12 bg-steel-200 rounded w-96 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-80 bg-steel-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-steel-900 mb-4">
            All Products
          </h1>
          <p className="text-xl text-steel-600 mb-8">
            Browse our complete selection of motorcycle parts and accessories.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
            </form>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input min-w-[200px]"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-steel-600 hover:text-steel-900'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-steel-600">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <div
                key={product.id}
                className={`group bg-white border border-steel-200 rounded-lg overflow-hidden hover:shadow-card-hover transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative bg-steel-50 overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.svg'
                    }}
                  />
                  <Link
                    href={`/product/${product.product_id}`}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Brand */}
                  {product.brand && (
                    <p className="text-xs text-steel-500 uppercase tracking-wide mb-1">
                      {product.brand.name}
                    </p>
                  )}

                  {/* Product Name */}
                  <h3 className={`font-medium text-steel-900 mb-2 ${
                    viewMode === 'list' ? 'text-lg' : 'text-sm line-clamp-2 h-10'
                  }`}>
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

                  {/* Price and SKU */}
                  <div className={`flex items-center justify-between mb-3 ${
                    viewMode === 'list' ? 'flex-col items-start' : ''
                  }`}>
                    <div>
                      <span className={`font-bold text-primary-600 ${
                        viewMode === 'list' ? 'text-xl' : 'text-lg'
                      }`}>
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
                    onClick={() => handleAddToCart(product)}
                    className={`btn btn-primary ${
                      viewMode === 'list' ? 'btn-lg' : 'btn-sm w-full'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-steel-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-steel-900 mb-2">
              No products found
            </h3>
            <p className="text-steel-600 mb-6">
              Try adjusting your search terms or browse our categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-outline"
              >
                Clear Search
              </button>
              <Link href="/categories" className="btn btn-primary">
                Browse Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}