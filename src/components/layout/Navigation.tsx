'use client'

import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs'
import { Heart, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useCartStore } from '@/lib/store/cart'
import { useWishlistStore } from '@/lib/store/wishlist'

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
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { toggleCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()
  const wishlistItems = useWishlistStore((state) => state.items)
  const { user } = useUser()
  const { signOut } = useClerk()

  // Check if we're on homepage or categories page to enable transparent navbar
  const isHomePage = pathname === '/'
  const isCategoriesPage = pathname === '/categories'

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

  // Handle scroll for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50) // Show background after 50px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
      {/* Main navigation */}
      <nav
        className={`border-b sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          isHomePage
            ? isScrolled
              ? 'bg-white/95 border-steel-200'
              : 'bg-transparent border-transparent'
            : isCategoriesPage
              ? 'bg-transparent border-transparent'
              : 'bg-white border-steel-200'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-18'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link href='/' className='flex items-center group'>
                <img
                  src='/assets/4speedMotorcylceLogo.svg'
                  alt='4Speed Motorcycle'
                  className={`h-12 w-auto transition-all duration-300 group-hover:scale-105 ${
                    (isHomePage && !isScrolled) || isCategoriesPage ? 'drop-shadow-lg' : ''
                  }`}
                  style={
                    (isHomePage && !isScrolled) || isCategoriesPage
                      ? { filter: 'brightness(0) invert(1)' }
                      : {}
                  }
                />
              </Link>
            </div>

            {/* Search bar - desktop */}
            <div className='hidden md:flex w-80 mx-8'>
              <form onSubmit={handleSearch} className='w-full'>
                <div className='relative group'>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search...'
                    className='w-full pl-12 pr-4 py-3 bg-steel-50 border border-steel-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 text-sm placeholder-steel-400'
                  />
                  <Search className='absolute left-4 top-3.5 h-5 w-5 text-steel-400 group-focus-within:text-primary-500 transition-colors' />
                  {searchQuery && (
                    <button
                      type='submit'
                      className='absolute right-2 top-1.5 bg-accent-600 text-white px-4 py-2 rounded-full text-sm hover:bg-accent-700 transition-colors font-medium'
                    >
                      Search
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Desktop navigation links */}
            <div className='hidden lg:flex items-center space-x-8'>
              <Link
                href='/'
                className={`nav-link font-medium transition-colors relative group ${
                  pathname === '/'
                    ? isHomePage
                      ? isScrolled
                        ? 'text-primary-600 hover:text-primary-700'
                        : 'text-white hover:text-primary-300 drop-shadow-md'
                      : 'text-primary-600 hover:text-primary-700'
                    : isHomePage
                      ? isScrolled
                        ? 'text-steel-700 hover:text-primary-600'
                        : 'text-white hover:text-primary-300 drop-shadow-md'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 drop-shadow-md'
                        : 'text-steel-700 hover:text-primary-600'
                }`}
              >
                Home
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-200 ${
                    pathname === '/'
                      ? `w-full ${
                          isHomePage
                            ? isScrolled
                              ? 'bg-primary-600'
                              : 'bg-white'
                            : 'bg-primary-600'
                        }`
                      : `w-0 group-hover:w-full ${
                          isHomePage
                            ? isScrolled
                              ? 'bg-primary-600'
                              : 'bg-white'
                            : isCategoriesPage
                              ? 'bg-white'
                              : 'bg-primary-600'
                        }`
                  }`}
                ></span>
              </Link>

              <Link
                href='/products'
                className={`nav-link font-medium transition-colors relative group ${
                  pathname === '/products'
                    ? isHomePage
                      ? isScrolled
                        ? 'text-primary-600 hover:text-primary-700 font-semibold'
                        : 'text-white hover:text-primary-300 drop-shadow-md font-semibold'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 drop-shadow-md font-semibold'
                        : 'text-primary-600 hover:text-primary-700 font-semibold'
                    : isHomePage
                      ? isScrolled
                        ? 'text-steel-700 hover:text-primary-600'
                        : 'text-white hover:text-primary-300 drop-shadow-md'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 drop-shadow-md'
                        : 'text-steel-700 hover:text-primary-600'
                }`}
              >
                All Products
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-200 ${
                    pathname === '/products'
                      ? `w-full ${
                          isHomePage
                            ? isScrolled
                              ? 'bg-primary-600'
                              : 'bg-white'
                            : isCategoriesPage
                              ? 'bg-white'
                              : 'bg-primary-600'
                        }`
                      : `w-0 group-hover:w-full ${
                          isHomePage
                            ? isScrolled
                              ? 'bg-primary-600'
                              : 'bg-white'
                            : isCategoriesPage
                              ? 'bg-white'
                              : 'bg-primary-600'
                        }`
                  }`}
                ></span>
              </Link>

              <Link
                href='/contact'
                className={`nav-link font-medium transition-colors relative group ${
                  pathname === '/contact'
                    ? isHomePage
                      ? isScrolled
                        ? 'text-primary-600 hover:text-primary-700'
                        : 'text-white hover:text-primary-300 drop-shadow-md'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 drop-shadow-md'
                        : 'text-primary-600 hover:text-primary-700'
                    : isHomePage
                      ? isScrolled
                        ? 'text-steel-700 hover:text-primary-600'
                        : 'text-white hover:text-primary-300 drop-shadow-md'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 drop-shadow-md'
                        : 'text-steel-700 hover:text-primary-600'
                }`}
              >
                Contact
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-200 ${
                    pathname === '/contact'
                      ? `w-full ${
                          isHomePage
                            ? isScrolled
                              ? 'bg-primary-600'
                              : 'bg-white'
                            : isCategoriesPage
                              ? 'bg-white'
                              : 'bg-primary-600'
                        }`
                      : `w-0 group-hover:w-full ${
                          isHomePage
                            ? isScrolled
                              ? 'bg-primary-600'
                              : 'bg-white'
                            : isCategoriesPage
                              ? 'bg-white'
                              : 'bg-primary-600'
                        }`
                  }`}
                ></span>
              </Link>

              {/* Categories dropdown */}
              <div
                className='relative'
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <div className='flex items-center'>
                  <Link
                    href='/categories'
                    className={`nav-link font-medium transition-colors relative group ${
                      pathname === '/categories'
                        ? isHomePage
                          ? isScrolled
                            ? 'text-primary-600 hover:text-primary-700'
                            : 'text-white hover:text-primary-300 drop-shadow-md'
                          : isCategoriesPage
                            ? 'text-white hover:text-primary-300 drop-shadow-md'
                            : 'text-primary-600 hover:text-primary-700'
                        : isHomePage
                          ? isScrolled
                            ? 'text-steel-700 hover:text-primary-600'
                            : 'text-white hover:text-primary-300 drop-shadow-md'
                          : isCategoriesPage
                            ? 'text-white hover:text-primary-300 drop-shadow-md'
                            : 'text-steel-700 hover:text-primary-600'
                    }`}
                  >
                    Categories
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-200 ${
                        pathname === '/categories'
                          ? `w-full ${
                              isHomePage
                                ? isScrolled
                                  ? 'bg-primary-600'
                                  : 'bg-white'
                                : isCategoriesPage
                                  ? 'bg-white'
                                  : 'bg-primary-600'
                            }`
                          : `w-0 group-hover:w-full ${
                              isHomePage
                                ? isScrolled
                                  ? 'bg-primary-600'
                                  : 'bg-white'
                                : isCategoriesPage
                                  ? 'bg-white'
                                  : 'bg-primary-600'
                            }`
                      }`}
                    ></span>
                  </Link>
                  <button
                    className={`ml-1 p-1 transition-colors group ${
                      isHomePage
                        ? isScrolled
                          ? 'text-steel-700 hover:text-primary-600'
                          : 'text-white hover:text-primary-300 drop-shadow-md'
                        : isCategoriesPage
                          ? 'text-white hover:text-primary-300 drop-shadow-md'
                          : 'text-steel-700 hover:text-primary-600'
                    }`}
                  >
                    <svg
                      className='h-4 w-4 transition-transform group-hover:rotate-180'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>
                </div>

                {showCategories && (
                  <div
                    className='absolute top-full left-0 w-72 bg-white border border-steel-200 rounded-xl shadow-xl z-50 mt-2 overflow-hidden'
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <div className='py-2'>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className='block px-4 py-3 text-sm text-steel-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium'
                        >
                          {category.name}
                        </Link>
                      ))}
                      <div className='border-t border-steel-200 mt-2 pt-2'>
                        <Link
                          href='/categories'
                          className='block px-4 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors'
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
            <div className='flex items-center space-x-2'>
              {/* Search button - mobile */}
              <button
                className={`lg:hidden p-3 rounded-lg transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                      : 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                    : isCategoriesPage
                      ? 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                      : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                }`}
              >
                <Search className='h-5 w-5' />
              </button>

              {/* Account */}
              <SignedIn>
                <div className='relative'>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`hidden sm:flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                      isHomePage
                        ? isScrolled
                          ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                          : 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                        : isCategoriesPage
                          ? 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                          : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                    }`}
                  >
                    <User className='h-5 w-5' />
                    <span className='text-sm font-medium'>{user?.firstName || 'Account'}</span>
                  </button>

                  {showUserMenu && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-steel-200 z-50'>
                      <Link
                        href='/profile'
                        className='block px-4 py-2 text-sm text-steel-700 hover:bg-steel-50 rounded-t-lg'
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href='/orders'
                        className='block px-4 py-2 text-sm text-steel-700 hover:bg-steel-50'
                        onClick={() => setShowUserMenu(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className='w-full text-left px-4 py-2 text-sm text-steel-700 hover:bg-steel-50 rounded-b-lg flex items-center'
                      >
                        <LogOut className='h-4 w-4 mr-2' />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </SignedIn>

              <SignedOut>
                <Link
                  href='/sign-in'
                  className={`hidden sm:block p-3 rounded-lg transition-colors ${
                    isHomePage
                      ? isScrolled
                        ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                        : 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                        : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                  }`}
                >
                  <User className='h-5 w-5' />
                </Link>
              </SignedOut>

              {/* Wishlist */}
              <Link
                href='/wishlist'
                className={`relative p-3 rounded-lg transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                      : 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                    : isCategoriesPage
                      ? 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                      : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                }`}
              >
                <Heart className='h-5 w-5' />
                {wishlistItems.length > 0 && (
                  <span className='absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg'>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className={`relative p-3 rounded-lg transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                      : 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                    : isCategoriesPage
                      ? 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                      : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                }`}
              >
                <ShoppingCart className='h-5 w-5' />
                {totalItems > 0 && (
                  <span className='absolute -top-1 -right-1 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg'>
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-3 rounded-lg transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                      : 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                    : isCategoriesPage
                      ? 'text-white hover:text-primary-300 hover:bg-white/10 drop-shadow-md'
                      : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                }`}
              >
                {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className='md:hidden px-4 pb-4'>
            <form onSubmit={handleSearch}>
              <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search...'
                  className='w-full pl-12 pr-16 py-3 bg-steel-50 border border-steel-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 text-sm placeholder-steel-400'
                />
                <Search className='absolute left-4 top-3.5 h-5 w-5 text-steel-400' />
                <button
                  type='submit'
                  className='absolute right-2 top-1.5 bg-accent-600 text-white px-4 py-2 rounded-full text-sm hover:bg-accent-700 transition-colors font-medium'
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className={`lg:hidden border-t transition-all duration-300 ${
              isHomePage
                ? isScrolled
                  ? 'border-steel-200 bg-white'
                  : 'border-white/20 bg-black/80 backdrop-blur-md'
                : isCategoriesPage
                  ? 'border-white/20 bg-black/80 backdrop-blur-md'
                  : 'border-steel-200 bg-white'
            }`}
          >
            <div className='px-4 pt-4 pb-6 space-y-2'>
              <Link
                href='/'
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                      : 'text-white hover:text-primary-300 hover:bg-white/10'
                    : isCategoriesPage
                      ? 'text-white hover:text-primary-300 hover:bg-white/10'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 hover:bg-white/10'
                        : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              <Link
                href='/products'
                className={`block px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                      : 'text-primary-300 hover:text-white hover:bg-white/10'
                    : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>

              <Link
                href='/contact'
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isHomePage
                    ? isScrolled
                      ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                      : 'text-white hover:text-primary-300 hover:bg-white/10'
                    : isCategoriesPage
                      ? 'text-white hover:text-primary-300 hover:bg-white/10'
                      : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile categories */}
              <div className='space-y-2'>
                <Link
                  href='/categories'
                  className={`block px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                    isHomePage
                      ? isScrolled
                        ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                        : 'text-white hover:text-primary-300 hover:bg-white/10'
                      : isCategoriesPage
                        ? 'text-white hover:text-primary-300 hover:bg-white/10'
                        : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className={`block px-6 py-2 text-sm rounded-lg transition-colors ${
                      isHomePage
                        ? isScrolled
                          ? 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div
                className={`border-t pt-4 mt-4 ${
                  isHomePage
                    ? isScrolled
                      ? 'border-steel-200'
                      : 'border-white/20'
                    : isCategoriesPage
                      ? 'border-white/20'
                      : 'border-steel-200'
                }`}
              >
                <SignedIn>
                  <div className='space-y-2'>
                    <div
                      className={`px-4 py-2 text-sm font-medium ${
                        isHomePage
                          ? isScrolled
                            ? 'text-steel-500'
                            : 'text-white/70'
                          : isCategoriesPage
                            ? 'text-white/70'
                            : 'text-steel-500'
                      }`}
                    >
                      Hello, {user?.firstName || 'User'}!
                    </div>
                    <Link
                      href='/profile'
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        isHomePage
                          ? isScrolled
                            ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                            : 'text-white hover:text-primary-300 hover:bg-white/10'
                          : isCategoriesPage
                            ? 'text-white hover:text-primary-300 hover:bg-white/10'
                            : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href='/orders'
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        isHomePage
                          ? isScrolled
                            ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                            : 'text-white hover:text-primary-300 hover:bg-white/10'
                          : isCategoriesPage
                            ? 'text-white hover:text-primary-300 hover:bg-white/10'
                            : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className={`w-full text-left px-4 py-3 text-base font-medium rounded-xl transition-colors flex items-center ${
                        isHomePage
                          ? isScrolled
                            ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                            : 'text-white hover:text-primary-300 hover:bg-white/10'
                          : isCategoriesPage
                            ? 'text-white hover:text-primary-300 hover:bg-white/10'
                            : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                      }`}
                    >
                      <LogOut className='h-4 w-4 mr-2' />
                      Sign Out
                    </button>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div className='space-y-2'>
                    <Link
                      href='/sign-in'
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        isHomePage
                          ? isScrolled
                            ? 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                            : 'text-white hover:text-primary-300 hover:bg-white/10'
                          : isCategoriesPage
                            ? 'text-white hover:text-primary-300 hover:bg-white/10'
                            : 'text-steel-700 hover:text-steel-900 hover:bg-steel-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href='/sign-up'
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        isHomePage
                          ? isScrolled
                            ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                            : 'text-primary-300 hover:text-white hover:bg-white/10'
                          : isCategoriesPage
                            ? 'text-primary-300 hover:text-white hover:bg-white/10'
                            : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
