'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Menu, X, User, Heart } from 'lucide-react'
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
      <div className="bg-accent-600 text-white text-center py-2 text-sm">
        <p>Free shipping on orders over $99 | Call us: 1-800-MOTO-PARTS</p>
      </div>

      {/* Main navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-display font-bold text-primary-600">
                  4Speed
                </span>
                <span className="text-2xl font-display font-bold text-steel-700 ml-1">
                  Motorcycle
                </span>
              </Link>
            </div>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 40k+ motorcycle parts & accessories..."
                    className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-steel-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1.5 bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop navigation links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="nav-link">
                Home
              </Link>
              
              <Link href="/products" className="nav-link font-semibold text-primary-600 hover:text-primary-700">
                All Products
              </Link>
              
              {/* Categories dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <button className="nav-link text-steel-500 hover:text-steel-600 flex items-center">
                  Categories
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCategories && (
                  <div 
                    className="absolute top-full left-0 w-64 bg-white border border-steel-200 rounded-md shadow-lg z-50"
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <div className="py-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="block px-4 py-3 text-sm text-steel-700 hover:bg-steel-50 hover:text-primary-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <div className="border-t border-steel-200 mt-2 pt-2">
                        <Link
                          href="/categories"
                          className="block px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          View All Categories →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/brands" className="nav-link text-steel-500 hover:text-steel-600">
                Brands
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              {/* Search button - mobile */}
              <button className="lg:hidden p-2 text-steel-600 hover:text-steel-900">
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <button className="hidden sm:block p-2 text-steel-600 hover:text-steel-900">
                <Heart className="h-5 w-5" />
              </button>

              {/* Account */}
              <button className="hidden sm:block p-2 text-steel-600 hover:text-steel-900">
                <User className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button 
                onClick={toggleCart}
                className="relative p-2 text-steel-600 hover:text-steel-900"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-steel-600 hover:text-steel-900"
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
                  className="w-full pl-10 pr-16 py-2 border border-steel-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-steel-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-steel-200">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-steel-700 hover:text-steel-900 hover:bg-steel-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <Link
                href="/products"
                className="block px-3 py-2 text-base font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>
              
              {/* Mobile categories */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-base font-medium text-steel-600">Categories</div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-6 py-2 text-sm text-steel-600 hover:text-steel-900 hover:bg-steel-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/brands"
                className="block px-3 py-2 text-base font-medium text-steel-600 hover:text-steel-700 hover:bg-steel-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Brands
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-steel-700 hover:text-steel-900 hover:bg-steel-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              
              <div className="border-t border-steel-200 pt-4 mt-4">
                <Link
                  href="/account"
                  className="block px-3 py-2 text-base font-medium text-steel-700 hover:text-steel-900 hover:bg-steel-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  className="block px-3 py-2 text-base font-medium text-steel-700 hover:text-steel-900 hover:bg-steel-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Wishlist
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}