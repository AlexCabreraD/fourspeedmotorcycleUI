'use client'

import { useEffect } from 'react'

// Critical category images to preload
const CRITICAL_IMAGES = [
  '/images/assets/categories-hero-air-filter-dramatic.JPG',
  '/images/assets/protective-gear-female-rider-harley.JPG',
  '/images/assets/riding-apparel-sport-rider-gear.JPG',
  '/images/assets/controls-accessories-red-footpegs.JPG',
  '/images/assets/maintenance-tools-workshop-gear.JPG',
  '/images/assets/specialty-vehicles-utv-rock-crawling.JPG',
  '/images/assets/electrical-lighting-extreme-wall-ride.JPG',
  '/images/assets/utv-action-dust-dramatic.JPG',
]

// Above-the-fold images that need priority loading
const PRIORITY_IMAGES = [
  '/images/assets/categories-hero-air-filter-dramatic.JPG',
]

// Global cache shared with OptimizedCategoryImage
const imageCache = new Map<string, boolean>()

export default function CategoryImagePreloader() {
  useEffect(() => {
    // Enhanced preloading with JS cache (same as home page strategy)
    const preloadImages = () => {
      CRITICAL_IMAGES.forEach((src, index) => {
        // Skip if already cached
        if (imageCache.has(src)) return

        // Stagger preloading to avoid bandwidth congestion
        setTimeout(() => {
          // Method 1: Resource hints for browser caching
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = src
          link.fetchPriority = PRIORITY_IMAGES.includes(src) ? 'high' : 'low'
          document.head.appendChild(link)

          // Method 2: JavaScript preloading for instant revisit (like home page)
          const img = new window.Image()
          img.onload = () => {
            imageCache.set(src, true)
            console.log(`✅ Cached category image: ${src.split('/').pop()}`)
          }
          img.onerror = () => {
            console.warn(`❌ Failed to cache: ${src.split('/').pop()}`)
          }
          img.src = src
        }, index * 150) // 150ms stagger for better network management
      })
    }

    // Wait for initial load to complete
    if (document.readyState === 'complete') {
      preloadImages()
    } else {
      window.addEventListener('load', preloadImages)
      return () => window.removeEventListener('load', preloadImages)
    }
  }, [])

  return null // This component only handles preloading
}

// Export cache for use in OptimizedCategoryImage
export { imageCache }