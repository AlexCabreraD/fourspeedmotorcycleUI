// src/components/home/HeroSection.tsx
"use client"

import React, { useState } from 'react';
import { Search, Play, ArrowRight, Star, Shield, Truck, Headphones } from 'lucide-react';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Handle search functionality
    };

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
                style={{
                    backgroundImage: 'url(https://cdn.wpsstatic.com/images/1000_max/6dde-59cd72ea6f409.jpg)'
                }}
            ></div>

            {/* Animated Background Overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                {/* Animated particles/elements */}
                <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/20 rounded-full animate-bounce"></div>
                <div className="absolute bottom-40 left-20 w-1 h-1 bg-white/20 rounded-full animate-ping"></div>
            </div>

            {/* Hero Content */}
            <div className="relative flex items-center min-h-screen pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-white space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium text-yellow-300">Trusted by 50,000+ Riders</span>
                            </div>

                            {/* Main Heading */}
                            <div>
                                <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                                    Premium Parts for
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
                                        Every Adventure
                                    </span>
                                </h1>
                                <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
                                    Discover thousands of high-quality motorcycle, ATV, and powersports parts from trusted brands.
                                    Get the performance and reliability your ride deserves.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative max-w-lg">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search parts by name, SKU, or brand..."
                                        className="w-full px-6 py-4 pr-24 rounded-xl bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 text-lg shadow-lg"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Popular searches */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-300">Popular:</span>
                                    {['Suspension', 'Brake Pads', 'LED Lights', 'Exhaust'].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setSearchQuery(term)}
                                            className="text-sm text-yellow-300 hover:text-yellow-200 underline transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </form>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="group bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center">
                                    Browse Categories
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="group border-2 border-white/50 text-white hover:bg-white hover:text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="w-5 h-5 mr-2" />
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Feature Cards */}
                        <div className="hidden lg:block space-y-6">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-yellow-500/20 p-3 rounded-xl">
                                        <Shield className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Quality Guaranteed</h3>
                                        <p className="text-gray-300 text-sm">Premium parts from trusted brands</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-blue-500/20 p-3 rounded-xl">
                                        <Truck className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Fast Shipping</h3>
                                        <p className="text-gray-300 text-sm">Same-day shipping on most orders</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-green-500/20 p-3 rounded-xl">
                                        <Headphones className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Expert Support</h3>
                                        <p className="text-gray-300 text-sm">Get help from powersports experts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div className="group cursor-pointer">
                            <div className="text-3xl lg:text-4xl font-bold mb-2 text-yellow-400 group-hover:scale-110 transition-transform">
                                50,000+
                            </div>
                            <div className="text-sm uppercase tracking-wide text-gray-300">Quality Parts</div>
                        </div>
                        <div className="group cursor-pointer">
                            <div className="text-3xl lg:text-4xl font-bold mb-2 text-yellow-400 group-hover:scale-110 transition-transform">
                                500+
                            </div>
                            <div className="text-sm uppercase tracking-wide text-gray-300">Trusted Brands</div>
                        </div>
                        <div className="group cursor-pointer">
                            <div className="text-3xl lg:text-4xl font-bold mb-2 text-yellow-400 group-hover:scale-110 transition-transform">
                                24hr
                            </div>
                            <div className="text-sm uppercase tracking-wide text-gray-300">Fast Shipping</div>
                        </div>
                        <div className="group cursor-pointer">
                            <div className="text-3xl lg:text-4xl font-bold mb-2 text-yellow-400 group-hover:scale-110 transition-transform">
                                Expert
                            </div>
                            <div className="text-sm uppercase tracking-wide text-gray-300">Support Team</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-sm text-gray-300">Scroll to explore</span>
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}