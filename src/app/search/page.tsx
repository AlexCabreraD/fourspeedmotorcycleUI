// src/app/search/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Grid, List, Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';

interface SearchResult {
    type: 'product' | 'item';
    id: number;
    name: string;
    sku?: string;
    list_price?: string;
    status?: string;
    description?: string;
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
    items?: Array<{
        id: number;
        list_price: string;
        status: string;
    }>;
}

interface Brand {
    id: number;
    name: string;
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<SearchResult[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(query);

    // Filter states
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('relevance');
    const [resultType, setResultType] = useState<'all' | 'products' | 'items'>('all');

    useEffect(() => {
        if (query) {
            setSearchQuery(query);
            loadBrands();
            loadInitialResults();
        }
    }, [query]);

    useEffect(() => {
        // Reset and reload when filters change
        if (query) {
            setResults([]);
            setNextCursor(null);
            setHasMore(true);
            loadResults(true);
        }
    }, [selectedBrands, priceRange, sortBy, resultType]);

    const loadInitialResults = async () => {
        setLoading(true);
        await loadResults(true);
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

    const loadResults = async (reset = false) => {
        if (!query) return;

        try {
            if (!reset) {
                setLoadingMore(true);
            }

            const params = new URLSearchParams({
                q: query,
                'page[size]': '20',
                include: 'product,items,images,brands',
                sort: sortBy,
                type: resultType
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

            const response = await fetch(`/api/search?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();

                if (reset) {
                    setResults(data.data || []);
                } else {
                    setResults(prev => [...prev, ...(data.data || [])]);
                }

                setNextCursor(data.meta?.cursor?.next || null);
                setHasMore(!!data.meta?.cursor?.next);
            }
        } catch (error) {
            console.error('Error loading search results:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && nextCursor) {
            loadResults(false);
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

    const getPriceRange = (items: any[]) => {
        if (!items || items.length === 0) return 'Price on request';
        const prices = items.map(item => parseFloat(item.list_price)).filter(p => !isNaN(p));
        if (prices.length === 0) return 'Price on request';
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? formatPrice(min.toString()) : `${formatPrice(min.toString())} - ${formatPrice(max.toString())}`;
    };

    const handleBrandToggle = (brandId: number) => {
        setSelectedBrands(prev =>
            prev.includes(brandId)
                ? prev.filter(id => id !== brandId)
                : [...prev, brandId]
        );
    };

    const clearFilters = () => {
        setSelectedBrands([]);
        setPriceRange({ min: '', max: '' });
        setSortBy('relevance');
        setResultType('all');
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const addToCart = async (item: SearchResult) => {
        try {
            console.log('Adding to cart:', item);
            // Implement add to cart functionality
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-orange-500">
                            4SpeedMotorcycle
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleSearch}
                                    placeholder="Search parts, brands, or part numbers..."
                                    className="w-full px-4 py-2 pl-10 text-gray-900 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <nav className="hidden md:flex space-x-6">
                            <Link href="/brands" className="text-gray-600 hover:text-orange-500">Brands</Link>
                            <Link href="/cart" className="text-gray-600 hover:text-orange-500">Cart</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Search Header */}
            <div className="bg-white border-b py-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={() => router.back()}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Search Results {query && `for "${query}"`}
                            </h1>
                            <p className="text-gray-600">
                                {loading ? 'Searching...' : `${results.length} results found`}
                            </p>
                        </div>
                    </div>

                    {/* Result Type Tabs */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
                        <button
                            onClick={() => setResultType('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                resultType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            All Results
                        </button>
                        <button
                            onClick={() => setResultType('products')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                resultType === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setResultType('items')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                resultType === 'items' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Individual Items
                        </button>
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
                                <option value="relevance">Relevance</option>
                                <option value="name">Name A-Z</option>
                                <option value="name_desc">Name Z-A</option>
                                <option value="price_low">Price Low to High</option>
                                <option value="price_high">Price High to Low</option>
                                <option value="newest">Newest First</option>
                            </select>
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

                        {/* Search Results */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(12)].map((_, i) => (
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
                                    {results.map((result) => (
                                        <div
                                            key={`${result.type}-${result.id}`}
                                            className={`group bg-white rounded-lg shadow hover:shadow-lg transition-all ${
                                                viewMode === 'list' ? 'flex p-4' : 'block'
                                            }`}
                                        >
                                            <div className={`${
                                                viewMode === 'list'
                                                    ? 'w-32 h-32 flex-shrink-0 mr-4'
                                                    : 'aspect-square'
                                            } bg-gray-100 rounded overflow-hidden relative`}>
                                                <Link href={`/product/${result.type === 'product' ? result.id : result.product?.id || result.id}`}>
                                                    <img
                                                        src={buildImageUrl(result.images?.[0])}
                                                        alt={result.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                    />
                                                </Link>
                                                <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              result.type === 'product'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                          }`}>
                            {result.type === 'product' ? 'Product' : 'Item'}
                          </span>
                                                </div>
                                            </div>

                                            <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'} flex flex-col`}>
                                                <Link href={`/product/${result.type === 'product' ? result.id : result.product?.id || result.id}`}>
                                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-500 line-clamp-2 cursor-pointer">
                                                        {result.name}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center justify-between mb-2">
                                                    {result.brand && (
                                                        <span className="text-sm text-gray-500">{result.brand.name}</span>
                                                    )}
                                                    {result.sku && (
                                                        <span className="text-xs text-gray-400">SKU: {result.sku}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-orange-600">
                            {result.type === 'product'
                                ? getPriceRange(result.items || [])
                                : result.list_price ? formatPrice(result.list_price) : 'Price on request'
                            }
                          </span>
                                                    {result.status && (
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            result.status === 'STK' ? 'bg-green-100 text-green-800' :
                                                                result.status === 'PRE' ? 'bg-blue-100 text-blue-800' :
                                                                    result.status === 'CLO' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                        }`}>
                              {result.status === 'STK' ? 'In Stock' :
                                  result.status === 'PRE' ? 'Pre-Order' :
                                      result.status === 'CLO' ? 'Closeout' : result.status}
                            </span>
                                                    )}
                                                </div>

                                                {viewMode === 'list' && result.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{result.description}</p>
                                                )}

                                                {result.type === 'product' && result.items && result.items.length > 1 && (
                                                    <p className="text-xs text-gray-500 mb-3">
                                                        {result.items.length} variants available
                                                    </p>
                                                )}

                                                <div className="mt-auto">
                                                    {result.type === 'item' ? (
                                                        <button
                                                            onClick={() => addToCart(result)}
                                                            disabled={result.status === 'DSC' || result.status === 'NA'}
                                                            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                                                                result.status === 'DSC' || result.status === 'NA'
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                                                            }`}
                                                        >
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            {result.status === 'DSC' || result.status === 'NA' ? 'Unavailable' : 'Add to Cart'}
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={`/product/${result.id}`}
                                                            className="w-full block text-center px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                                        >
                                                            View Details
                                                        </Link>
                                                    )}
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
                                            <span>Loading more results...</span>
                                        </div>
                                    </div>
                                )}

                                {/* No More Results */}
                                {!hasMore && results.length > 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>You've seen all search results</p>
                                    </div>
                                )}

                                {/* No Results */}
                                {!loading && results.length === 0 && query && (
                                    <div className="text-center py-12">
                                        <div className="max-w-md mx-auto">
                                            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                                            <p className="text-gray-500 mb-4">Sorry, we couldn't find any results for "{query}"</p>
                                            <div className="space-y-2 text-left">
                                                <p className="text-sm text-gray-600">Try:</p>
                                                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                                    <li>Checking your spelling</li>
                                                    <li>Using different keywords</li>
                                                    <li>Searching for part numbers or SKUs</li>
                                                    <li>Using broader terms</li>
                                                </ul>
                                            </div>
                                            <button
                                                onClick={clearFilters}
                                                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
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

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-lg">Loading search...</span>
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}