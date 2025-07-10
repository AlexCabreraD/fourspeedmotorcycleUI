'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { heroConfig } from '@/config/hero'

// Get enabled slides only
const heroSlides = heroConfig.slides.filter(slide => slide.enabled)

interface HeroVariantProps {
  variant?: 'split' | 'centered' | 'minimal' | 'dynamic'
}

export default function HeroVariants({ variant = 'split' }: HeroVariantProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(heroConfig.autoPlay)
  const [scrollY, setScrollY] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || !heroConfig.autoPlay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, heroConfig.slideInterval)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]
  
  // Calculate parallax offset (background moves slower than scroll)
  const parallaxOffset = scrollY * 0.5

  // Variant: Centered Impact
  if (variant === 'centered') {
    return (
      <section className="relative h-screen overflow-hidden -mt-18 pt-18">
        {/* Background Image with Parallax */}
        {currentSlideData.image && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-[120%] object-cover object-center"
              style={{ 
                transform: `translate3d(0, ${parallaxOffset}px, 0)`,
                willChange: 'transform'
              }}
            />
          </div>
        )}
        
        {/* Dramatic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Centered Content */}
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Massive Typography */}
            <div className="space-y-8 text-white">
              <div className="space-y-6">
                <div className="inline-block px-6 py-3 bg-primary-600/20 backdrop-blur-sm rounded-full border border-primary-400/30">
                  <span className="text-primary-300 font-bold text-lg tracking-widest uppercase">
                    {currentSlideData.subtitle}
                  </span>
                </div>
                
                {/* Massive Hero Text */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-none tracking-tighter">
                  <span className="block bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
                    {currentSlideData.title}
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-steel-100 leading-relaxed font-light max-w-3xl mx-auto">
                  {currentSlideData.description}
                </p>
              </div>

              {/* Prominent Single CTA */}
              <div className="pt-8">
                <Link
                  href={currentSlideData.ctaLink}
                  className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-12 py-6 rounded-2xl font-black text-2xl transition-all duration-500 hover:scale-110 hover:shadow-2xl"
                >
                  <span className="relative z-10">{currentSlideData.cta}</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                </Link>
              </div>

              {/* Floating Stats */}
              <div className="flex justify-center gap-12 pt-12">
                {[
                  { value: heroConfig.stats.customers, label: 'Riders' },
                  { value: heroConfig.stats.parts, label: 'Parts' },
                  { value: heroConfig.stats.experience, label: 'Years' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-accent-400">{stat.value}</div>
                    <div className="text-lg text-steel-300 font-medium uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation and Controls remain the same */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary-400 w-8' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>
    )
  }

  // Variant: Minimal Clean
  if (variant === 'minimal') {
    return (
      <section className="relative h-screen overflow-hidden -mt-18 pt-18">
        {/* Background Image with Parallax */}
        {currentSlideData.image && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-[120%] object-cover object-right"
              style={{ 
                objectPosition: 'right center',
                transform: `translate3d(0, ${parallaxOffset}px, 0)`,
                willChange: 'transform'
              }}
            />
          </div>
        )}
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Minimal Content - Bottom Left */}
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24">
            <div className="max-w-2xl space-y-6 text-white">
              
              {/* Clean Typography */}
              <div className="space-y-4">
                <p className="text-primary-300 font-medium text-sm tracking-[0.2em] uppercase">
                  {currentSlideData.subtitle}
                </p>
                <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
                <p className="text-lg text-steel-100 leading-relaxed max-w-lg">
                  {currentSlideData.description}
                </p>
              </div>

              {/* Simple CTA */}
              <div className="pt-6">
                <Link
                  href={currentSlideData.ctaLink}
                  className="inline-flex items-center gap-3 text-white border-b-2 border-primary-400 pb-1 font-semibold text-lg hover:border-white transition-colors group"
                >
                  {currentSlideData.cta}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Minimal navigation dots - top right */}
        <div className="absolute top-32 right-8">
          <div className="flex flex-col space-y-3">
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
      </section>
    )
  }

  // Variant: Dynamic Layout - Content adapts to image
  if (variant === 'dynamic') {
    return (
      <section className="relative h-screen overflow-hidden -mt-18 pt-18">
        {/* Background Image with Parallax */}
        {currentSlideData.image && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-[120%] object-cover object-center"
              style={{ 
                transform: `translate3d(0, ${parallaxOffset}px, 0)`,
                willChange: 'transform'
              }}
            />
          </div>
        )}
        
        {/* Dynamic overlay - adapts to content position */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/50" />
        
        {/* Dynamic Content Position */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-12 gap-8 items-center">
              
              {/* Content spans different areas based on slide */}
              <div className="col-span-12 md:col-span-7 lg:col-span-6 text-white space-y-8">
                
                {/* Dynamic badge */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-primary-300 font-bold text-lg tracking-wide uppercase">
                    {currentSlideData.subtitle}
                  </span>
                </div>
                
                {/* Adaptive Typography */}
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-display font-black leading-none">
                    <span className="block">{currentSlideData.title.split(' ')[0]}</span>
                    <span className="block text-primary-400 text-4xl md:text-6xl mt-2">
                      {currentSlideData.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h1>
                  
                  <p className="text-xl text-steel-100 leading-relaxed max-w-2xl">
                    {currentSlideData.description}
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row items-start gap-6 pt-4">
                  <Link
                    href={currentSlideData.ctaLink}
                    className="group bg-white text-steel-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center gap-3"
                  >
                    {currentSlideData.cta}
                    <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  
                  {/* Quick access links */}
                  <div className="flex gap-3">
                    {['Shop', 'Learn', 'Support'].map((link) => (
                      <Link
                        key={link}
                        href={`/${link.toLowerCase()}`}
                        className="text-white/80 hover:text-white border-b border-white/20 hover:border-white/60 transition-colors text-sm font-medium"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right side - Floating elements */}
              <div className="hidden lg:block col-span-6">
                <div className="flex flex-col items-end space-y-6">
                  {/* Live indicator */}
                  <div className="bg-green-500/20 backdrop-blur-sm text-green-300 px-4 py-2 rounded-full border border-green-400/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live Inventory</span>
                  </div>
                  
                  {/* Compact stats */}
                  <div className="grid grid-cols-3 gap-4 text-right">
                    <div>
                      <div className="text-2xl font-bold text-primary-400">{heroConfig.stats.customers}</div>
                      <div className="text-xs text-steel-300 uppercase tracking-wide">Customers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent-400">{heroConfig.stats.parts}</div>
                      <div className="text-xs text-steel-300 uppercase tracking-wide">Parts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-400">{heroConfig.stats.experience}</div>
                      <div className="text-xs text-steel-300 uppercase tracking-wide">Years</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary-400 w-8' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75 w-4'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>
    )
  }

  // Default: Split layout (already implemented in main component)
  return null
}