import Link from 'next/link'
import { ArrowRight, Shield, Truck, Phone, Star } from 'lucide-react'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TrustBadges from '@/components/home/TrustBadges'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <FeaturedProducts />


      {/* Company Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-steel-900 mb-4">
              Why Choose 4SpeedMotorcycle?
            </h2>
            <p className="text-lg text-steel-600 max-w-3xl mx-auto">
              Trusted by riders since 1995. Premium parts, expert knowledge, unmatched service.
            </p>
          </div>

          {/* Clean Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-700 transition-colors duration-200">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-steel-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-steel-600 text-sm">
                All parts backed by manufacturer warranties and our quality guarantee.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-700 transition-colors duration-200">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-steel-900 mb-2">
                Fast Shipping
              </h3>
              <p className="text-steel-600 text-sm">
                Free shipping over $99 with most orders shipping same day.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-700 transition-colors duration-200">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-steel-900 mb-2">
                Expert Support
              </h3>
              <p className="text-steel-600 text-sm">
                Our motorcycle experts are here to help you find the right parts.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-600 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-700 transition-colors duration-200">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-steel-900 mb-2">
                Trusted by Riders
              </h3>
              <p className="text-steel-600 text-sm">
                Over 50,000 satisfied customers and thousands of 5-star reviews.
              </p>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}