// src/app/page.tsx
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import PopularItemsSection from '@/components/home/PopularItemsSection';
import DealsSection from '@/components/home/DealsSection';

export default function HomePage() {
  return (
      <div className="min-h-screen bg-white">
        {/* Navigation will be added later */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">4SpeedMotorcycle</h1>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Brands</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Deals</a>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-700 hover:text-gray-900">
                    <span className="sr-only">Search</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button className="text-gray-700 hover:text-gray-900">
                    <span className="sr-only">Cart</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8 9m0 0h9.6M19 7h-2M9 9v6m4-6v6m4-6v6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <HeroSection />
          <CategoriesSection />
          <PopularItemsSection />
          <DealsSection />
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">4SpeedMotorcycle</h3>
                <p className="text-gray-300 text-sm">
                  Your trusted partner for motorcycle, ATV, and powersports parts and accessories.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-4">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">Suspension</a></li>
                  <li><a href="#" className="hover:text-white">Engine</a></li>
                  <li><a href="#" className="hover:text-white">Electrical</a></li>
                  <li><a href="#" className="hover:text-white">Exhaust</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                  <li><a href="#" className="hover:text-white">Returns</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="#" className="hover:text-white">Newsletter</a></li>
                  <li><a href="#" className="hover:text-white">Facebook</a></li>
                  <li><a href="#" className="hover:text-white">Instagram</a></li>
                  <li><a href="#" className="hover:text-white">YouTube</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 4SpeedMotorcycle. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}