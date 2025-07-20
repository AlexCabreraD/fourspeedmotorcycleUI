'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package } from 'lucide-react'
import { CustomCategory, CUSTOM_CATEGORIES } from '@/lib/constants/custom-categories'

// Enhanced smooth scroll with snap behavior
const smoothScrollCSS = `
  html {
    scroll-behavior: auto;
  }
  
  .scroll-container {
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  
  .scroll-container::-webkit-scrollbar {
    display: none;
  }
  
  .scroll-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

export default function DesktopCategoriesView() {
  const [categories, setCategories] = useState<CustomCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)

  // Number of sections (hero + 10 categories + final CTA = 12 total)
  const totalSections = 12

  // Add custom CSS for smooth scrolling
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = smoothScrollCSS
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Smooth scroll to section
  const scrollToSection = useCallback((index: number) => {
    if (index >= 0 && index < totalSections) {
      // Calculate target scroll position
      const targetScrollTop = index * window.innerHeight
      
      window.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }
  }, [totalSections])

  // Scroll progress tracking only
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight - windowHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setScrollProgress(progress)

      // Update current section based on scroll position
      const sectionIndex = Math.round(scrollTop / windowHeight)
      const newCurrentSection = Math.max(0, Math.min(sectionIndex, totalSections - 1))
      setCurrentSection(newCurrentSection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [totalSections])

  // Wheel-based section navigation
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout
    let lastWheelTime = 0

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      
      // Throttle wheel events to prevent rapid firing
      if (now - lastWheelTime < 100) return
      lastWheelTime = now
      
      // Only intercept if this is a significant scroll
      if (Math.abs(e.deltaY) < 10) return
      
      e.preventDefault()
      
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        const direction = e.deltaY > 0 ? 1 : -1
        const nextSection = currentSection + direction
        
        if (nextSection >= 0 && nextSection < totalSections) {
          scrollToSection(nextSection)
        }
      }, 10)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          scrollToSection(currentSection + 1)
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          scrollToSection(currentSection - 1)
          break
        case 'Home':
          e.preventDefault()
          scrollToSection(0)
          break
        case 'End':
          e.preventDefault()
          scrollToSection(totalSections - 1)
          break
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(wheelTimeout)
    }
  }, [currentSection, scrollToSection, totalSections])


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/custom-categories?include_counts=true')
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data)
        } else {
          // Use fallback categories if API doesn't return data
          setCategories(CUSTOM_CATEGORIES)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Use fallback categories on error
        setCategories(CUSTOM_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-black overflow-hidden -mt-[72px]">
        {/* Loading Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-1/3 animate-pulse" />
        </div>

        {/* Loading Navigation Dots */}
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border-2 border-white/60 ${i === 0 ? 'bg-orange-500 border-orange-500' : 'bg-transparent'} animate-pulse`}
            />
          ))}
        </div>

        {/* Hero Loading Section */}
        <div className="relative h-screen overflow-hidden pt-[72px]">
          {/* Hero Background Skeleton */}
          <div className="absolute inset-0 bg-gradient-to-r from-steel-800 via-steel-700 to-steel-600 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          
          {/* Hero Content Skeleton */}
          <div className="relative h-full flex items-center">
            <div className="w-full px-8 lg:px-16">
              <div className="max-w-4xl">
                <div className="w-32 h-8 bg-orange-500/60 rounded-full mb-8 animate-pulse" />
                <div className="space-y-4 mb-8">
                  <div className="w-80 h-20 bg-white/20 rounded-lg animate-pulse" />
                  <div className="w-96 h-20 bg-white/10 rounded-lg animate-pulse" />
                  <div className="w-64 h-16 bg-white/15 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator Skeleton */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center animate-pulse">
              <div className="w-1 h-4 bg-orange-500 rounded-full mt-3" />
            </div>
          </div>
        </div>

        {/* Category Sections Loading */}
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="relative h-screen">
            {/* Alternating layouts for visual variety */}
            {index % 2 === 0 ? (
              // Horizontal split layout
              <div className="flex h-full">
                <div className="w-1/2 bg-white/5 flex items-center animate-pulse">
                  <div className="p-16 lg:p-24 w-full">
                    <div className="w-16 h-8 bg-orange-500/40 rounded-full mb-8 animate-pulse" />
                    <div className="space-y-4 mb-8">
                      <div className="w-full h-16 bg-steel-700/60 rounded-lg animate-pulse" />
                      <div className="w-4/5 h-16 bg-steel-700/40 rounded-lg animate-pulse" />
                    </div>
                    <div className="w-full h-6 bg-steel-600/50 rounded mb-12 animate-pulse" />
                    <div className="w-48 h-14 bg-steel-800/60 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="w-1/2 bg-gradient-to-br from-steel-600 via-steel-700 to-steel-800 animate-pulse" />
              </div>
            ) : (
              // Full background layout
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-l from-steel-800 via-steel-700 to-steel-600 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center max-w-4xl px-8">
                    <div className="w-24 h-24 bg-orange-500/30 rounded-full mx-auto mb-8 animate-pulse" />
                    <div className="space-y-4 mb-8">
                      <div className="w-80 h-16 bg-white/20 rounded-lg mx-auto animate-pulse" />
                      <div className="w-96 h-16 bg-white/15 rounded-lg mx-auto animate-pulse" />
                    </div>
                    <div className="w-full max-w-2xl h-6 bg-white/10 rounded mx-auto mb-12 animate-pulse" />
                    <div className="w-56 h-14 bg-white/20 rounded-full mx-auto animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Final CTA Section Loading */}
        <div className="relative h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-steel-900 via-steel-800 to-black animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-8">
              <div className="w-64 h-12 bg-orange-500/30 rounded-full mx-auto mb-8 animate-pulse" />
              <div className="space-y-6 mb-12">
                <div className="w-96 h-20 bg-white/20 rounded-lg mx-auto animate-pulse" />
                <div className="w-80 h-20 bg-white/15 rounded-lg mx-auto animate-pulse" />
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div className="w-56 h-16 bg-orange-500/40 rounded-full animate-pulse" />
                <div className="w-48 h-16 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Section Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
        {Array.from({ length: totalSections }, (_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              currentSection === i
                ? 'bg-orange-500 border-orange-500 scale-125'
                : 'bg-transparent border-white/60 hover:border-orange-400 hover:bg-orange-400/20'
            }`}
            title={`Go to section ${i + 1}`}
          />
        ))}
      </div>

      <div className="bg-black overflow-x-hidden scroll-container -mt-[72px]">
      {/* Full-Screen Cinematic Opener */}
      <div className="section-snap relative h-screen overflow-hidden pt-[72px]">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/assets/categories-hero-air-filter-dramatic.JPG"
            alt="Performance Engineering"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        
        {/* Hero Content - Bottom Positioned */}
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-20 md:pb-24">
            <div className="max-w-4xl space-y-4 sm:space-y-6 text-white">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-primary-300 font-medium text-xs sm:text-sm tracking-[0.2em] uppercase">
                  Categories
                </p>
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9]">
                  Every
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600">
                    Detail
                  </span>
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-70">Matters</span>
                </h1>
                <p className="text-base sm:text-lg text-steel-100 leading-relaxed max-w-lg">
                  Find the perfect parts for your motorcycle across all our specialized categories
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-orange-500 rounded-full mt-3 animate-bounce"></div>
          </div>
          <div className="text-white/60 text-xs mt-3 font-medium">SCROLL</div>
        </div>
      </div>

      {/* CATEGORY 1: FULL BLEED HORIZONTAL SPLIT - Engine & Performance */}
      {categories.find(cat => cat.slug === 'engine-performance') && (
        <div className="section-snap relative h-screen flex">
          {/* Image Side */}
          <div className="w-1/2 relative overflow-hidden">
            {categories.find(cat => cat.slug === 'engine-performance')?.image ? (
              <Image
                src={categories.find(cat => cat.slug === 'engine-performance')!.image!}
                alt={categories.find(cat => cat.slug === 'engine-performance')!.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            ) : (
              <div className="bg-gray-600 h-full flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-3xl font-bold mb-4">{categories.find(cat => cat.slug === 'engine-performance')?.name.toUpperCase()}</div>
                  <div className="text-sm opacity-80">Dramatic close-up product shot with selective focus</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
          </div>
          
          {/* Content Side */}
          <div className="w-1/2 bg-white flex items-center">
            <div className="p-16 lg:p-24">
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold uppercase tracking-wider mb-8">
                01
              </div>
              <h2 className="text-6xl lg:text-7xl font-display font-black text-steel-900 mb-8 leading-tight">
                {categories.find(cat => cat.slug === 'engine-performance')?.name}
              </h2>
              <p className="text-2xl text-steel-600 leading-relaxed mb-12 max-w-lg">
                {categories.find(cat => cat.slug === 'engine-performance')?.description}
              </p>
              <Link 
                href={`/category/${categories.find(cat => cat.slug === 'engine-performance')?.slug}`}
                className="group inline-flex items-center px-12 py-6 bg-steel-900 text-white text-xl font-bold rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Explore Collection
                <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 2: DIAGONAL SPLIT - Suspension & Handling */}
      {categories.find(cat => cat.slug === 'suspension-handling') && (
        <div className="section-snap relative h-screen overflow-hidden ">
          {/* Background Image */}
          <div className="absolute inset-0">
            {categories.find(cat => cat.slug === 'suspension-handling')?.image ? (
              <Image
                src={categories.find(cat => cat.slug === 'suspension-handling')!.image!}
                alt={categories.find(cat => cat.slug === 'suspension-handling')!.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="bg-gray-700 h-full flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-3xl font-bold mb-4">{categories.find(cat => cat.slug === 'suspension-handling')?.name.toUpperCase()}</div>
                  <div className="text-sm opacity-80">Dynamic angle shot with motion elements</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Diagonal Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="bg-white/95 backdrop-blur-sm w-full transform -skew-y-2 origin-bottom-left p-24 pb-32">
              <div className="transform skew-y-2">
                <div className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-bold uppercase tracking-wider mb-6">
                  02
                </div>
                <h2 className="text-5xl lg:text-6xl font-display font-black text-steel-900 mb-6">
                  {categories.find(cat => cat.slug === 'suspension-handling')?.name}
                </h2>
                <p className="text-xl text-steel-600 mb-8 max-w-2xl">
                  {categories.find(cat => cat.slug === 'suspension-handling')?.description}
                </p>
                <Link 
                  href={`/category/${categories.find(cat => cat.slug === 'suspension-handling')?.slug}`}
                  className="group inline-flex items-center px-10 py-4 border-2 border-steel-900 text-steel-900 text-lg font-bold rounded-full hover:bg-steel-900 hover:text-white transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: FULL BLEED WITH FLOATING CARD - Wheels & Tires */}
      {categories.find(cat => cat.slug === 'wheels-tires') && (
        <div className="section-snap relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            {categories.find(cat => cat.slug === 'wheels-tires')?.image ? (
              <Image
                src={categories.find(cat => cat.slug === 'wheels-tires')!.image!}
                alt={categories.find(cat => cat.slug === 'wheels-tires')!.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="bg-gray-800 h-full flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-3xl font-bold mb-4">{categories.find(cat => cat.slug === 'wheels-tires')?.name.toUpperCase()}</div>
                  <div className="text-sm opacity-80">Atmospheric product environment shot</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          {/* Floating Content Card */}
          <div className="relative h-full flex items-center justify-end pr-16">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 max-w-lg">
              <div className="text-orange-400 text-8xl font-bold mb-4">03</div>
              <h2 className="text-4xl font-display font-black text-white mb-6">
                {categories.find(cat => cat.slug === 'wheels-tires')?.name}
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                {categories.find(cat => cat.slug === 'wheels-tires')?.description}
              </p>
              <Link 
                href={`/category/${categories.find(cat => cat.slug === 'wheels-tires')?.slug}`}
                className="group inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all duration-300"
              >
                Discover
                <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: FULL BLEED HORIZONTAL SPLIT - Protective Gear */}
      {categories.find(cat => cat.slug === 'protective-gear') && (
        <div className="section-snap relative h-screen flex">
          {/* Content Side */}
          <div className="w-1/2 bg-white flex items-center">
            <div className="p-16 lg:p-24">
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold uppercase tracking-wider mb-8">
                04
              </div>
              <h2 className="text-6xl lg:text-7xl font-display font-black text-steel-900 mb-8 leading-tight">
                {categories.find(cat => cat.slug === 'protective-gear')?.name}
              </h2>
              <p className="text-2xl text-steel-600 leading-relaxed mb-12 max-w-lg">
                {categories.find(cat => cat.slug === 'protective-gear')?.description}
              </p>
              <Link 
                href={`/category/${categories.find(cat => cat.slug === 'protective-gear')?.slug}`}
                className="group inline-flex items-center px-12 py-6 bg-steel-900 text-white text-xl font-bold rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Explore Collection
                <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
          
          {/* Image Side */}
          <div className="w-1/2 relative overflow-hidden">
            <Image
              src="/images/assets/protective-gear-female-rider-harley.JPG"
              alt="Protective Gear - Female Rider with Harley"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30"></div>
          </div>
        </div>
      )}

      {/* CATEGORY 5: FULL BLEED HERO - Riding Apparel */}
      {categories.find(cat => cat.slug === 'riding-apparel') && (
        <div className="section-snap relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/assets/riding-apparel-sport-rider-gear.JPG"
              alt="Riding Apparel - Sport Rider Gear"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent"></div>
          </div>
          
          {/* Content - Right Side */}
          <div className="relative h-full flex items-center justify-end pr-16">
            <div className="max-w-xl text-right">
              <div className="inline-block px-6 py-3 bg-orange-500 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-full mb-8">
                05
              </div>
              <h2 className="text-6xl lg:text-7xl font-display font-black text-white mb-8 leading-tight">
                {categories.find(cat => cat.slug === 'riding-apparel')?.name}
              </h2>
              <p className="text-white/90 text-xl leading-relaxed mb-12">
                {categories.find(cat => cat.slug === 'riding-apparel')?.description}
              </p>
              <Link 
                href={`/category/${categories.find(cat => cat.slug === 'riding-apparel')?.slug}`}
                className="group inline-flex items-center px-12 py-6 bg-white text-steel-900 text-xl font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Shop Gear
                <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 6: FULL BLEED VERTICAL TEXT - Brakes & Drivetrain */}
      {categories.find(cat => cat.slug === 'brakes-drivetrain') && (
        <div className="section-snap relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            {categories.find(cat => cat.slug === 'brakes-drivetrain')?.image ? (
              <Image
                src={categories.find(cat => cat.slug === 'brakes-drivetrain')!.image!}
                alt={categories.find(cat => cat.slug === 'brakes-drivetrain')!.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="bg-gray-600 h-full flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-3xl font-bold mb-4">{categories.find(cat => cat.slug === 'brakes-drivetrain')?.name.toUpperCase()}</div>
                  <div className="text-sm opacity-80">Epic wide shot with depth and scale</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          {/* Vertical Typography */}
          <div className="relative h-full flex items-center">
            <div className="w-full px-16">
              <div className="text-center">
                <div className="text-orange-400 text-9xl font-bold mb-8">06</div>
                <h2 className="text-7xl lg:text-8xl font-display font-black text-white mb-8 leading-tight">
                  {categories.find(cat => cat.slug === 'brakes-drivetrain')?.name.split(' ').map((word, i) => (
                    <div key={i} className="block">{word}</div>
                  ))}
                </h2>
                <p className="text-white/90 text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
                  {categories.find(cat => cat.slug === 'brakes-drivetrain')?.description}
                </p>
                <Link 
                  href={`/category/${categories.find(cat => cat.slug === 'brakes-drivetrain')?.slug}`}
                  className="group inline-flex items-center px-12 py-6 bg-white text-steel-900 text-xl font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Complete Collection
                  <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 7: CONTROLS & ACCESSORIES - Macro Detail Hero */}
      {categories.find(cat => cat.slug === 'controls-accessories') && (
        <div className="section-snap relative h-screen">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/assets/controls-accessories-red-footpegs.JPG"
              alt="Controls & Accessories - Precision Engineering"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          </div>
          
          {/* Content - Bottom Center */}
          <div className="relative h-full flex items-end justify-center pb-24">
            <div className="text-center max-w-4xl px-8">
              <div className="inline-block px-8 py-4 bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 text-sm font-bold uppercase tracking-[0.3em] rounded-full mb-8">
                Precision Control
              </div>
              <h2 className="text-6xl lg:text-8xl font-display font-black text-white mb-8 leading-tight">
                {categories.find(cat => cat.slug === 'controls-accessories')?.name}
              </h2>
              <p className="text-white/90 text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
                {categories.find(cat => cat.slug === 'controls-accessories')?.description}
              </p>
              <Link 
                href={`/category/${categories.find(cat => cat.slug === 'controls-accessories')?.slug}`}
                className="group inline-flex items-center px-12 py-6 bg-red-500 text-white text-xl font-bold rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Explore Controls
                <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 8: FULL BLEED HORIZONTAL SPLIT - Maintenance & Tools */}
      {categories.find(cat => cat.slug === 'maintenance-tools') && (
        <div className="section-snap relative h-screen flex">
          {/* Content Side */}
          <div className="w-1/2 bg-white flex items-center">
            <div className="p-16 lg:p-24">
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold uppercase tracking-wider mb-8">
                08
              </div>
              <h2 className="text-6xl lg:text-7xl font-display font-black text-steel-900 mb-8 leading-tight">
                {categories.find(cat => cat.slug === 'maintenance-tools')?.name}
              </h2>
              <p className="text-2xl text-steel-600 leading-relaxed mb-12 max-w-lg">
                {categories.find(cat => cat.slug === 'maintenance-tools')?.description}
              </p>
              <Link 
                href={`/category/${categories.find(cat => cat.slug === 'maintenance-tools')?.slug}`}
                className="group inline-flex items-center px-12 py-6 bg-steel-900 text-white text-xl font-bold rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Explore Collection
                <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
          
          {/* Image Side */}
          <div className="w-1/2 relative overflow-hidden">
            <Image
              src="/images/assets/maintenance-tools-workshop-gear.JPG"
              alt="Maintenance & Tools - Workshop Setup"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30"></div>
          </div>
        </div>
      )}

      {/* DUAL HERO: SPECIALTY VEHICLES & ELECTRICAL LIGHTING - Split Screen Innovation */}
      {categories.find(cat => cat.slug === 'specialty-vehicles') && categories.find(cat => cat.slug === 'electrical-lighting') && (
        <div className="section-snap relative h-screen overflow-hidden">
          {/* Split Container */}
          <div className="relative h-full flex">
            
            {/* LEFT SIDE - SPECIALTY VEHICLES */}
            <div className="group w-1/2 relative overflow-hidden cursor-pointer transition-all duration-700 hover:w-3/5">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/assets/specialty-vehicles-utv-rock-crawling.JPG"
                  alt="Specialty Vehicles - UTV Rock Crawling"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-700"></div>
              </div>
              
              {/* Floating Number Badge */}
              <div className="absolute top-12 left-12 z-20">
                <div className="w-20 h-20 bg-orange-500/20 backdrop-blur-sm border-2 border-orange-500 rounded-full flex items-center justify-center transform group-hover:scale-125 transition-all duration-500">
                  <span className="text-orange-400 text-2xl font-black">09</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center p-12 z-10">
                <div className="max-w-lg transform group-hover:translate-x-4 transition-all duration-700">
                  <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-tight opacity-90 group-hover:opacity-100 transition-all duration-500">
                    {categories.find(cat => cat.slug === 'specialty-vehicles')?.name.split(' ').map((word, i) => (
                      <span key={i} className={`block ${i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500' : ''} transform transition-all duration-500 delay-${i * 100}`}>
                        {word}
                      </span>
                    ))}
                  </h2>
                  
                  <p className="text-white/80 text-lg mb-8 leading-relaxed transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                    {categories.find(cat => cat.slug === 'specialty-vehicles')?.description}
                  </p>
                  
                  <Link 
                    href={`/category/${categories.find(cat => cat.slug === 'specialty-vehicles')?.slug}`}
                    className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-300 hover:bg-orange-600"
                  >
                    Explore Vehicles
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 border-r-4 border-orange-500/0 group-hover:border-orange-500/60 transition-all duration-700"></div>
            </div>
            
            {/* RIGHT SIDE - ELECTRICAL & LIGHTING */}
            <div className="group w-1/2 relative overflow-hidden cursor-pointer transition-all duration-700 hover:w-3/5">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/assets/electrical-lighting-extreme-wall-ride.JPG"
                  alt="Electrical & Lighting - Extreme Performance"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/30 group-hover:from-black/60 group-hover:via-black/40 group-hover:to-black/20 transition-all duration-700"></div>
              </div>
              
              {/* Floating Number Badge */}
              <div className="absolute top-12 right-12 z-20">
                <div className="w-20 h-20 bg-cyan-500/20 backdrop-blur-sm border-2 border-cyan-500 rounded-full flex items-center justify-center transform group-hover:scale-125 transition-all duration-500">
                  <span className="text-cyan-400 text-2xl font-black">10</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center justify-end p-12 z-10">
                <div className="max-w-lg text-right transform group-hover:-translate-x-4 transition-all duration-700">
                  <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-tight opacity-90 group-hover:opacity-100 transition-all duration-500">
                    {categories.find(cat => cat.slug === 'electrical-lighting')?.name.split(' ').map((word, i) => (
                      <span key={i} className={`block ${i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : ''} transform transition-all duration-500 delay-${i * 100}`}>
                        {word}
                      </span>
                    ))}
                  </h2>
                  
                  <p className="text-white/80 text-lg mb-8 leading-relaxed transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                    {categories.find(cat => cat.slug === 'electrical-lighting')?.description}
                  </p>
                  
                  <Link 
                    href={`/category/${categories.find(cat => cat.slug === 'electrical-lighting')?.slug}`}
                    className="inline-flex items-center px-8 py-4 bg-cyan-500 text-white font-bold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-300 hover:bg-cyan-600"
                  >
                    Illuminate Your Ride
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 border-l-4 border-cyan-500/0 group-hover:border-cyan-500/60 transition-all duration-700"></div>
            </div>
          </div>
          
          {/* Center Divider with Interactive Element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="w-1 h-32 bg-gradient-to-b from-orange-500 via-white to-cyan-500 rounded-full shadow-2xl">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Floating Category Labels */}
          <div className="absolute bottom-12 left-12 z-20">
            <div className="px-6 py-3 bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 text-orange-400 text-sm font-bold uppercase tracking-wider rounded-full">
              Off-Road Domination
            </div>
          </div>
          
          <div className="absolute bottom-12 right-12 z-20">
            <div className="px-6 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40 text-cyan-400 text-sm font-bold uppercase tracking-wider rounded-full">
              Electric Performance
            </div>
          </div>
        </div>
      )}


      {/* EXTREME ACTION CTA */}
      <div className="section-snap relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/assets/utv-action-dust-dramatic.JPG"
            alt="Extreme Off-Road Action"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
        
        {/* Dynamic Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-8">
            <div className="inline-block px-8 py-4 bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 text-orange-400 text-sm font-bold uppercase tracking-[0.3em] rounded-full mb-8">
              Extreme Performance
            </div>
            <h2 className="text-7xl md:text-9xl font-display font-black text-white mb-8 leading-[0.9] transform -skew-y-1">
              Push
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 transform skew-y-2">
                Limits
              </span>
            </h2>
            <p className="text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              From street to track, dirt to dunes. Every part engineered for riders who demand more.
            </p>
            
            {/* Split CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/products"
                className="group inline-flex items-center px-12 py-6 bg-orange-500 text-white text-xl font-bold rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Shop All Products
                <ArrowRight className="ml-4 h-6 w-6 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link 
                href="/contact"
                className="group inline-flex items-center px-12 py-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xl font-bold rounded-full hover:bg-white/20 transition-all duration-300"
              >
                Get Expert Help
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}