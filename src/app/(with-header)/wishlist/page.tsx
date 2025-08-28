'use client'

import { Calendar, Grid3X3, Heart, List, Search, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'

// Mock wishlist data - replace with real API call
const mockWishlistItems = [
  {
    id: '1',
    name: 'Akrapovič Racing Exhaust System',
    brand: 'Akrapovič',
    sku: 'AK-S-Y10SO8-HAPXSS',
    price: 1249.99,
    originalPrice: 1399.99,
    image: '/api/placeholder/300/300',
    inStock: true,
    rating: 4.8,
    reviews: 127,
    category: 'Exhaust Systems',
    addedDate: '2024-01-15',
    sale: true,
    discount: 11,
  },
  {
    id: '2',
    name: 'Öhlins Front Fork Kit TTX36',
    brand: 'Öhlins',
    sku: 'OH-FGK036',
    price: 2899.0,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    inStock: true,
    rating: 4.9,
    reviews: 89,
    category: 'Suspension',
    addedDate: '2024-01-12',
    sale: false,
    discount: 0,
  },
  {
    id: '3',
    name: 'Brembo GP4-RX Brake Calipers',
    brand: 'Brembo',
    sku: 'BR-20A88810',
    price: 1899.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    inStock: false,
    rating: 4.7,
    reviews: 203,
    category: 'Brakes',
    addedDate: '2024-01-10',
    sale: false,
    discount: 0,
  },
  {
    id: '4',
    name: 'Pirelli Diablo Supercorsa V4',
    brand: 'Pirelli',
    sku: 'PI-2874100',
    price: 449.99,
    originalPrice: 499.99,
    image: '/api/placeholder/300/300',
    inStock: true,
    rating: 4.6,
    reviews: 342,
    category: 'Tires',
    addedDate: '2024-01-08',
    sale: true,
    discount: 10,
  },
  {
    id: '5',
    name: 'Rizoma Mirror Stealth',
    brand: 'Rizoma',
    sku: 'RZ-BS180B',
    price: 189.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    inStock: true,
    rating: 4.5,
    reviews: 156,
    category: 'Mirrors',
    addedDate: '2024-01-05',
    sale: false,
    discount: 0,
  },
  {
    id: '6',
    name: 'K&N Performance Air Filter',
    brand: 'K&N',
    sku: 'KN-HA6003',
    price: 89.99,
    originalPrice: null,
    image: '/api/placeholder/300/300',
    inStock: true,
    rating: 4.4,
    reviews: 89,
    category: 'Air Filters',
    addedDate: '2024-01-03',
    sale: false,
    discount: 0,
  },
]

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date_added')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const {
    items: wishlistItems,
    removeItem,
    removeItems: removeItemsFromStore,
    clearWishlist,
  } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  // Check if user has any wishlist items
  const hasWishlistItems = wishlistItems.length > 0

  const filteredItems = wishlistItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price_high':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'brand':
        return (a.brand || '').localeCompare(b.brand || '')
      case 'date_added':
      default:
        // Sort by addedDate if available, otherwise by ID
        if (a.addedDate && b.addedDate) {
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        }
        return b.id.localeCompare(a.id)
    }
  })

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const removeItems = (itemIds: string[]) => {
    removeItemsFromStore(itemIds)
    setSelectedItems([])
  }

  const handleAddToCart = (itemId: string) => {
    const wishlistItem = wishlistItems.find((item) => item.id === itemId)
    if (wishlistItem) {
      // Convert wishlist item to cart item
      const cartItem = {
        id: parseInt(wishlistItem.id),
        name: wishlistItem.name,
        sku: wishlistItem.sku || '',
        list_price: wishlistItem.price,
        standard_dealer_price: wishlistItem.price,
        brand: { name: wishlistItem.brand || '' },
      }
      addToCart(cartItem as any, 1)
    }
  }

  const handleRemoveSingle = (itemId: string) => {
    removeItem(itemId)
  }

  if (!hasWishlistItems) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='bg-white border-b border-steel-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-3xl font-bold text-steel-900'>My Wishlist</h1>
            <p className='mt-2 text-steel-600'>Save your favorite motorcycle parts for later</p>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <div className='text-steel-400 mb-6'>
              <Heart className='h-20 w-20 mx-auto mb-4' />
            </div>

            <h2 className='text-2xl font-semibold text-steel-900 mb-4'>Your wishlist is empty</h2>
            <p className='text-steel-600 mb-8 max-w-md mx-auto'>
              Start building your dream bike setup! Save parts you love by clicking the heart icon
              on any product.
            </p>

            <Link
              href='/products'
              className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors shadow-sm'
            >
              <Search className='h-5 w-5 mr-2' />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <div className='bg-white border-b border-steel-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-steel-900'>My Wishlist</h1>
              <p className='mt-2 text-steel-600'>Save your favorite motorcycle parts for later</p>
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-primary-600'>{wishlistItems.length}</p>
              <p className='text-sm text-steel-500'>Saved Items</p>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Controls */}
        <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-6 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
            <div className='flex flex-col sm:flex-row gap-4 flex-1'>
              {/* Search */}
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-3 h-5 w-5 text-steel-400' />
                  <input
                    type='text'
                    placeholder='Search your wishlist...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  />
                </div>
              </div>

              {/* Sort */}
              <div className='sm:w-48'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                >
                  <option value='date_added'>Recently Added</option>
                  <option value='name'>Name A-Z</option>
                  <option value='brand'>Brand</option>
                  <option value='price_low'>Price: Low to High</option>
                  <option value='price_high'>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* View Toggle & Actions */}
            <div className='flex items-center gap-4'>
              {selectedItems.length > 0 && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-steel-600'>{selectedItems.length} selected</span>
                  <button
                    onClick={() => removeItems(selectedItems)}
                    className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                  >
                    <Trash2 className='h-4 w-4 mr-1' />
                    Remove
                  </button>
                </div>
              )}

              <div className='flex border border-steel-300 rounded-lg overflow-hidden'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-accent-600 text-white'
                      : 'bg-white text-steel-600 hover:bg-steel-50'
                  }`}
                >
                  <Grid3X3 className='h-5 w-5' />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-accent-600 text-white'
                      : 'bg-white text-steel-600 hover:bg-steel-50'
                  }`}
                >
                  <List className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {viewMode === 'grid' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className='bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden group hover:shadow-md transition-shadow'
              >
                <div className='relative'>
                  <img src={item.image} alt={item.name} className='w-full h-48 object-cover' />

                  {/* Note: Stock status and sale info not available in current wishlist data */}

                  {/* Actions */}
                  <div className='absolute top-2 right-2'>
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedItems.includes(item.id)
                          ? 'bg-accent-600 border-accent-600 text-white'
                          : 'bg-white/90 border-steel-300 text-steel-600 hover:bg-white hover:border-accent-600'
                      }`}
                    >
                      {selectedItems.includes(item.id) && (
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Date Added */}
                  {item.addedDate && (
                    <div className='absolute bottom-2 left-2'>
                      <span className='bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center'>
                        <Calendar className='h-3 w-3 mr-1' />
                        {formatDate(item.addedDate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <div className='mb-2'>
                    <p className='text-xs text-steel-500 font-medium uppercase tracking-wide'>
                      {item.brand}
                    </p>
                    <h3 className='text-sm font-semibold text-steel-900 line-clamp-2 group-hover:text-primary-600 transition-colors'>
                      {item.name}
                    </h3>
                  </div>

                  <div className='mb-2 space-y-1'>
                    {item.sku && (
                      <div>
                        <span className='text-xs text-steel-500'>SKU: {item.sku}</span>
                      </div>
                    )}
                    {item.productType && (
                      <div>
                        <span className='text-xs text-steel-400'>{item.productType}</span>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg font-bold text-steel-900'>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex gap-2'>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className='flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors'
                    >
                      <ShoppingCart className='h-4 w-4 mr-1' />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveSingle(item.id)}
                      className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className='bg-white rounded-lg shadow-sm border border-steel-200 p-6 hover:shadow-md transition-shadow'
              >
                <div className='flex items-center gap-6'>
                  <div className='flex items-center gap-4'>
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedItems.includes(item.id)
                          ? 'bg-accent-600 border-accent-600 text-white'
                          : 'border-steel-300 text-steel-600 hover:border-accent-600'
                      }`}
                    >
                      {selectedItems.includes(item.id) && (
                        <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      )}
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-20 h-20 object-cover rounded-lg'
                    />
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <p className='text-xs text-steel-500 font-medium uppercase tracking-wide'>
                          {item.brand}
                        </p>
                        <h3 className='text-lg font-semibold text-steel-900 hover:text-primary-600 transition-colors cursor-pointer'>
                          {item.name}
                        </h3>
                        <div className='mt-1 space-y-1'>
                          {item.sku && <p className='text-sm text-steel-500'>SKU: {item.sku}</p>}
                          {item.productType && (
                            <p className='text-sm text-steel-400'>{item.productType}</p>
                          )}
                          {item.addedDate && (
                            <p className='text-sm text-steel-400'>
                              Added {formatDate(item.addedDate)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='text-right'>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-xl font-bold text-steel-900'>
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className='inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-accent-600 hover:bg-accent-700 transition-colors'
                          >
                            <ShoppingCart className='h-4 w-4 mr-1' />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveSingle(item.id)}
                            className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className='bg-white rounded-lg shadow-sm border border-steel-200 p-12 text-center'>
            <Search className='h-16 w-16 text-steel-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-steel-900 mb-2'>No items found</h3>
            <p className='text-steel-600'>
              Try adjusting your search terms or browse our products.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
