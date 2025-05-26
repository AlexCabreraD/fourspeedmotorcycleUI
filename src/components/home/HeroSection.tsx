// src/components/home/HeroSection.tsx
import React from 'react';

// Hero Section Component
export default function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://cdn.wpsstatic.com/images/1af0-5ce581773c22c.jpg)'
                }}
            ></div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/80"></div>

            {/* Hero Content */}
            <div className="relative flex items-center min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
                    <div className="max-w-2xl">
                        {/* Text Content */}
                        <div className="text-white">
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                                Premium Parts for
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  {' '}Every Ride
                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Discover thousands of high-quality motorcycle, ATV, and powersports parts from trusted brands.
                                Get the performance and reliability you need.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-lg transition-colors">
                                    Browse Categories
                                </button>
                                <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-all">
                                    View Deals
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search parts by name or SKU..."
                                    className="w-full px-6 py-4 pr-14 rounded-lg bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 text-lg"
                                />
                                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-3xl font-bold mb-2 text-yellow-400">50,000+</div>
                            <div className="text-sm uppercase tracking-wide">Quality Parts</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-2 text-yellow-400">500+</div>
                            <div className="text-sm uppercase tracking-wide">Trusted Brands</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-2 text-yellow-400">Fast</div>
                            <div className="text-sm uppercase tracking-wide">Shipping</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-2 text-yellow-400">Expert</div>
                            <div className="text-sm uppercase tracking-wide">Support</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}