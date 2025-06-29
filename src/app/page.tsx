"use client";

import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronLeft, ChevronRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

const FourSpeedHomepage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const vehicleTypes = [
        { name: 'Sport Bikes', image: 'https://placehold.co/200x150/1f2937/fff?text=Sport' },
        { name: 'Cruisers', image: 'https://placehold.co/200x150/1f2937/fff?text=Cruiser' },
        { name: 'Touring', image: 'https://placehold.co/200x150/1f2937/fff?text=Touring' },
        { name: 'Adventure', image: 'https://placehold.co/200x150/1f2937/fff?text=Adventure' },
        { name: 'Classic', image: 'https://placehold.co/200x150/1f2937/fff?text=Classic' }
    ];

    const newProducts = [
        { name: 'High-Performance Spark Plugs', price: '$89.95', originalPrice: '$109.95', image: 'https://placehold.co/200x200/1f2937/fff?text=Spark+Plugs' },
        { name: 'Premium Oil Filters', price: '$24.95', originalPrice: '$29.95', image: 'https://placehold.co/200x200/1f2937/fff?text=Oil+Filter' },
        { name: 'Carbon Fiber Air Filters', price: '$149.95', originalPrice: '$179.95', image: 'https://placehold.co/200x200/1f2937/fff?text=Air+Filter' },
        { name: 'Performance Brake Pads', price: '$79.95', originalPrice: '$94.95', image: 'https://placehold.co/200x200/1f2937/fff?text=Brake+Pads' }
    ];

    const galleryImages = Array(8).fill(null).map((_, i) =>
        `https://placehold.co/150x150/1f2937/fff?text=Ride+${i + 1}`
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            {/*<header className="bg-white shadow-lg sticky top-0 z-50">*/}
            {/*    /!* Top Bar *!/*/}
            {/*    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm py-2">*/}
            {/*        <div className="container mx-auto px-4 flex justify-between items-center">*/}
            {/*            <span className="flex items-center gap-2">*/}
            {/*                <Truck className="h-4 w-4" />*/}
            {/*                FREE SHIPPING OVER $99 | ORDERS SHIP WITHIN 24 HOURS*/}
            {/*            </span>*/}
            {/*            <span>Contact Us | 1-800-4SPEED</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* Main Header *!/*/}
            {/*    <div className="container mx-auto px-4 py-4">*/}
            {/*        <div className="flex items-center justify-between">*/}
            {/*            <div className="flex items-center space-x-2">*/}
            {/*                <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-2 rounded-lg">*/}
            {/*                    <Zap className="h-8 w-8" />*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">*/}
            {/*                        4SPEED*/}
            {/*                    </h1>*/}
            {/*                    <p className="text-sm text-gray-600 font-medium">MOTORCYCLE</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            <nav className="hidden md:flex space-x-8">*/}
            {/*                <a href="#" className="text-gray-800 hover:text-red-600 font-medium transition-colors">Parts</a>*/}
            {/*                <a href="#" className="text-gray-800 hover:text-red-600 font-medium transition-colors">Accessories</a>*/}
            {/*                <a href="#" className="text-gray-800 hover:text-red-600 font-medium transition-colors">Gear</a>*/}
            {/*                <a href="#" className="text-gray-800 hover:text-red-600 font-medium transition-colors">Brands</a>*/}
            {/*                <a href="#" className="text-gray-800 hover:text-red-600 font-medium transition-colors">Support</a>*/}
            {/*            </nav>*/}

            {/*            <div className="flex items-center space-x-4">*/}
            {/*                <div className="relative">*/}
            {/*                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />*/}
            {/*                    <input*/}
            {/*                        type="text"*/}
            {/*                        placeholder="Search parts..."*/}
            {/*                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">*/}
            {/*                    <User className="h-6 w-6" />*/}
            {/*                </button>*/}
            {/*                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors relative">*/}
            {/*                    <ShoppingCart className="h-6 w-6" />*/}
            {/*                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</header>*/}

            <Navigation/>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <div className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                NEW ARRIVALS
                            </div>
                            <h1 className="text-6xl font-bold mb-6 leading-tight">
                                EVERY RIDE,<br />
                                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                    EVERY MILE
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Premium motorcycle parts and accessories for riders who demand performance, reliability, and style.
                            </p>
                            <div className="flex space-x-4">
                                <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Shop Now
                                </button>
                                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200">
                                    View Catalog
                                </button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <img
                                    src="https://placehold.co/600x400/1f2937/fff?text=Hero+Motorcycle"
                                    alt="Hero Motorcycle"
                                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Part Finder */}
            <section className="bg-gray-900 text-white py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">PART FINDER</h2>
                        <p className="text-gray-300 text-lg">Find the perfect parts for your motorcycle in seconds</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-5xl w-full border border-white/20">
                            <div className="flex space-x-4">
                                <select className="flex-1 px-6 py-4 bg-white text-black rounded-xl font-medium focus:ring-2 focus:ring-red-500">
                                    <option>Select Year</option>
                                </select>
                                <select className="flex-1 px-6 py-4 bg-white text-black rounded-xl font-medium focus:ring-2 focus:ring-red-500">
                                    <option>Select Make</option>
                                </select>
                                <select className="flex-1 px-6 py-4 bg-white text-black rounded-xl font-medium focus:ring-2 focus:ring-red-500">
                                    <option>Select Model</option>
                                </select>
                                <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Find Parts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore by Vehicle */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
                        EXPLORE BY <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">MOTORCYCLE TYPE</span>
                    </h2>

                    <div className="grid grid-cols-5 gap-8">
                        {vehicleTypes.map((vehicle, index) => (
                            <div key={index} className="text-center group cursor-pointer">
                                <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg hover:shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-200">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="w-full h-32 object-cover rounded-xl mb-4"
                                    />
                                    <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-500 mx-auto rounded-full"></div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">{vehicle.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Performance & Maintenance */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="relative group cursor-pointer">
                            <img
                                src="https://placehold.co/500x300/1f2937/fff?text=Performance+Parts"
                                alt="Performance Parts"
                                className="w-full h-80 object-cover rounded-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl group-hover:from-red-900/80 transition-all duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white p-8">
                                    <h3 className="text-3xl font-bold mb-4">PERFORMANCE PARTS</h3>
                                    <p className="mb-8 text-lg">Unlock your bike's true potential with our high-performance upgrades and racing components.</p>
                                    <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                        Boost Performance
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative group cursor-pointer">
                            <img
                                src="https://placehold.co/500x300/1f2937/fff?text=Maintenance+Parts"
                                alt="Maintenance Parts"
                                className="w-full h-80 object-cover rounded-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl group-hover:from-orange-900/80 transition-all duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white p-8">
                                    <h3 className="text-3xl font-bold mb-4">MAINTENANCE</h3>
                                    <p className="mb-8 text-lg">Keep your ride running smooth with our premium maintenance parts and fluids.</p>
                                    <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                        Shop Maintenance
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">
                            NEW <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">ARRIVALS</span>
                        </h2>
                        <p className="text-gray-600 text-lg">Latest products to enhance your riding experience</p>
                    </div>

                    <div className="grid grid-cols-4 gap-8">
                        {newProducts.map((product, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden group">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        Sale
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{product.name}</h3>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <span className="text-xl font-bold text-red-600">{product.price}</span>
                                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                                    </div>
                                    <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Built for Riders */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <img
                                    src="https://placehold.co/600x400/1f2937/fff?text=Built+for+Riders"
                                    alt="Built for Riders"
                                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                            </div>
                        </div>
                        <div className="flex-1 pl-16">
                            <div className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                OUR STORY
                            </div>
                            <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                BUILT FOR RIDERS,<br />
                                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                                    BUILT TO LAST
                                </span>
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                With over 25 years in the motorcycle industry, 4SpeedMotorcycle is your trusted partner for premium parts and accessories. We source the highest quality components and provide expert knowledge to keep you riding with confidence and style.
                            </p>
                            <div className="flex space-x-4">
                                <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Our Story
                                </button>
                                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-red-500 hover:text-red-600 transition-all duration-200">
                                    Quality Promise
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Connect with Us */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            CONNECT WITH <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">US</span>
                        </h2>
                        <p className="text-gray-300 text-lg">Join our community of passionate riders</p>
                    </div>

                    <div className="relative">
                        <div className="flex space-x-6 overflow-hidden">
                            {galleryImages.map((image, index) => (
                                <div key={index} className="flex-shrink-0 group">
                                    <img
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-40 h-40 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 shadow-lg hover:bg-white/30 transition-all">
                            <ChevronLeft className="h-6 w-6 text-white" />
                        </button>
                        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 shadow-lg hover:bg-white/30 transition-all">
                            <ChevronRight className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                                <Zap className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">FOR THE RIDERS</h3>
                            <p className="text-gray-600">Premium parts for riders who demand peak performance and reliability on every journey.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                                <Truck className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">FREE SHIPPING</h3>
                            <p className="text-gray-600">Fast, free shipping on orders over $99 - delivered straight to your garage.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                                <Shield className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">EXPERT SUPPORT</h3>
                            <p className="text-gray-600">Our motorcycle experts are here to help you find the perfect parts for your ride.</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                                <RotateCcw className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">EASY RETURNS</h3>
                            <p className="text-gray-600">Hassle-free returns within 30 days. Your satisfaction is our priority.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-2 rounded-lg">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        4SPEED
                                    </div>
                                    <p className="text-sm text-gray-400">MOTORCYCLE</p>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-6">Premium motorcycle parts and accessories for riders who demand the best.</p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold">f</span>
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold">t</span>
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold">i</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white">SHOP</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Performance Parts</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Maintenance</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Accessories</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Riding Gear</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Special Offers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white">COMPANY</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Dealer Program</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Press</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Reviews</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white">SUPPORT</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Shipping Info</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Returns & Warranty</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Installation Guides</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400">© 2025 4SpeedMotorcycle. All rights reserved.</p>
                            <div className="flex space-x-6 text-sm">
                                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Terms of Service</a>
                                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Sitemap</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FourSpeedHomepage;