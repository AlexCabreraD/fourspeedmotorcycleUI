'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    title: "Premium Motorcycle Parts",
    subtitle: "Performance & Style Combined",
    description: "Discover our extensive collection of high-quality motorcycle parts from the industry's leading brands.",
    cta: "Shop Parts",
    ctaLink: "/categories",
    background: "bg-gradient-to-r from-steel-900 via-steel-800 to-primary-900",
    image: "/api/placeholder/hero-bike-1.jpg"
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Gear & Accessories",
    description: "Check out the newest additions to our inventory. Fresh parts, gear, and accessories just arrived.",
    cta: "View New Arrivals",
    ctaLink: "/new-arrivals",
    background: "bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900",
    image: "/api/placeholder/hero-parts.jpg"
  },
  {
    id: 3,
    title: "Winter Sale",
    subtitle: "Up to 40% Off Select Items",
    description: "Don't miss out on our biggest sale of the year. Limited time offers on premium motorcycle parts.",
    cta: "Shop Sale",
    ctaLink: "/sale",
    background: "bg-gradient-to-r from-accent-900 via-accent-800 to-primary-900",
    image: "/api/placeholder/hero-sale.jpg"
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

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
      {/* Background with overlay */}
      <div className={`absolute inset-0 ${currentSlideData.background} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-industrial opacity-10" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="text-white space-y-6">
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
                <Link
                  href="/products"
                  className="btn btn-outline btn-lg inline-flex items-center justify-center text-white border-white hover:bg-white hover:text-steel-900"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Parts
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-white border-opacity-20">
                <div>
                  <div className="text-2xl font-bold text-primary-300">50K+</div>
                  <div className="text-sm text-steel-300">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-300">100K+</div>
                  <div className="text-sm text-steel-300">Parts in Stock</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-300">25+</div>
                  <div className="text-sm text-steel-300">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Visual Element / Secondary Content */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500 rounded-full opacity-20" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-500 rounded-full opacity-20" />
                
                {/* Main visual */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      Free Shipping
                    </h3>
                    <p className="text-steel-200">
                      On all orders over $99
                    </p>
                    <div className="text-4xl font-bold text-primary-300">
                      $99+
                    </div>
                  </div>
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