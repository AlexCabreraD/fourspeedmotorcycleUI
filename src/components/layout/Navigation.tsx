'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

interface CategoryNode {
  id: number
  name: string
  slug: string
  children?: CategoryNode[]
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [showCategories, setShowCategories] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const router = useRouter()
  const { totalItems, toggleCart } = useCartStore()

  // Fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?level=main')
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleCategoryMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setShowCategories(true)
  }

  const handleCategoryMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowCategories(false)
    }, 150) // Small delay to allow moving to dropdown
    setHoverTimeout(timeout)
  }

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white text-center py-2.5 text-sm font-medium">
        <p>Free shipping on orders over $99 | Call us: 1-800-MOTO-PARTS</p>
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b border-steel-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-display font-bold text-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/25">
                  4Speed
                </div>
                <span className="text-xl font-display font-bold text-steel-700 ml-2">
                  Motorcycle
                </span>
              </Link>
            </div>

            {/* Search bar - desktop */}
            <div className="hidden md:flex w-80 mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-3 bg-steel-50 border border-steel-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 text-sm placeholder-steel-400"
                  />
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-steel-400 group-focus-within:text-primary-500 transition-colors" />
                  {searchQuery && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 bg-primary-600 text-white px-4 py-2 rounded-full text-sm hover:bg-primary-700 transition-colors font-medium"
                    >
                      Search
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Desktop navigation links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="nav-link font-medium text-steel-700 hover:text-primary-600 transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              
              <Link href="/products" className="nav-link font-semibold text-primary-600 hover:text-primary-700 transition-colors relative group">
                All Products
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600"></span>
              </Link>
              
              {/* Categories dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <button className="nav-link font-medium text-steel-700 hover:text-primary-600 flex items-center transition-colors group">
                  Categories
                  <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
                </button>
                
                {showCategories && (
                  <div 
                    className="absolute top-full left-0 w-72 bg-white border border-steel-200 rounded-xl shadow-xl z-50 mt-2 overflow-hidden"
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <div className="py-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="block px-4 py-3 text-sm text-steel-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <div className="border-t border-steel-200 mt-2 pt-2">
                        <Link
                          href="/categories"
                          className="block px-4 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          View All Categories →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {/* Search button - mobile */}
              <button className="lg:hidden p-3 text-steel-600 hover:text-steel-900 hover:bg-steel-50 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Account */}
              <button className="hidden sm:block p-3 text-steel-600 hover:text-steel-900 hover:bg-steel-50 rounded-lg transition-colors">
                <User className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button 
                onClick={toggleCart}
                className="relative p-3 text-steel-600 hover:text-steel-900 hover:bg-steel-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-3 text-steel-600 hover:text-steel-900 hover:bg-steel-50 rounded-lg transition-colors"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden px-4 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 40k+ motorcycle parts & accessories..."
                  className="w-full pl-12 pr-16 py-3 bg-steel-50 border border-steel-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 text-sm placeholder-steel-400"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-steel-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-primary-600 text-white px-4 py-2 rounded-full text-sm hover:bg-primary-700 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-steel-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link
                href="/"
                className="block px-4 py-3 text-base font-medium text-steel-700 hover:text-steel-900 hover:bg-steel-50 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <Link
                href="/products"
                className="block px-4 py-3 text-base font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>
              
              {/* Mobile categories */}
              <div className="space-y-2">
                <div className="px-4 py-2 text-base font-semibold text-steel-600">Categories</div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-6 py-2 text-sm text-steel-600 hover:text-steel-900 hover:bg-steel-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-steel-200 pt-4 mt-4">
                <Link
                  href="/account"
                  className="block px-4 py-3 text-base font-medium text-steel-700 hover:text-steel-900 hover:bg-steel-50 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}