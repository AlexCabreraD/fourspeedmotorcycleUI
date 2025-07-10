'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { heroConfig } from '@/config/hero'

// Get enabled slides only
const heroSlides = heroConfig.slides.filter(slide => slide.enabled)

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(heroConfig.autoPlay)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || !heroConfig.autoPlay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, heroConfig.slideInterval)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

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

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      {currentSlideData.image && (
        <div className="absolute inset-0">
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full h-full object-cover object-right"
            style={{ objectPosition: 'right center' }}
          />
        </div>
      )}
      
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Fallback gradient background */}
      <div className={`absolute inset-0 ${currentSlideData.background} transition-all duration-1000 ${currentSlideData.image ? 'opacity-30' : 'opacity-100'}`} />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center">
            
            {/* Text Content */}
            <div className="text-white space-y-6 max-w-2xl">
              <div className="space-y-4">
                <p className="text-primary-300 font-medium text-lg tracking-wide">
                  {currentSlideData.subtitle}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
                <p className="text-xl text-steel-200 max-w-lg leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={currentSlideData.ctaLink}
                  className="btn btn-accent btn-lg inline-flex items-center justify-center"
                >
                  {currentSlideData.cta}
                </Link>
                {currentSlideData.secondaryBtn && (
                  <Link
                    href={currentSlideData.secondaryBtn.link}
                    className="btn btn-outline btn-lg inline-flex items-center justify-center text-white border-white hover:bg-white hover:text-steel-900"
                  >
                    {currentSlideData.secondaryBtn.text}
                  </Link>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-white border-opacity-20">
                <div>
                  <div className="text-2xl font-bold text-primary-300">{heroConfig.stats.customers}</div>
                  <div className="text-sm text-steel-300">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-300">{heroConfig.stats.parts}</div>
                  <div className="text-sm text-steel-300">Parts in Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-300">{heroConfig.stats.experience}</div>
                  <div className="text-sm text-steel-300">Years Experience</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Controls */}
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

      {/* Arrow Navigation */}
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