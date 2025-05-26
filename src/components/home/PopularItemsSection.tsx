// src/components/home/PopularItemsSection.tsx
import React from 'react';

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
                <svg
                    key={star}
                    className={`w-4 h-4 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function PopularItemsSection() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Popular Items
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover our most sought-after parts and accessories, trusted by riders worldwide.
                    </p>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {popularItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                    {item.isBestSeller && (
                                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Best Seller
                    </span>
                                    )}
                                    {item.isNew && (
                                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      New
                    </span>
                                    )}
                                    {item.originalPrice && (
                                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Sale
                    </span>
                                    )}
                                </div>

                                {/* Placeholder for product image */}
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                    <div className="w-24 h-24 bg-white/60 rounded-lg flex items-center justify-center">
                                        <div className="w-12 h-12 bg-gray-400/50 rounded"></div>
                                    </div>
                                </div>

                                {/* Quick Action Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                        Quick View
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                {/* Brand & Category */}
                                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {item.brand}
                  </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                                </div>

                                {/* Product Name */}
                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </h3>

                                {/* SKU */}
                                <p className="text-sm text-gray-500 mb-3">SKU: {item.sku}</p>

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mb-3">
                                    <StarRating rating={item.rating} />
                                    <span className="text-sm text-gray-600">
                    ({item.reviewCount})
                  </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                                        )}
                                    </div>
                                    {item.originalPrice && (
                                        <span className="text-sm font-semibold text-green-600">
                      Save ${(item.originalPrice - item.price).toFixed(2)}
                    </span>
                                    )}
                                </div>

                                {/* Stock Status & Add to Cart */}
                                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                      item.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                                    <button
                                        disabled={!item.inStock}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                            item.inStock
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center">
                        View All Popular Items
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}