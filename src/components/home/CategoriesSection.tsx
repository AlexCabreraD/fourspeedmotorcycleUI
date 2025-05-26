// src/components/home/CategoriesSection.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Category {
    name: string;
    slug: string;
    description: string;
    itemCount: number;
    color: string;
}

const categories: Category[] = [
    {
        name: 'Suspension',
        slug: 'suspension',
        description: 'Forks, shocks, springs and suspension components',
        itemCount: 1250,
        color: 'from-blue-500/80 via-blue-600/90 to-blue-700'
    },
    {
        name: 'Engine',
        slug: 'engine',
        description: 'Engine parts, pistons, gaskets and performance upgrades',
        itemCount: 2100,
        color: 'from-red-500/80 via-red-600/90 to-red-700'
    },
    {
        name: 'Electrical',
        slug: 'electrical',
        description: 'Batteries, starters, switches and electrical components',
        itemCount: 850,
        color: 'from-yellow-500/80 via-yellow-600/90 to-orange-600'
    },
    {
        name: 'Exhaust',
        slug: 'exhaust',
        description: 'Performance exhaust systems and components',
        itemCount: 620,
        color: 'from-gray-600/80 via-gray-700/90 to-gray-800'
    },
    {
        name: 'Brakes',
        slug: 'brakes',
        description: 'Brake pads, rotors, lines and brake system parts',
        itemCount: 540,
        color: 'from-purple-500/80 via-purple-600/90 to-purple-700'
    },
    {
        name: 'Drivetrain',
        slug: 'drive',
        description: 'Chains, sprockets, belts and drive components',
        itemCount: 750,
        color: 'from-green-500/80 via-green-600/90 to-green-700'
    },
    {
        name: 'Body & Accessories',
        slug: 'body',
        description: 'Fairings, fenders, windshields and body parts',
        itemCount: 980,
        color: 'from-indigo-500/80 via-indigo-600/90 to-indigo-700'
    },
    {
        name: 'Wheels & Tires',
        slug: 'wheels',
        description: 'Wheels, tires, tubes and wheel accessories',
        itemCount: 1340,
        color: 'from-orange-500/80 via-orange-600/90 to-red-600'
    },
    {
        name: 'Tools & Chemicals',
        slug: 'tools',
        description: 'Maintenance tools, lubricants and cleaning products',
        itemCount: 430,
        color: 'from-teal-500/80 via-teal-600/90 to-teal-700'
    },
    {
        name: 'Protective Gear',
        slug: 'protective-safety',
        description: 'Helmets, gloves, boots and safety equipment',
        itemCount: 670,
        color: 'from-pink-500/80 via-pink-600/90 to-pink-700'
    },
    {
        name: 'Apparel',
        slug: 'apparel',
        description: 'Riding gear, jackets, pants and casual wear',
        itemCount: 890,
        color: 'from-cyan-500/80 via-cyan-600/90 to-cyan-700'
    },
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'GPS, audio systems and electronic accessories',
        itemCount: 280,
        color: 'from-violet-500/80 via-violet-600/90 to-violet-700'
    }
];

export default function CategoriesSection() {
    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="absolute bottom-40 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-60 right-40 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-yellow-300">Premium Parts Collection</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Shop by </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                            Category
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Find exactly what you need with our comprehensive selection of motorcycle,
                        ATV, and powersports parts organized by category.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={category.slug}
                            className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Category Image/Icon Area */}
                            <div className={`h-40 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/20"></div>

                                {/* Animated background elements */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-4 right-4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
                                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                                    <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>
                                </div>

                                {/* Main icon placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-10 h-10 bg-white/60 rounded-lg"></div>
                                    </div>
                                </div>

                                {/* Count badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                        {category.itemCount.toLocaleString()} items
                                    </span>
                                </div>
                            </div>

                            {/* Category Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {category.description}
                                </p>

                                {/* Hover Action */}
                                <div className="flex items-center text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                                    <span className="text-sm font-semibold">Browse Category</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Categories Button */}
                <div className="text-center mt-16">
                    <button className="group bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center">
                        View All Categories
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}