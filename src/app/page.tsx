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

      {/* Newsletter & CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Stay Updated with the Latest Parts & Deals
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get exclusive offers, new product alerts, and motorcycle maintenance tips delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-steel-900 focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
            <button className="btn bg-accent-600 text-white hover:bg-accent-700 px-6 py-3 rounded-md font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-steel-900 mb-4">
              Why Choose 4SpeedMotorcycle?
            </h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              We&apos;ve been the trusted source for motorcycle enthusiasts since 1995, providing quality parts, 
              expert advice, and exceptional customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-steel-900 mb-2">Quality Guaranteed</h3>
              <p className="text-steel-600">
                All parts backed by manufacturer warranties and our quality guarantee.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-steel-900 mb-2">Fast Shipping</h3>
              <p className="text-steel-600">
                Free shipping over $99 with most orders shipping same day.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-steel-900 mb-2">Expert Support</h3>
              <p className="text-steel-600">
                Our motorcycle experts are here to help you find the right parts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-steel-900 mb-2">Trusted by Riders</h3>
              <p className="text-steel-600">
                Over 50,000 satisfied customers and thousands of 5-star reviews.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/about"
              className="btn btn-primary btn-lg inline-flex items-center"
            >
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}