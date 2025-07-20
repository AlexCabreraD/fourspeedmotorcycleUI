'use client'

import { useState, useEffect } from 'react'
import DesktopCategoriesView from '@/components/categories/DesktopCategoriesView'
import MobileCategoriesView from '@/components/categories/MobileCategoriesView'

export default function CategoriesPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }

    // Check on mount
    checkScreenSize()

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Render mobile or desktop component based on screen size
  return isMobile ? <MobileCategoriesView /> : <DesktopCategoriesView />
}