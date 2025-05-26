// src/components/layout/Navigation.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, User, Heart, Phone } from 'lucide-react';

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigationLinks = [
        { name: 'Categories', href: '#categories' },
        { name: 'Brands', href: '#brands' },
        { name: 'Deals', href: '#deals' },
        { name: 'New Arrivals', href: '#new' },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20'
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                                    isScrolled ? 'text-gray-900' : 'text-white'
                                }`}>
                                    <span className="text-yellow-500">4Speed</span>
                                    <span className={isScrolled ? 'text-gray-900' : 'text-white'}>Motorcycle</span>
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navigationLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`font-medium transition-colors duration-300 hover:text-yellow-500 ${
                                        isScrolled ? 'text-gray-700' : 'text-white/90'
                                    }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className={`hidden lg:flex items-center transition-all duration-300 ${
                            isSearchOpen ? 'w-80' : 'w-64'
                        }`}>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search parts, SKUs..."
                                    className={`w-full px-4 py-2 pr-10 rounded-lg border-0 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
                                        isScrolled
                                            ? 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                            : 'bg-white/20 backdrop-blur-sm text-white placeholder-white/70'
                                    }`}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setIsSearchOpen(false)}
                                />
                                <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                                    isScrolled ? 'text-gray-500' : 'text-white/70'
                                }`} />
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Search Icon - Mobile */}
                            <button className={`lg:hidden p-2 rounded-lg transition-colors ${
                                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                            }`}>
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Account */}
                            <button className={`hidden sm:flex p-2 rounded-lg transition-colors ${
                                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                            }`}>
                                <User className="w-5 h-5" />
                            </button>

                            {/* Wishlist */}
                            <button className={`hidden sm:flex p-2 rounded-lg transition-colors relative ${
                                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                            }`}>
                                <Heart className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* Cart */}
                            <button className={`p-2 rounded-lg transition-colors relative ${
                                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                            }`}>
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    2
                                </span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden p-2 rounded-lg transition-colors ${
                                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                                }`}
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/20">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            {/* Mobile Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search parts, SKUs..."
                                        className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="space-y-2">
                                {navigationLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="block px-4 py-3 text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>

                            {/* Mobile Account Links */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="space-y-2">
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                        <User className="w-5 h-5 mr-3" />
                                        My Account
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Heart className="w-5 h-5 mr-3" />
                                        Wishlist (3)
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Phone className="w-5 h-5 mr-3" />
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from jumping when nav becomes fixed */}
            <div className="h-0"></div>
        </>
    );
}