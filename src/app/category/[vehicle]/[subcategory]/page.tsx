// src/app/category/[vehicle]/[subcategory]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Filter, Grid, List, ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';

interface Item {
    id: number;
    sku: string;
    name: string;
    list_price: string;
    status: string;
    product?: {
        id: number;
        name: string;
        description?: string;
    };
    images?: Array<{
        id: number;
        domain: string;
        path: string;
        filename: string;
    }>;
    brand?: {
        id: number;
        name: string;
    };
}

interface Brand {
    id: number;
    name: string;
}

export default function SubcategoryPage() {
    const params = useParams();
    const router = useRouter();
    const vehicle = params.vehicle as string;
    const subcategory = params.subcategory as string;

    const [items, setItems] = useState<Item[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('name');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    // Category mappings
    const categoryConfig = {
        'engine-performance': {
            name: 'Engine & Performance',
            productTypes: ['Engine', 'Intake/Carb/Fuel System', 'Exhaust', 'Engine Management', 'Spark Plugs',
                'Air Filters', 'Oil Filters', 'Piston kits & Components', 'Gaskets/Seals', 'Jets', 'Clutch']
        },
        'drivetrain-motion': {
            name: 'Drivetrain & Motion',
            productTypes: ['Drive', 'Belts', 'Chains', 'Sprockets', 'Suspension', 'Brakes', 'Wheels', 'Rims',
                'Tires', 'Tubes', 'Tire/Wheel Accessories', 'Tire And Wheel Kit', 'Wheel Components']
        },
        'controls-handling': {
            name: 'Controls & Handling',
            productTypes: ['Handlebars', 'Risers', 'Grips', 'Hand Controls', 'Foot Controls', 'Levers',
                'Cable/Hydraulic Control Lines', 'Throttle', 'Steering']
        },
        'body-protection': {
            name: 'Body & Protection',
            productTypes: ['Body', 'Guards/Braces', 'Handguards', 'Protective/Safety', 'Windshield/Windscreen',
                'Seat', 'UTV Cab/Roof/Door']
        },
        'electrical-electronics': {
            name: 'Electrical & Electronics',
            productTypes: ['Electrical', 'Batteries', 'Starters', 'Switches', 'Illumination', 'Gauges/Meters',
                'Audio/Visual/Communication', 'GPS']
        },
        'apparel-safety': {
            name: 'Apparel & Safety',
            productTypes: ['Headgear', 'Helmets', 'Helmet Accessories', 'Eyewear', 'Gloves', 'Shirts',
                'Jerseys', 'Jackets', 'Pants', 'Shorts', 'Suits', 'Footwear', 'Protective/Safety', 'Flotation Vests']
        },
        'tools-maintenance': {
            name: 'Tools & Maintenance',
            productTypes: ['Tools', 'Chemicals', 'Hardware/Fasteners/Fittings', 'Stands/Lifts', 'Clamps']
        },
        'storage-transport': {
            name: 'Storage & Transport',
            productTypes: ['Luggage', 'Racks', 'Straps/Tie-Downs', 'Trailer/Towing', 'Storage Covers',
                'Utility Containers', 'Fuel Containers']
        }
    };

    const vehicleConfig = {
        street: { name: 'Street/Road' },
        offroad: { name: 'Off-Road/Dirt' },
        atv: { name: 'ATV/UTV' },
        snow: { name: 'Snowmobile' },
        watercraft: { name: 'Watercraft' },
        bicycle: { name: 'Bicycle' }
    };

    const currentCategory = categoryConfig[subcategory as keyof typeof categoryConfig];
    const currentVehicle = vehicleConfig[vehicle as keyof typeof vehicleConfig];

    const statusOptions = [
        { value: 'STK', label: 'In Stock', color: 'text-green-600' },
        { value: 'PRE', label: 'Pre-Order', color: 'text-blue-600' },
        { value: 'CLO', label: 'Closeout', color: 'text-orange-600' },
        { value: 'DSC', label: 'Discontinued', color: 'text-red-600' },
        { value: 'NA', label: 'Not Available', color: 'text-gray-600' }
    ];

    useEffect(() => {
        if (!currentCategory || !currentVehicle) {
            router.push('/');
            return;
        }
        loadBrands();
        loadInitialData();
    }, [vehicle, subcategory]);

    useEffect(() => {
        // Reset and reload when filters change
        setItems([]);
        setNextCursor(null);
        setHasMore(true);
        loadItems(true);
    }, [selectedBrands, priceRange, sortBy, statusFilter]);

    const loadInitialData = async () => {
        setLoading(true);
        await loadItems(true);
        setLoading(false);
    };

    const loadBrands = async () => {
        try {
            const response = await fetch('/api/brands?page[size]=100');
            if (response.ok) {
                const data = await response.json();
                setBrands(data.data || []);
            }
        } catch (error) {
            console.error('Error loading brands:', error);
        }
    };

    const loadItems = async (reset = false) => {
        if (!currentCategory) return;

        try {
            if (reset) {
                setLoadingMore(true);
            } else {
                setLoadingMore(true);
            }

            const params = new URLSearchParams({
                vehicle: vehicle,
                category: subcategory,
                'page[size]': '24',
                include: 'product,images,brand',
                sort: sortBy
            });

            if (!reset && nextCursor) {
                params.append('cursor', nextCursor);
            }

            if (selectedBrands.length > 0) {
                params.append('brands', selectedBrands.join(','));
            }

            if (priceRange.min) {
                params.append('price_min', priceRange.min);
            }

            if (priceRange.max) {
                params.append('price_max', priceRange.max);
            }

            if (statusFilter.length > 0) {
                params.append('status', statusFilter.join(','));
            }

            const response = await fetch(`/api/items/by-category?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();

                if (reset) {
                    setItems(data.data || []);
                } else {
                    setItems(prev => [...prev, ...(data.data || [])]);
                }

                setNextCursor(data.meta?.cursor?.next || null);
                setHasMore(!!data.meta?.cursor?.next);
            }
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && nextCursor) {
            loadItems(false);
        }
    }, [loadingMore, hasMore, nextCursor]);

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    const buildImageUrl = (image: any, style = '500_max') => {
        if (!image?.domain || !image?.path || !image?.filename) return '/api/placeholder/300/300';
        return `https://${image.domain}${image.path}${style}/${image.filename}`;
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(parseFloat(price));
    };

    const getStatusInfo = (status: string) => {
        const statusInfo = statusOptions.find(s => s.value === status);
        return statusInfo || { value: status, label: status, color: 'text-gray-600' };
    };

    const handleBrandToggle = (brandId: number) => {
        setSelectedBrands(prev =>
            prev.includes(brandId)
                ? prev.filter(id => id !== brandId)
                : [...prev, brandId]
        );
    };

    const handleStatusToggle = (status: string) => {
        setStatusFilter(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const clearFilters = () => {
        setSelectedBrands([]);
        setPriceRange({ min: '', max: '' });
        setStatusFilter([]);
        setSortBy('name');
    };

    const addToCart = async (item: Item) => {
        try {
            // Implement add to cart functionality
            console.log('Adding to cart:', item);
            // You would call your cart API here
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (!currentCategory || !currentVehicle) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-orange-500">
                            4SpeedMotorcycle
                        </Link>
                        <nav className="hidden md:flex space-x-6">
                            <Link href="/brands" className="text-gray-600 hover:text-orange-500">Brands</Link>
                            <Link href="/cart" className="text-gray-600 hover:text-orange-500">Cart</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-orange-500">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={`/category/${vehicle}`} className="hover:text-orange-500">{currentVehicle.name}</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">{currentCategory.name}</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
                            <p className="text-gray-300">For {currentVehicle.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-lg shadow p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-orange-500 hover:text-orange-600"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Sort */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="name">Name A-Z</option>
                                <option value="name_desc">Name Z-A</option>
                                <option value="price_low">Price Low to High</option>
                                <option value="price_high">Price High to Low</option>
                                <option value="sku">SKU</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Availability</label>
                            <div className="space-y-2">
                                {statusOptions.map((status) => (
                                    <label key={status.value} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={statusFilter.includes(status.value)}
                                            onChange={() => handleStatusToggle(status.value)}
                                            className="mr-2 w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                        />
                                        <span className={`text-sm ${status.color}`}>{status.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Price Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Brands</label>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {brands.slice(0, 30).map((brand) => (
                                    <label key={brand.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand.id)}
                                            onChange={() => handleBrandToggle(brand.id)}
                                            className="mr-2 w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filters
                                </button>
                                <span className="text-gray-600">
                  {loading ? 'Loading...' : `${items.length} items`}
                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Items Grid/List */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                                        <div className="bg-gray-300 aspect-square rounded mb-4"></div>
                                        <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                        <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                                        <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                        : 'space-y-4'
                                }>
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`group bg-white rounded-lg shadow hover:shadow-lg transition-all ${
                                                viewMode === 'list' ? 'flex p-4' : 'block'
                                            }`}
                                        >
                                            <div className={`${
                                                viewMode === 'list'
                                                    ? 'w-32 h-32 flex-shrink-0 mr-4'
                                                    : 'aspect-square'
                                            } bg-gray-100 rounded overflow-hidden`}>
                                                <Link href={`/product/${item.product?.id || item.id}`}>
                                                    <img
                                                        src={buildImageUrl(item.images?.[0])}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                    />
                                                </Link>
                                            </div>

                                            <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'} flex flex-col`}>
                                                <Link href={`/product/${item.product?.id || item.id}`}>
                                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-500 line-clamp-2 cursor-pointer">
                                                        {item.name}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center justify-between mb-2">
                                                    {item.brand && (
                                                        <span className="text-sm text-gray-500">{item.brand.name}</span>
                                                    )}
                                                    <span className="text-xs text-gray-400">SKU: {item.sku}</span>
                                                </div>

                                                <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-orange-600">
                            {formatPrice(item.list_price)}
                          </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        item.status === 'STK' ? 'bg-green-100 text-green-800' :
                                                            item.status === 'PRE' ? 'bg-blue-100 text-blue-800' :
                                                                item.status === 'CLO' ? 'bg-orange-100 text-orange-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                            {getStatusInfo(item.status).label}
                          </span>
                                                </div>

                                                <div className="mt-auto">
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        disabled={item.status === 'DSC' || item.status === 'NA'}
                                                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                                                            item.status === 'DSC' || item.status === 'NA'
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                                        }`}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        {item.status === 'DSC' || item.status === 'NA' ? 'Unavailable' : 'Add to Cart'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Loading More Indicator */}
                                {loadingMore && (
                                    <div className="flex justify-center py-8">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Loading more items...</span>
                                        </div>
                                    </div>
                                )}

                                {/* No More Results */}
                                {!hasMore && items.length > 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>You've seen all items in this category</p>
                                    </div>
                                )}

                                {/* No Results */}
                                {!loading && items.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">No items found matching your criteria</p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}