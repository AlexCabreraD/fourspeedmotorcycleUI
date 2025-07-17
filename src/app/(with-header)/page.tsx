import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, Phone, Star, ChevronDown } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TrustBadges from '@/components/home/TrustBadges'

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden -mt-[72px]">
      {/* ORIGINAL HERO SECTION */}
      <HeroSection />

      {/* TRUST BADGES */}
      <TrustBadges />

      {/* FEATURED CATEGORIES */}
      <FeaturedCategories />

      {/* CRAFTMANSHIP SECTION - Full Bleed Split */}
      <div className="relative h-screen flex">
        {/* Image Side */}
        <div className="w-1/2 relative overflow-hidden">
          <Image
            src="/images/assets/craftsmanship-workshop-mechanic.JPG"
            alt="Expert Craftsmanship"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
        </div>
        
        {/* Content Side */}
        <div className="w-1/2 bg-white flex items-center">
          <div className="p-16 lg:p-24">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold uppercase tracking-wider mb-8">
              Our Promise
            </div>
            <h2 className="text-5xl lg:text-6xl font-display font-black text-steel-900 mb-8 leading-tight">
              Expert
              <span className="block text-orange-600">Craftsmanship</span>
            </h2>
            <p className="text-xl text-steel-600 leading-relaxed mb-8 max-w-lg">
              Every part we sell is carefully selected by motorcycle experts who understand 
              the demands of performance riding. Quality isn't just a promise—it's our standard.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4"></div>
                <span className="text-steel-700 font-medium">Rigorous quality testing on every product</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4"></div>
                <span className="text-steel-700 font-medium">Expert installation guidance included</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-4"></div>
                <span className="text-steel-700 font-medium">Full manufacturer warranties honored</span>
              </div>
            </div>
            
            <Link 
              href="/about"
              className="group inline-flex items-center px-10 py-4 bg-steel-900 text-white text-lg font-bold rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              Our Story
              <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <FeaturedProducts />

      {/* PERFORMANCE SECTION - Diagonal Layout */}
      <div className="relative h-screen overflow-hidden bg-steel-900">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/assets/performance-harley-vintage-engine.JPG"
            alt="Performance Engineering"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </div>
        
        {/* Diagonal Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="bg-white/95 backdrop-blur-sm w-full transform -skew-y-2 origin-bottom-left p-24 pb-32">
            <div className="transform skew-y-2 max-w-4xl">
              <div className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-bold uppercase tracking-wider mb-6">
                Performance Driven
              </div>
              <h2 className="text-5xl lg:text-6xl font-display font-black text-steel-900 mb-6">
                Built for the Track
                <span className="block text-orange-600">Proven on the Street</span>
              </h2>
              <p className="text-xl text-steel-600 mb-8 max-w-3xl leading-relaxed">
                From weekend warriors to professional racers, our parts deliver the performance 
                you need when it matters most. Every component tested under real-world conditions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5000+</div>
                  <div className="text-steel-600">Race Miles Tested</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                  <div className="text-steel-600">Performance Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-steel-600">Support Available</div>
                </div>
              </div>
              
              <Link 
                href="/products"
                className="group inline-flex items-center px-10 py-4 border-2 border-steel-900 text-steel-900 text-lg font-bold rounded-full hover:bg-steel-900 hover:text-white transition-all duration-300"
              >
                Shop Performance Parts
                <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA - Detail Focus */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/assets/precision-handlebar-detail.JPG"
            alt="Precision Details"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        
        {/* Floating Content Card */}
        <div className="relative h-full flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-16 max-w-2xl text-center">
            <h2 className="text-5xl font-display font-black text-white mb-6">
              Ready to Ride?
            </h2>
            <p className="text-white/90 text-xl mb-10 leading-relaxed">
              Join thousands of riders who trust 4SpeedMotorcycle for their performance needs. 
              Premium parts, expert support, unmatched quality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/categories"
                className="group inline-flex items-center px-10 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all duration-300 text-lg"
              >
                Start Shopping
                <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/contact"
                className="group inline-flex items-center px-10 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 text-lg"
              >
                Get Expert Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}