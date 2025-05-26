"use client"

// src/components/home/DealsSection.tsx
import React from 'react';

interface DealItem {
    id: string;
    name: string;
    sku: string;
    brand: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    category: string;
    inStock: boolean;
    stockCount?: number;
    dealType: 'clearance' | 'seasonal' | 'flash' | 'bulk';
    dealEnds?: string;
    features?: string[];
}

const dealItems: DealItem[] = [
    {
        id: '1',
        name: 'Pro Racing Suspension Kit',
        sku: 'PSK-4401',
        brand: 'RACE TECH',
        originalPrice: 599.99,
        salePrice: 399.99,
        discount: 33,
        category: 'Suspension',
        inStock: true,
        stockCount: 8,
        dealType: 'clearance',
        dealEnds: '2025-06-15',
        features: ['Complete kit', 'Adjustable compression', 'Lifetime warranty']
    },
    {
        id: '2',
        name: 'Performance Exhaust System',
        sku: 'PES-7890',
        brand: 'YOSHIMURA',
        originalPrice: 789.99,
        salePrice: 549.99,
        discount: 30,
        category: 'Exhaust',
        inStock: true,
        stockCount: 5,
        dealType: 'seasonal',
        features: ['Stainless steel', '+8hp gain', 'Race-proven']
    },
    {
        id: '3',
        name: 'LED Light Bar Kit',
        sku: 'LLB-2234',
        brand: 'RIGID',
        originalPrice: 299.99,
        salePrice: 199.99,
        discount: 33,
        category: 'Electrical',
        inStock: true,
        dealType: 'flash',
        dealEnds: '2025-05-30',
        features: ['50" light bar', 'Spot/flood combo', 'IP68 rated']
    },
    {
        id: '4',
        name: 'Heavy Duty Clutch Kit',
        sku: 'HDC-5567',
        brand: 'HINSON',
        originalPrice: 449.99,
        salePrice: 299.99,
        discount: 33,
        category: 'Clutch',
        inStock: true,
        stockCount: 12,
        dealType: 'bulk',
        features: ['Billet construction', 'Race-ready', '2-year warranty']
    }
];

function CountdownTimer({ endDate }: { endDate: string }) {
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0 });

    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const difference = end - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <div className="flex items-center space-x-2 text-sm">
            <span className="text-red-600 font-medium">Ends in:</span>
            <div className="flex space-x-1">
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-xs">
          {timeLeft.days}d
        </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-xs">
          {timeLeft.hours}h
        </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-xs">
          {timeLeft.minutes}m
        </span>
            </div>
        </div>
    );
}

function getDealBadge(dealType: string) {
    const badges = {
        clearance: { text: 'Clearance', color: 'bg-red-500' },
        seasonal: { text: 'Seasonal Sale', color: 'bg-orange-500' },
        flash: { text: 'Flash Deal', color: 'bg-purple-500' },
        bulk: { text: 'Bulk Discount', color: 'bg-green-500' }
    };

    return badges[dealType as keyof typeof badges] || badges.clearance;
}

export default function DealsSection() {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-red-50 via-white to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        <span>Hot Deals & Special Offers</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Limited Time Deals
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't miss out on these incredible savings! Limited quantities and time-sensitive offers.
                    </p>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {dealItems.map((item) => {
                        const badge = getDealBadge(item.dealType);
                        const savingsAmount = item.originalPrice - item.salePrice;

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Product Image */}
                                    <div className="lg:w-1/3 aspect-square lg:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 relative">
                                        {/* Deal Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                      <span className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        {badge.text}
                      </span>
                                        </div>

                                        {/* Discount Badge */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold">-{item.discount}%</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Placeholder for product image */}
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/60 rounded-lg flex items-center justify-center">
                                                <div className="w-12 h-12 bg-gray-400/50 rounded"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="lg:w-2/3 p-6">
                                        {/* Brand & Category */}
                                        <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        {item.brand}
                      </span>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                                        </div>

                                        {/* Product Name */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {item.name}
                                        </h3>

                                        {/* SKU */}
                                        <p className="text-sm text-gray-500 mb-3">SKU: {item.sku}</p>

                                        {/* Features */}
                                        {item.features && (
                                            <div className="mb-4">
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {item.features.map((feature, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Pricing */}
                                        <div className="mb-4">
                                            <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-bold text-red-600">
                          ${item.salePrice.toFixed(2)}
                        </span>
                                                <span className="text-lg text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                                            </div>
                                            <p className="text-green-600 font-semibold">
                                                You save ${savingsAmount.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Stock & Timer */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-green-600 font-medium text-sm">In Stock</span>
                                                {item.stockCount && item.stockCount <= 10 && (
                                                    <span className="text-orange-600 text-sm">
                            Only {item.stockCount} left!
                          </span>
                                                )}
                                            </div>
                                            {item.dealEnds && (
                                                <CountdownTimer endDate={item.dealEnds} />
                                            )}
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l-1.8 9m0 0h9.6" />
                                            </svg>
                                            <span>Add to Cart - Save ${savingsAmount.toFixed(2)}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Deals Button */}
                <div className="text-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center">
                        View All Deals & Clearance
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}