'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { WPSProduct, WPSItem } from '@/lib/api/wps-client'
import OptimizedProductImageGallery from './OptimizedProductImageGallery'
import OptimizedProductDetails from './OptimizedProductDetails'

// Dynamic imports for performance optimization
const OptimizedProductTabs = dynamic(() => import('./OptimizedProductTabs'), {
  loading: () => (
    <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="animate-pulse p-6">
        <div className="flex space-x-8 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-steel-200 rounded w-24" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-steel-200 rounded w-48" />
          <div className="h-4 bg-steel-200 rounded w-full" />
          <div className="h-4 bg-steel-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  )
})

interface ProductWithItems extends WPSProduct {
  items: WPSItem[]
}

interface OptimizedProductPageProps {
  params: Promise<{ id: string }>
}

// Memoized breadcrumb component
const ProductBreadcrumb = React.memo(({ 
  productName, 
  selectedItem 
}: {
  productName: string
  selectedItem: WPSItem | null
}) => (
  <nav className="flex items-center space-x-3 text-sm py-4">
    <Link href="/" className="text-steel-600 hover:text-primary-600 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50">
      Home
    </Link>
    <ChevronRight className="h-4 w-4 text-steel-400" />
    <Link href="/products" className="text-steel-600 hover:text-primary-600 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50">
      Products
    </Link>
    <ChevronRight className="h-4 w-4 text-slate-400" />
    {selectedItem?.product_type && (
      <>
        <span className="text-steel-500 px-3 py-1.5 bg-steel-100 rounded-lg text-xs font-medium uppercase tracking-wider">
          {selectedItem.product_type}
        </span>
        <ChevronRight className="h-4 w-4 text-steel-400" />
      </>
    )}
    <span className="text-steel-900 font-semibold truncate">{productName}</span>
  </nav>
))

ProductBreadcrumb.displayName = 'ProductBreadcrumb'

// Memoized loading skeleton component
const ProductLoadingSkeleton = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-4 bg-steel-200 rounded w-16"></div>
          <div className="h-4 bg-steel-200 rounded w-1"></div>
          <div className="h-4 bg-steel-200 rounded w-20"></div>
          <div className="h-4 bg-steel-200 rounded w-1"></div>
          <div className="h-4 bg-steel-200 rounded w-32"></div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Image skeleton */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-steel-200"></div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-steel-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-3">
                <div className="h-4 bg-steel-200 rounded w-24"></div>
                <div className="h-8 bg-steel-200 rounded w-3/4"></div>
                <div className="h-6 bg-steel-200 rounded w-1/2"></div>
              </div>
              <div className="h-12 bg-steel-200 rounded w-32 mt-6"></div>
              <div className="h-16 bg-steel-200 rounded mt-6"></div>
              <div className="h-12 bg-steel-200 rounded mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
))

ProductLoadingSkeleton.displayName = 'ProductLoadingSkeleton'

// Memoized error component
const ProductError = React.memo(({ error }: { error: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white flex items-center justify-center">
    <div className="max-w-md mx-auto text-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-steel-900 mb-4">Product Not Found</h1>
        <p className="text-steel-600 mb-6">{error}</p>
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
))

ProductError.displayName = 'ProductError'

export default function OptimizedProductPage({ params }: OptimizedProductPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [product, setProduct] = useState<ProductWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<WPSItem | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  // Optimized product fetching with caching
  useEffect(() => {
    if (!resolvedParams?.id) return

    const fetchProduct = async () => {
      try {
        // Check if we have cached data
        const cacheKey = `product-${resolvedParams.id}`
        const cachedData = sessionStorage.getItem(cacheKey)
        
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          // Use cache for 5 minutes
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setProduct(data)
            setLoading(false)
            return
          }
        }

        const response = await fetch(`/api/products/${resolvedParams.id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          // Cache the result
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data: data.data,
            timestamp: Date.now()
          }))
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

  const updateSelectedItem = (item: WPSItem) => {
    // Only update if selecting a different item
    if (selectedItem?.id === item.id) return
    
    setSelectedItem(item)
    
    // Update URL with the selected item ID only if it's different from current URL
    const currentItemId = searchParams.get('item')
    if (currentItemId !== item.id.toString()) {
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set('item', item.id.toString())
      router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false })
    }
  }

  // Simplified savings calculation
  const savingsAmount = selectedItem?.mapp_price && selectedItem?.list_price ? 
    (() => {
      const mapp = parseFloat(selectedItem.mapp_price)
      const list = parseFloat(selectedItem.list_price)
      return mapp > list ? mapp - list : null
    })() : null

  // Early returns for loading and error states
  if (loading) {
    return <ProductLoadingSkeleton />
  }

  if (error || !product) {
    return <ProductError error={error || 'The requested product could not be found.'} />
  }

  return (
    <div className="min-h-screen bg-steel-50">
      {/* Hero Section with Breadcrumb */}
      <div className="bg-white border-b border-steel-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductBreadcrumb 
            productName={product.name}
            selectedItem={selectedItem}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Images - Enhanced Visual Hierarchy */}
          <div className="relative">
            {/* Floating badge */}
            {savingsAmount && (
              <div className="absolute -top-2 -left-2 z-10">
                <div className="bg-accent-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-card transform rotate-2">
                  Save ${savingsAmount.toFixed(0)}
                </div>
              </div>
            )}
            <OptimizedProductImageGallery
              selectedItem={selectedItem}
              productName={product.name}
              savingsAmount={savingsAmount}
            />
          </div>

          {/* Product Details */}
          <div className="lg:pl-4">
            <OptimizedProductDetails
              product={product}
              selectedItem={selectedItem}
              onItemSelect={updateSelectedItem}
            />
          </div>
        </div>

        {/* Product Information Tabs */}
        <div>
          <OptimizedProductTabs
            product={product}
            selectedItem={selectedItem}
          />
        </div>
      </div>
    </div>
  )
}