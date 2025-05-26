// src/components/home/PopularItemsSection.tsx
import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';

interface PopularItem {
    id: string;
    name: string;
    sku: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    category: string;
    inStock: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
}

const popularItems: PopularItem[] = [
    {
        id: '1',
        name: 'Multirate Fork Springs Kit',
        sku: '015-01001',
        brand: 'PROGRESSIVE',
        price: 92.18,
        originalPrice: 126.95,
        rating: 4.8,
        reviewCount: 127,
        category: 'Suspension',
        inStock: true,
        isBestSeller: true
    },
    {
        id: '2',
        name: 'High Performance Air Filter',
        sku: 'AF-2401',
        brand: 'K&N',
        price: 64.99,
        rating: 4.7,
        reviewCount: 89,
        category: 'Air Filters',
        inStock: true,
        isNew: true
    },
    {
        id: '3',
        name: 'Premium Brake Pads Set',
        sku: 'BP-7832',
        brand: 'EBC',
        price: 78.50,
        originalPrice: 95.00,
        rating: 4.9,
        reviewCount: 156,
        category: 'Brakes',
        inStock: true,
        isBestSeller: true
    },
    {
        id: '4',
        name: 'LED Headlight Assembly',
        sku: 'LED-4401',
        brand: 'JW SPEAKER',
        price: 289.99,
        rating: 4.6,
        reviewCount: 73,
        category: 'Electrical',
        inStock: true
    },
    {
        id: '5',
        name: 'Chain & Sprocket Kit',
        sku: 'CSK-1205',
        brand: 'JT',
        price: 124.99,
        originalPrice: 149.99,
        rating: 4.7,
        reviewCount: 94,
        category: 'Drive',
        inStock: true
    },
    {
        id: '6',
        name: 'Performance Exhaust System',
        sku: 'EX-9901',
        brand: 'FMF',
        price: 445.00,
        rating: 4.8,
        reviewCount: 112,
        category: 'Exhaust',
        inStock: true,
        isNew: true
    },
    {
        id: '7',
        name: 'Racing Clutch Kit',
        sku: 'CK-5567',
        brand: 'HINSON',
        price: 198.75,
        originalPrice: 225.00,
        rating: 4.9,
        reviewCount: 68,
        category: 'Clutch',
        inStock: true,
        isBestSeller: true
    },
    {
        id: '8',
        name: 'Sport Touring Windscreen',
        sku: 'WS-3340',
        brand: 'PUIG',
        price: 156.99,
        rating: 4.5,
        reviewCount: 45,
        category: 'Windshield/Windscreen',
        inStock: true
    }
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
                />
            ))}
        </div>
    );
}

export default function PopularItemsSection() {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-32 left-16 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute top-48 right-24 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="absolute bottom-32 left-32 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-48 right-16 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-yellow-300">Customer Favorites</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Popular </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                            Items
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Discover our most sought-after parts and accessories, trusted by riders worldwide.
                    </p>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {popularItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="group bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/20 rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Product Image */}
                            <div className="aspect-square bg-gradient-to-br from-gray-700/50 to-gray-800/50 relative overflow-hidden">
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                    {item.isBestSeller && (
                                        <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-red-400/50">
                                            Best Seller
                                        </span>
                                    )}
                                    {item.isNew && (
                                        <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-green-400/50">
                                            New
                                        </span>
                                    )}
                                    {item.originalPrice && (
                                        <span className="bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full border border-yellow-400/50">
                                            Sale
                                        </span>
                                    )}
                                </div>

                                {/* Placeholder for product image */}
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-12 h-12 bg-white/40 rounded-lg"></div>
                                    </div>
                                </div>

                                {/* Quick Action Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <div className="flex space-x-3">
                                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl border border-white/30 hover:bg-white/30 transition-colors">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl border border-white/30 hover:bg-white/30 transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                {/* Brand & Category */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">
                                        {item.brand}
                                    </span>
                                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Product Name */}
                                <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
                                    {item.name}
                                </h3>

                                {/* SKU */}
                                <p className="text-sm text-gray-400 mb-3">SKU: {item.sku}</p>

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <StarRating rating={item.rating} />
                                    <span className="text-sm text-gray-400">
                                        ({item.reviewCount})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-bold text-white">
                                            ${item.price.toFixed(2)}
                                        </span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ${item.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {item.originalPrice && (
                                        <span className="text-sm font-semibold text-green-400">
                                            Save ${(item.originalPrice - item.price).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status & Add to Cart */}
                                <div className="flex flex-col space-y-3">
                                    <span className={`text-sm font-medium ${
                                        item.inStock ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {item.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                                    </span>
                                    <button
                                        disabled={!item.inStock}
                                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                                            item.inStock
                                                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black hover:scale-105 hover:shadow-lg'
                                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <button className="group bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center">
                        View All Popular Items
                        <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}