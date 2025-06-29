"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Eye, ChevronDown, ChevronRight, Star, Package, Truck, Shield, SlidersHorizontal, X } from 'lucide-react';

// Real product types from your WPS system
const PRODUCT_TYPES = [
    'Suspension', 'Hardware/Fasteners/Fittings', 'Promotional', 'Tire/Wheel Accessories', 'Drive',
    'Intake/Carb/Fuel System', 'Graphics/Decals', 'Exhaust', 'Stands/Lifts', 'Mats/Rugs',
    'Straps/Tie-Downs', 'Accessories', 'Grips', 'Gloves', 'Tools', 'Chemicals', 'Utility Containers',
    'Fuel Containers', 'Eyewear', 'Sprockets', 'Winch', 'Mounts/Brackets', 'Trailer/Towing', 'Body',
    'Windshield/Windscreen', 'Electrical', 'Engine', 'Protective/Safety', 'Wheels', 'Skis/Carbides/Runners',
    'Plow', 'Plow Mount', 'Piston kits & Components', 'Track Kit', 'Footwear', 'Hyfax', 'Illumination',
    'Clutch', 'Air Filters', 'Jets', 'Gaskets/Seals', 'Clamps', 'Mirrors', 'Oil Filters', 'Gas Caps',
    'Foot Controls', 'Levers', 'Cable/Hydraulic Control Lines', 'Starters', 'Throttle',
    'Audio/Visual/Communication', 'Switches', 'Onesies', 'Guards/Braces', 'Handguards', 'Engine Management',
    'Spark Plugs', 'Brakes', 'Risers', 'Ice Scratchers', 'Headgear', 'Shirts', 'Steering', 'Tracks',
    'Handlebars', 'Seat', 'Luggage', 'Watercraft Towables', 'Hand Controls', 'Belts', 'Fuel Tank',
    'Flotation Vests', 'Racks', 'Helmet Accessories', 'Layers', 'Vests', 'Storage Covers', 'Socks',
    'Gauges/Meters', 'Security', 'Suits', 'Wheel Components', 'Replacement Parts', 'Shorts', 'Hoodies',
    'Jackets', 'Jerseys', 'Pants', 'Chains', 'UTV Cab/Roof/Door', 'Helmets', 'Batteries', 'Tires',
    'Tubes', 'Farm/Agriculture', 'Rims', 'Bicycle Frames', 'Cranks', 'Tank Tops', 'Bike', 'Sweaters',
    'GPS', 'Videos', 'Shoes', 'Tire And Wheel Kit', 'Undergarments', 'Forks', 'Food & Beverage',
    'Winch Mount'
];

// Mock WPS API service
const wpsService = {
    async getMainCategories() {
        return [
            { id: 192, name: 'Apparel', itemCount: 1250, slug: 'apparel', description: 'Riding gear, protective equipment, and casual wear' },
            { id: 193, name: 'ATV', itemCount: 3200, slug: 'atv', description: 'All-terrain vehicle parts and accessories' },
            { id: 194, name: 'Bicycle', itemCount: 890, slug: 'bicycle', description: 'Bicycle components and accessories' },
            { id: 197, name: 'Offroad', itemCount: 2850, slug: 'offroad', description: 'Dirt bike and offroad motorcycle parts' },
            { id: 198, name: 'Snow', itemCount: 1560, slug: 'snow', description: 'Snowmobile parts and winter accessories' },
            { id: 199, name: 'Street', itemCount: 4200, slug: 'street', description: 'Street motorcycle parts and accessories' },
            { id: 200, name: 'Watercraft', itemCount: 750, slug: 'watercraft', description: 'PWC and watercraft components' }
        ];
    },

    async getProductTypesForCategory(categoryId) {
        // Simulate different product types available per category
        const categoryProductTypes = {
            192: ['Protective/Safety', 'Headgear', 'Gloves', 'Footwear', 'Jackets', 'Pants', 'Shirts', 'Hoodies', 'Shorts', 'Helmets', 'Eyewear', 'Suits', 'Layers', 'Vests', 'Socks', 'Undergarments', 'Tank Tops', 'Sweaters', 'Shoes', 'Onesies', 'Jerseys'],
            193: ['Suspension', 'Engine', 'Exhaust', 'Brakes', 'Drive', 'Electrical', 'Body', 'Wheels', 'Tires', 'Air Filters', 'Oil Filters', 'Clutch', 'Accessories', 'UTV Cab/Roof/Door', 'Winch', 'Racks', 'Mounts/Brackets', 'Guards/Braces'],
            194: ['Bicycle Frames', 'Wheels', 'Tires', 'Brakes', 'Drive', 'Handlebars', 'Seat', 'Accessories', 'Tools', 'Cranks', 'Forks', 'Chains', 'Bike'],
            197: ['Suspension', 'Engine', 'Exhaust', 'Brakes', 'Drive', 'Electrical', 'Body', 'Wheels', 'Tires', 'Air Filters', 'Clutch', 'Handlebars', 'Foot Controls', 'Hand Controls', 'Guards/Braces', 'Handguards', 'Graphics/Decals'],
            198: ['Suspension', 'Engine', 'Tracks', 'Skis/Carbides/Runners', 'Clutch', 'Drive', 'Electrical', 'Body', 'Hyfax', 'Ice Scratchers', 'Windshield/Windscreen', 'Handlebars', 'Track Kit'],
            199: ['Suspension', 'Engine', 'Exhaust', 'Brakes', 'Drive', 'Electrical', 'Body', 'Wheels', 'Tires', 'Windshield/Windscreen', 'Handlebars', 'Foot Controls', 'Hand Controls', 'Mirrors', 'Luggage'],
            200: ['Engine', 'Electrical', 'Body', 'Steering', 'Flotation Vests', 'Watercraft Towables', 'Accessories', 'Storage Covers', 'Racks']
        };

        const availableTypes = categoryProductTypes[categoryId] || [];
        return availableTypes.map(type => ({
            productType: type,
            itemCount: Math.floor(Math.random() * 150) + 25
        }));
    },

    async getItems(categoryId, productType, page = 1, pageSize = 24) {
        const generateItem = (index) => {
            const brands = ['RACE TECH', 'YOSHIMURA', 'FMF', 'HINSON', 'RIGID', 'K&N', 'EBC', 'MOTION PRO', 'ACERBIS', 'RENTHAL'];
            const statuses = ['STK', 'STK', 'STK', 'CLO', 'DSC', 'STK'];

            const basePrice = Math.random() * 800 + 20;
            const hasOriginalPrice = Math.random() > 0.7;
            const originalPrice = hasOriginalPrice ? basePrice * (1 + Math.random() * 0.5) : null;

            return {
                id: `item_${categoryId}_${productType}_${index}`,
                sku: `${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
                name: `${brands[Math.floor(Math.random() * brands.length)]} ${productType || 'Premium'} ${['Pro', 'Elite', 'Sport', 'Racing', 'Standard', 'Heavy Duty', 'Performance'][Math.floor(Math.random() * 7)]} ${index + 1}`,
                list_price: basePrice.toFixed(2),
                original_price: originalPrice?.toFixed(2) || null,
                brand: brands[Math.floor(Math.random() * brands.length)],
                product_type: productType || 'Component',
                status: statuses[Math.floor(Math.random() * statuses.length)],
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviewCount: Math.floor(Math.random() * 200) + 5,
                inStock: Math.random() > 0.15,
                isNew: Math.random() > 0.85,
                isBestSeller: Math.random() > 0.9,
                onSale: hasOriginalPrice,
                features: ['High Performance', 'Race Proven', 'Easy Install', 'Lifetime Warranty', 'DOT Approved', 'CNC Machined'].slice(0, Math.floor(Math.random() * 4) + 1),
                description: `Professional grade ${productType?.toLowerCase() || 'component'} designed for maximum performance and durability.`
            };
        };

        const totalItems = Math.floor(Math.random() * 200) + 50;
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);

        const items = Array.from({ length: endIndex - startIndex }, (_, i) =>
            generateItem(startIndex + i)
        );

        return {
            items,
            totalCount: totalItems,
            hasMore: endIndex < totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / pageSize)
        };
    }
};

function WPSCatalog() {
    // State management
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productTypes, setProductTypes] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [showOnlySale, setShowOnlySale] = useState(false);

    // Load categories on mount
    useEffect(() => {
        wpsService.getMainCategories().then(setCategories);
    }, []);

    // Handle category selection
    const handleCategorySelect = async (category) => {
        setLoading(true);
        setSelectedCategory(category);
        setSelectedProductType('');
        setItems([]);
        setCurrentPage(1);

        try {
            const types = await wpsService.getProductTypesForCategory(category.id);
            setProductTypes(types);

            const result = await wpsService.getItems(category.id, '', 1);
            setItems(result.items);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Error loading category:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle product type selection
    const handleProductTypeSelect = async (productType) => {
        if (!selectedCategory) return;

        setLoading(true);
        setSelectedProductType(productType);
        setCurrentPage(1);

        try {
            const result = await wpsService.getItems(selectedCategory.id, productType, 1);
            setItems(result.items);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Error filtering by product type:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination
    const handlePageChange = async (page) => {
        if (!selectedCategory) return;

        setLoading(true);
        setCurrentPage(page);

        try {
            const result = await wpsService.getItems(selectedCategory.id, selectedProductType, page);
            setItems(result.items);
        } catch (error) {
            console.error('Error loading page:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get filtered and sorted items
    const filteredAndSortedItems = items
        .filter(item => {
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            const price = parseFloat(item.list_price);
            if (price < priceRange[0] || price > priceRange[1]) {
                return false;
            }

            if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) {
                return false;
            }

            if (selectedStatuses.length > 0 && !selectedStatuses.includes(item.status)) {
                return false;
            }

            if (showOnlyInStock && !item.inStock) {
                return false;
            }

            if (showOnlySale && !item.onSale) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':
                    return parseFloat(a.list_price) - parseFloat(b.list_price);
                case 'price_desc':
                    return parseFloat(b.list_price) - parseFloat(a.list_price);
                case 'rating':
                    return parseFloat(b.rating) - parseFloat(a.rating);
                case 'newest':
                    return b.isNew ? 1 : -1;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const uniqueBrands = [...new Set(items.map(item => item.brand))].sort();
    const uniqueStatuses = [...new Set(items.map(item => item.status))];

    const getStatusBadge = (item) => {
        if (item.isNew) return { text: 'New', color: 'bg-green-500' };
        if (item.isBestSeller) return { text: 'Best Seller', color: 'bg-red-500' };
        if (item.onSale) return { text: 'Sale', color: 'bg-orange-500' };
        return null;
    };

    const getStockStatus = (item) => {
        if (!item.inStock) return { text: 'Out of Stock', color: 'text-red-600' };
        if (item.status === 'CLO') return { text: 'Closeout', color: 'text-orange-600' };
        if (item.status === 'DSC') return { text: 'Discontinued', color: 'text-gray-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    const ItemCard = ({ item }) => {
        const badge = getStatusBadge(item);
        const stockStatus = getStockStatus(item);
        const discount = item.original_price ? Math.round((1 - parseFloat(item.list_price) / parseFloat(item.original_price)) * 100) : 0;

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group overflow-hidden">
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {badge && (
                        <div className={`absolute top-3 left-3 ${badge.color} text-white text-xs font-bold px-2 py-1 rounded-full z-10`}>
                            {badge.text}
                        </div>
                    )}

                    {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            -{discount}%
                        </div>
                    )}

                    {/* Product Image Placeholder */}
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
                        <button className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye className="w-5 h-5" />
                        </button>
                        <button className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Brand & SKU */}
                    <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {item.brand}
            </span>
                        <span className="text-xs text-gray-500">SKU: {item.sku}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                        star <= Math.floor(parseFloat(item.rating))
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">
              {item.rating} ({item.reviewCount})
            </span>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${item.list_price}
              </span>
                            {item.original_price && (
                                <span className="text-sm text-gray-500 line-through">
                  ${item.original_price}
                </span>
                            )}
                        </div>
                        {item.original_price && (
                            <span className="text-sm text-green-600 font-semibold">
                Save ${(parseFloat(item.original_price) - parseFloat(item.list_price)).toFixed(2)}
              </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
            <span className={`text-sm font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        disabled={!item.inStock}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                            item.inStock
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {item.inStock ? (
                            <div className="flex items-center justify-center space-x-2">
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                            </div>
                        ) : (
                            'Out of Stock'
                        )}
                    </button>
                </div>
            </div>
        );
    };

    const FilterPanel = ({ isMobile = false }) => (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
            {isMobile && (
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Categories */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 ${
                                selectedCategory?.id === category.id
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-sm'
                                    : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{category.name}</div>
                                    <div className="text-sm text-gray-500">{category.description}</div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.itemCount}
                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Types */}
            {productTypes.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Product Types</h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                        <button
                            onClick={() => handleProductTypeSelect('')}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedProductType === ''
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm">All Types</span>
                                <span className="text-xs text-gray-500">{items.length}</span>
                            </div>
                        </button>
                        {productTypes.map(type => (
                            <button
                                key={type.productType}
                                onClick={() => handleProductTypeSelect(type.productType)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    selectedProductType === type.productType
                                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">{type.productType}</span>
                                    <span className="text-xs text-gray-500">{type.itemCount}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Filters */}
            {selectedCategory && (
                <>
                    {/* Quick Filters */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Filters</h4>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showOnlyInStock}
                                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showOnlySale}
                                    onChange={(e) => setShowOnlySale(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">On Sale Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Brand Filter */}
                    {uniqueBrands.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-900 mb-3">Brands</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {uniqueBrands.map(brand => (
                                    <label key={brand} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedBrands([...selectedBrands, brand]);
                                                } else {
                                                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Price Range: ${priceRange[0]} - ${priceRange[1]}
                        </h4>
                        <div className="flex space-x-3">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Min</label>
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Max</label>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="1000"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">WPS Parts Catalog</h1>
                            <p className="text-gray-600 text-sm lg:text-base">Browse our complete inventory by category and product type</p>
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <FilterPanel />
                    </div>

                    {/* Mobile Filter Overlay */}
                    {showMobileFilters && (
                        <div className="lg:hidden">
                            <FilterPanel isMobile={true} />
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="lg:col-span-3">

                        {/* Breadcrumb & Controls */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            {/* Breadcrumb */}
                            <div className="flex items-center text-sm text-gray-600 mb-4">
                                <span>Catalog</span>
                                {selectedCategory && (
                                    <>
                                        <ChevronRight className="w-4 h-4 mx-2" />
                                        <span className="text-blue-600 font-medium">{selectedCategory.name}</span>
                                    </>
                                )}
                                {selectedProductType && (
                                    <>
                                        <ChevronRight className="w-4 h-4 mx-2" />
                                        <span className="text-blue-600 font-medium">{selectedProductType}</span>
                                    </>
                                )}
                            </div>

                            {/* Search & Controls */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex items-center space-x-4">
                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="newest">Newest First</option>
                                    </select>

                                    {/* View Mode */}
                                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Results Count */}
                            {selectedCategory && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Showing {filteredAndSortedItems.length} of {items.length} items
                                        {selectedProductType && (
                                            <span> in <strong>{selectedProductType}</strong></span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        {!selectedCategory ? (
                            /* Welcome State */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to WPS Parts Catalog</h3>
                                <p className="text-gray-600 mb-6">Select a category from the sidebar to start browsing our extensive inventory of motorcycle, ATV, and powersports parts.</p>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                    {categories.slice(0, 4).map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategorySelect(category)}
                                            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                        >
                                            <div className="text-sm font-medium text-blue-800">{category.name}</div>
                                            <div className="text-xs text-blue-600">{category.itemCount} items</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : loading ? (
                            /* Loading State */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Products...</h3>
                                <p className="text-gray-600">Please wait while we fetch the latest inventory.</p>
                            </div>
                        ) : filteredAndSortedItems.length === 0 ? (
                            /* No Results State */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery
                                        ? `No products match "${searchQuery}" with your current filters.`
                                        : 'No products match your current filters.'
                                    }
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedBrands([]);
                                        setSelectedStatuses([]);
                                        setShowOnlyInStock(false);
                                        setShowOnlySale(false);
                                        setPriceRange([0, 1000]);
                                    }}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            /* Products Grid/List */
                            <>
                                <div className={`${
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                        : 'space-y-4'
                                }`}>
                                    {filteredAndSortedItems.map(item => (
                                        viewMode === 'grid' ? (
                                            <ItemCard key={item.id} item={item} />
                                        ) : (
                                            /* List View Item */
                                            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-center space-x-6">
                                                    {/* Product Image */}
                                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <span className="text-sm font-semibold text-blue-600 uppercase">{item.brand}</span>
                                                                    <span className="text-sm text-gray-500">SKU: {item.sku}</span>
                                                                </div>
                                                                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>

                                                                {/* Rating */}
                                                                <div className="flex items-center mb-2">
                                                                    <div className="flex items-center">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                className={`w-4 h-4 ${
                                                                                    star <= Math.floor(parseFloat(item.rating))
                                                                                        ? 'text-yellow-400 fill-current'
                                                                                        : 'text-gray-300'
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="ml-2 text-sm text-gray-500">
                                    {item.rating} ({item.reviewCount} reviews)
                                  </span>
                                                                </div>

                                                                {/* Features */}
                                                                <div className="flex flex-wrap gap-2">
                                                                    {item.features.slice(0, 3).map((feature, idx) => (
                                                                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                      {feature}
                                    </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Price & Actions */}
                                                            <div className="text-right flex-shrink-0 ml-6">
                                                                <div className="mb-3">
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        <span className="text-2xl font-bold text-gray-900">${item.list_price}</span>
                                                                        {item.original_price && (
                                                                            <span className="text-lg text-gray-500 line-through">${item.original_price}</span>
                                                                        )}
                                                                    </div>
                                                                    {item.original_price && (
                                                                        <div className="text-sm text-green-600 font-semibold">
                                                                            Save ${(parseFloat(item.original_price) - parseFloat(item.list_price)).toFixed(2)}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mb-3">
                                  <span className={`text-sm font-medium ${getStockStatus(item).color}`}>
                                    {getStockStatus(item).text}
                                  </span>
                                                                </div>

                                                                <div className="flex space-x-2">
                                                                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                                        <Heart className="w-4 h-4" />
                                                                    </button>
                                                                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        disabled={!item.inStock}
                                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                                            item.inStock
                                                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center space-x-2">
                                                                            <ShoppingCart className="w-4 h-4" />
                                                                            <span>Add to Cart</span>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-2 border rounded-lg ${
                                                            currentPage === page
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            {totalPages > 5 && (
                                                <>
                                                    <span className="px-2">...</span>
                                                    <button
                                                        onClick={() => handlePageChange(totalPages)}
                                                        className={`px-3 py-2 border rounded-lg ${
                                                            currentPage === totalPages
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Trust Indicators Footer */}
            <div className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-green-100 p-3 rounded-full mb-4">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
                            <p className="text-sm text-gray-600">All parts meet or exceed OEM specifications</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <Truck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
                            <p className="text-sm text-gray-600">Same-day shipping on most orders</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-purple-100 p-3 rounded-full mb-4">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
                            <p className="text-sm text-gray-600">Knowledgeable team ready to help</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WPSCatalog;