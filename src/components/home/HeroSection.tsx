'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { heroConfig } from '@/config/hero'

// Get enabled slides only
const heroSlides = heroConfig.slides.filter((slide) => slide.enabled)

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(heroConfig.autoPlay)
  const [scrollY, setScrollY] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  // Preload all hero images on component mount
  useEffect(() => {
    const preloadImages = () => {
      heroSlides.forEach((slide, index) => {
        if (slide.image) {
          const img = new window.Image()
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(index))
          }
          img.src = slide.image
        }
      })
    }

    preloadImages()
  }, [])

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || !heroConfig.autoPlay) {
      return
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, heroConfig.slideInterval)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  // Optimized parallax scroll effect with throttling
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % heroSlides.length
    if (loadedImages.has(nextIndex)) {
      setCurrentSlide(nextIndex)
      setIsAutoPlaying(false)
    }
  }

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length
    if (loadedImages.has(prevIndex)) {
      setCurrentSlide(prevIndex)
      setIsAutoPlaying(false)
    }
  }

  const goToSlide = (index: number) => {
    if (loadedImages.has(index)) {
      setCurrentSlide(index)
      setIsAutoPlaying(false)
    }
  }

  const currentSlideData = heroSlides[currentSlide]

  // Calculate parallax offset (background moves slower than scroll)
  const parallaxOffset = scrollY * 0.5

  return (
    <section className='relative h-screen overflow-hidden'>
      {/* Background Images with Crossfade Transition */}
      <div className='absolute inset-0 overflow-hidden'>
        {heroSlides.map(
          (slide, index) =>
            slide.image && (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide && loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className='object-cover object-right'
                  style={{
                    objectPosition: 'right center',
                    transform: `translate3d(0, ${parallaxOffset}px, 0)`,
                    willChange: 'transform',
                  }}
                  priority={index === 0}
                  quality={85}
                  sizes='100vw'
                />
              </div>
            )
        )}
      </div>

      {/* Subtle overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* Fallback gradient background - only show when no image available */}
      <div
        className={`absolute inset-0 ${currentSlideData.background} transition-all duration-1000 ${currentSlideData.image ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Minimal Clean Content - Bottom Left Positioning */}
      <div className='relative h-full flex items-end'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24'>
          <div className='max-w-2xl space-y-6 text-white'>
            {/* Clean Typography */}
            <div className='space-y-4'>
              <p className='text-primary-300 font-medium text-sm tracking-[0.2em] uppercase'>
                {currentSlideData.subtitle}
              </p>
              <h1 className='text-4xl md:text-6xl font-display font-bold leading-tight'>
                {currentSlideData.title}
              </h1>
              <p className='text-lg text-steel-100 leading-relaxed max-w-lg'>
                {currentSlideData.description}
              </p>
            </div>

            {/* Simple CTA */}
            <div className='pt-6'>
              <Link
                href={currentSlideData.ctaLink}
                className='inline-flex items-center gap-3 text-white border-b-2 border-primary-400 pb-1 font-semibold text-lg hover:border-white transition-colors group'
              >
                {currentSlideData.cta}
                <svg
                  className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal navigation dots - top right */}
      <div className='absolute top-32 right-8'>
        <div className='flex flex-col space-y-3'>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-8 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-primary-400'
                  : 'bg-white bg-opacity-30 hover:bg-opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className='absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-300'
      >
        <ChevronLeft className='h-6 w-6' />
      </button>

      <button
        onClick={nextSlide}
        className='absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-300'
      >
        <ChevronRight className='h-6 w-6' />
      </button>
    </section>
  )
}
