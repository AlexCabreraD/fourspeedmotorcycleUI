"use client"

// src/components/home/DealsSection.tsx
import React from 'react';
import { Clock, Flame, ArrowRight, ShoppingCart, CheckCircle } from 'lucide-react';

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
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">Ends in:</span>
            <div className="flex space-x-1">
                <span className="bg-red-500/20 backdrop-blur-sm text-red-300 px-2 py-1 rounded border border-red-500/30 font-mono text-xs">
                    {timeLeft.days}d
                </span>
                <span className="bg-red-500/20 backdrop-blur-sm text-red-300 px-2 py-1 rounded border border-red-500/30 font-mono text-xs">
                    {timeLeft.hours}h
                </span>
                <span className="bg-red-500/20 backdrop-blur-sm text-red-300 px-2 py-1 rounded border border-red-500/30 font-mono text-xs">
                    {timeLeft.minutes}m
                </span>
            </div>
        </div>
    );
}

function getDealBadge(dealType: string) {
    const badges = {
        clearance: { text: 'Clearance', color: 'from-red-500/80 to-red-600', icon: '🔥' },
        seasonal: { text: 'Seasonal Sale', color: 'from-orange-500/80 to-orange-600', icon: '🌟' },
        flash: { text: 'Flash Deal', color: 'from-purple-500/80 to-purple-600', icon: '⚡' },
        bulk: { text: 'Bulk Discount', color: 'from-green-500/80 to-green-600', icon: '📦' }
    };

    return badges[dealType as keyof typeof badges] || badges.clearance;
}

export default function DealsSection() {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-black via-gray-900 to-red-900/20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-40 left-20 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-60 right-40 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 bg-red-500/20 border border-red-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                        <Flame className="w-5 h-5 text-red-400" />
                        <span className="text-sm font-bold text-red-300 uppercase tracking-wide">Hot Deals & Special Offers</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Limited Time </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 animate-pulse">
                            Deals
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Don't miss out on these incredible savings! Limited quantities and time-sensitive offers.
                    </p>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {dealItems.map((item, index) => {
                        const badge = getDealBadge(item.dealType);
                        const savingsAmount = item.originalPrice - item.salePrice;

                        return (
                            <div
                                key={item.id}
                                className="group bg-white/10 backdrop-blur-md border border-white/20 hover:border-red-500/50 hover:bg-white/20 rounded-3xl cursor-pointer overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Product Image */}
                                    <div className="lg:w-1/3 aspect-square lg:aspect-auto bg-gradient-to-br from-gray-700/50 to-gray-800/50 relative overflow-hidden">
                                        {/* Deal Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className={`bg-gradient-to-r ${badge.color} backdrop-blur-sm text-white text-sm font-bold px-3 py-2 rounded-full border border-white/20 flex items-center space-x-1`}>
                                                <span>{badge.icon}</span>
                                                <span>{badge.text}</span>
                                            </span>
                                        </div>

                                        {/* Discount Badge */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-red-500/90 backdrop-blur-sm text-white rounded-2xl w-20 h-20 flex items-center justify-center border border-red-400/50">
                                                <div className="text-center">
                                                    <div className="text-xl font-bold">-{item.discount}%</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Placeholder for product image */}
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                                <div className="w-12 h-12 bg-white/40 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="lg:w-2/3 p-8">
                                        {/* Brand & Category */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                                                {item.brand}
                                            </span>
                                            <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                                                {item.category}
                                            </span>
                                        </div>

                                        {/* Product Name */}
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                                            {item.name}
                                        </h3>

                                        {/* SKU */}
                                        <p className="text-sm text-gray-400 mb-4">SKU: {item.sku}</p>

                                        {/* Features */}
                                        {item.features && (
                                            <div className="mb-6">
                                                <ul className="text-sm text-gray-300 space-y-2">
                                                    {item.features.map((feature, featureIndex) => (
                                                        <li key={featureIndex} className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Pricing */}
                                        <div className="mb-6">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <span className="text-3xl font-bold text-red-400">
                                                    ${item.salePrice.toFixed(2)}
                                                </span>
                                                <span className="text-xl text-gray-500 line-through">
                                                    ${item.originalPrice.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-green-400 font-semibold text-lg">
                                                You save ${savingsAmount.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Stock & Timer */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-green-400 font-medium text-sm">✓ In Stock</span>
                                                {item.stockCount && item.stockCount <= 10 && (
                                                    <span className="text-orange-400 text-sm bg-orange-500/20 px-2 py-1 rounded-full">
                                                        Only {item.stockCount} left!
                                                    </span>
                                                )}
                                            </div>
                                            {item.dealEnds && (
                                                <CountdownTimer endDate={item.dealEnds} />
                                            )}
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
                                            <ShoppingCart className="w-6 h-6" />
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
                    <button className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center">
                        View All Deals & Clearance
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}