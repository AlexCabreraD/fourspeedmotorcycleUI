'use client'

import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { WPSItem, ImageUtils } from '@/lib/api/wps-client'

interface OptimizedProductImageGalleryProps {
  selectedItem: WPSItem | null
  productName: string
  savingsAmount?: number | null
}

// Memoized image modal component
const ImageModal = memo(({ 
  isOpen, 
  images, 
  currentIndex, 
  productName, 
  onClose, 
  onNext, 
  onPrev, 
  onIndexChange 
}: {
  isOpen: boolean
  images: string[]
  currentIndex: number
  productName: string
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onIndexChange: (index: number) => void
}) => {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrev()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose, onNext, onPrev])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Main modal image */}
        <div className="relative w-[90vw] h-[90vh] max-w-4xl max-h-4xl bg-white/5 rounded-lg flex items-center justify-center">
          {images[currentIndex] ? (
            <Image
              src={images[currentIndex]}
              alt={`${productName} image ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
              quality={90}
              sizes="90vw"
              unoptimized={images[currentIndex].includes('placeholder')}
              onError={(e) => {
                console.error('Modal image failed to load:', images[currentIndex])
                console.error('Error details:', e)
                // Fallback to placeholder
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-product.svg'
              }}
              onLoad={() => {
                console.log('Modal image loaded successfully:', images[currentIndex])
              }}
            />
          ) : (
            <div className="text-white text-center">
              <div className="text-6xl mb-4">📷</div>
              <div>No image available</div>
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all hover:scale-110"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all hover:scale-110"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          {/* Image counter */}
          {images.length > 1 && (
            <div className="bg-black/50 text-white px-6 py-3 rounded-full text-lg font-medium mb-6">
              {currentIndex + 1} of {images.length}
            </div>
          )}

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="flex gap-3 justify-center max-w-md overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all hover:scale-110 ${
                    currentIndex === index ? 'border-white shadow-lg' : 'border-white/30'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hints */}
          <div className="text-white/70 text-sm mt-4">
            Use arrow keys to navigate • Press ESC to close
          </div>
        </div>
      </div>
    </div>
  )
})

ImageModal.displayName = 'ImageModal'

// Memoized thumbnail component
const ThumbnailGrid = memo(({ 
  images, 
  currentIndex, 
  productName, 
  onIndexChange 
}: {
  images: string[]
  currentIndex: number
  productName: string
  onIndexChange: (index: number) => void
}) => {
  if (images.length <= 1) return null

  return (
    <div className="p-4 bg-steel-50">
      <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all transform hover:scale-105 ${
              currentIndex === index 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-steel-200 hover:border-steel-300'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-contain p-1"
              sizes="80px"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  )
})

ThumbnailGrid.displayName = 'ThumbnailGrid'

// Memoized product badges
const ProductBadges = memo(({ 
  savingsAmount, 
  status 
}: {
  savingsAmount?: number | null
  status?: string
}) => {
  if (!savingsAmount && status !== 'STK') return null

  return (
    <div className="absolute top-6 left-6 space-y-2">
      {savingsAmount && (
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          Save ${savingsAmount.toFixed(2)}
        </div>
      )}
      {status === 'STK' && (
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          In Stock
        </div>
      )}
    </div>
  )
})

ProductBadges.displayName = 'ProductBadges'

const OptimizedProductImageGallery = memo(function OptimizedProductImageGallery({
  selectedItem,
  productName,
  savingsAmount
}: OptimizedProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Memoized image URLs
  const images = useMemo(() => {
    if (!selectedItem) {
      console.log('OptimizedProductImageGallery: No selectedItem, using placeholder')
      return ['/placeholder-product.svg']
    }
    
    if (ImageUtils.hasImages(selectedItem)) {
      const imageUrls = ImageUtils.getItemImageUrls(selectedItem, '800_max')
      console.log('OptimizedProductImageGallery: Images found:', imageUrls)
      console.log('OptimizedProductImageGallery: selectedItem data:', selectedItem)
      
      // Validate that URLs are not empty or invalid
      const validUrls = imageUrls.filter(url => url && url.trim() !== '')
      if (validUrls.length > 0) {
        return validUrls
      }
    }
    
    console.log('OptimizedProductImageGallery: No valid images in selectedItem, using placeholder')
    return ['/placeholder-product.svg']
  }, [selectedItem])

  // Reset image index when item changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedItem?.id])

  // Navigation handlers
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleIndexChange = useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  const openModal = useCallback(() => {
    console.log('Opening image modal with images:', images)
    console.log('Current index:', currentImageIndex)
    console.log('Current image URL:', images[currentImageIndex])
    setIsImageModalOpen(true)
  }, [images, currentImageIndex])

  const closeModal = useCallback(() => {
    setIsImageModalOpen(false)
  }, [])

  return (
    <>
      {/* Main Image Gallery */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div 
          className="relative aspect-square bg-steel-50 group cursor-pointer"
          onClick={openModal}
        >
          <Image
            src={images[currentImageIndex]}
            alt={`${productName} main image`}
            fill
            className="object-contain transition-all duration-500 group-hover:scale-105 p-4"
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              console.error('Main image failed to load:', images[currentImageIndex])
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-product.svg'
            }}
          />
          
          {/* Enhanced zoom hint */}
          <div className="absolute top-6 right-6 bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            <ZoomIn className="h-5 w-5" />
          </div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6 text-steel-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <ChevronRight className="h-6 w-6 text-steel-700" />
              </button>
            </>
          )}
          
          {/* Enhanced image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1} of {images.length}
            </div>
          )}

          {/* Product badges */}
          <ProductBadges 
            savingsAmount={savingsAmount} 
            status={selectedItem?.status} 
          />
        </div>

        {/* Thumbnail Images */}
        <ThumbnailGrid
          images={images}
          currentIndex={currentImageIndex}
          productName={productName}
          onIndexChange={handleIndexChange}
        />
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        images={images}
        currentIndex={currentImageIndex}
        productName={productName}
        onClose={closeModal}
        onNext={nextImage}
        onPrev={prevImage}
        onIndexChange={handleIndexChange}
      />
    </>
  )
})

OptimizedProductImageGallery.displayName = 'OptimizedProductImageGallery'

export default OptimizedProductImageGallery