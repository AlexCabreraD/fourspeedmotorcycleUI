'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { imageCache } from './CategoryImagePreloader'

interface OptimizedCategoryImageProps {
  src: string
  alt: string
  priority?: boolean
  quality?: number
  className?: string
  sizes?: string
  fill?: boolean
}

// Optimized blur placeholder for better loading experience
const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

export default function OptimizedCategoryImage({
  src,
  alt,
  priority = false,
  quality = 75,
  className = "object-cover",
  sizes = "100vw",
  fill = true,
}: OptimizedCategoryImageProps) {
  const [isLoaded, setIsLoaded] = useState(imageCache.has(src))
  const [hasError, setHasError] = useState(false)

  // Preload image for instant loading on revisit (same as home page strategy)
  useEffect(() => {
    if (imageCache.has(src)) {
      setIsLoaded(true)
      return
    }

    const img = new window.Image()
    img.onload = () => {
      imageCache.set(src, true)
      setIsLoaded(true)
    }
    img.onerror = () => {
      setHasError(true)
    }
    img.src = src
  }, [src])

  if (hasError) {
    return (
      <div className="bg-gradient-to-br from-steel-600 via-steel-700 to-steel-800 h-full flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="text-lg font-bold mb-2">Category Image</div>
          <div className="text-sm opacity-80">Loading failed</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        quality={quality}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-steel-400 via-steel-500 to-steel-600 animate-pulse" />
      )}
    </>
  )
}