'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import CategoryImagePreloader from '@/components/categories/CategoryImagePreloader'

// OPTIMIZED: Dynamic imports for better performance
const DesktopCategoriesView = dynamic(() => import('@/components/categories/DesktopCategoriesView'), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  )
})

const MobileCategoriesView = dynamic(() => import('@/components/categories/MobileCategoriesView'), {
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  )
})

export default function CategoriesPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // OPTIMIZED: Throttled resize handler
  const checkScreenSize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024) // lg breakpoint
  }, [])

  useEffect(() => {
    // Check on mount
    checkScreenSize()

    // OPTIMIZED: Throttled resize listener
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkScreenSize, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [checkScreenSize])

  // OPTIMIZED: Prevent hydration mismatch
  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Render mobile or desktop component based on screen size
  return (
    <>
      <CategoryImagePreloader />
      {isMobile ? <MobileCategoriesView /> : <DesktopCategoriesView />}
    </>
  )
}