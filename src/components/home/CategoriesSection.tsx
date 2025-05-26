// src/components/home/CategoriesSection.tsx
import React from 'react';

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
        color: 'from-blue-500 to-blue-600'
    },
    {
        name: 'Engine',
        slug: 'engine',
        description: 'Engine parts, pistons, gaskets and performance upgrades',
        itemCount: 2100,
        color: 'from-red-500 to-red-600'
    },
    {
        name: 'Electrical',
        slug: 'electrical',
        description: 'Batteries, starters, switches and electrical components',
        itemCount: 850,
        color: 'from-yellow-500 to-yellow-600'
    },
    {
        name: 'Exhaust',
        slug: 'exhaust',
        description: 'Performance exhaust systems and components',
        itemCount: 620,
        color: 'from-gray-600 to-gray-700'
    },
    {
        name: 'Brakes',
        slug: 'brakes',
        description: 'Brake pads, rotors, lines and brake system parts',
        itemCount: 540,
        color: 'from-purple-500 to-purple-600'
    },
    {
        name: 'Drivetrain',
        slug: 'drive',
        description: 'Chains, sprockets, belts and drive components',
        itemCount: 750,
        color: 'from-green-500 to-green-600'
    },
    {
        name: 'Body & Accessories',
        slug: 'body',
        description: 'Fairings, fenders, windshields and body parts',
        itemCount: 980,
        color: 'from-indigo-500 to-indigo-600'
    },
    {
        name: 'Wheels & Tires',
        slug: 'wheels',
        description: 'Wheels, tires, tubes and wheel accessories',
        itemCount: 1340,
        color: 'from-orange-500 to-orange-600'
    },
    {
        name: 'Tools & Chemicals',
        slug: 'tools',
        description: 'Maintenance tools, lubricants and cleaning products',
        itemCount: 430,
        color: 'from-teal-500 to-teal-600'
    },
    {
        name: 'Protective Gear',
        slug: 'protective-safety',
        description: 'Helmets, gloves, boots and safety equipment',
        itemCount: 670,
        color: 'from-pink-500 to-pink-600'
    },
    {
        name: 'Apparel',
        slug: 'apparel',
        description: 'Riding gear, jackets, pants and casual wear',
        itemCount: 890,
        color: 'from-cyan-500 to-cyan-600'
    },
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'GPS, audio systems and electronic accessories',
        itemCount: 280,
        color: 'from-violet-500 to-violet-600'
    }
];

export default function CategoriesSection() {
    return (
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Find exactly what you need with our comprehensive selection of motorcycle,
                        ATV, and powersports parts organized by category.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.slug}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                        >
                            {/* Category Image/Icon Area */}
                            <div className={`h-32 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10"></div>

                                {/* Placeholder for category image */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-8 h-8 bg-white/60 rounded"></div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <div className="absolute top-2 right-2 w-4 h-4 bg-white/20 rounded-full"></div>
                                <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/30 rounded-full"></div>
                            </div>

                            {/* Category Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category.itemCount.toLocaleString()}
                  </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {category.description}
                                </p>

                                {/* Hover Arrow */}
                                <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-medium">Browse category</span>
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Categories Button */}
                <div className="text-center mt-12">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center">
                        View All Categories
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}