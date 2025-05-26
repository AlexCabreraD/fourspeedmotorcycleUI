// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Star, Truck, Shield, Clock } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  images?: Array<{
    id: number;
    domain: string;
    path: string;
    filename: string;
  }>;
  items?: Array<{
    id: number;
    list_price: string;
    status: string;
  }>;
}

export default function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularBrands, setPopularBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Vehicle categories with their catalog flags
  const vehicleCategories = [
    {
      name: 'Street/Road',
      slug: 'street',
      description: 'Motorcycles, Sport Bikes, Cruisers',
      image: '/api/placeholder/300/200',
      catalogFlag: 'street_catalog'
    },
    {
      name: 'Off-Road/Dirt',
      slug: 'offroad',
      description: 'Dirt Bikes, Motocross, Enduro',
      image: '/api/placeholder/300/200',
      catalogFlag: 'offroad_catalog'
    },
    {
      name: 'ATV/UTV',
      slug: 'atv',
      description: 'ATVs, Side-by-sides, Quads',
      image: '/api/placeholder/300/200',
      catalogFlag: 'atv_catalog'
    },
    {
      name: 'Snowmobile',
      slug: 'snow',
      description: 'Sleds, Snow Machines',
      image: '/api/placeholder/300/200',
      catalogFlag: 'snow_catalog'
    },
    {
      name: 'Watercraft',
      slug: 'watercraft',
      description: 'Jet Skis, PWCs',
      image: '/api/placeholder/300/200',
      catalogFlag: 'watercraft_catalog'
    },
    {
      name: 'Bicycle',
      slug: 'bicycle',
      description: 'BMX, Mountain, Road Bikes',
      image: '/api/placeholder/300/200',
      catalogFlag: 'bicycle_catalog'
    }
  ];

  // Main product categories
  const productCategories = [
    {
      name: 'Engine & Performance',
      slug: 'engine-performance',
      icon: '⚡',
      subcategories: ['Engine', 'Exhaust', 'Air Filters', 'Spark Plugs']
    },
    {
      name: 'Drivetrain & Motion',
      slug: 'drivetrain-motion',
      icon: '⚙️',
      subcategories: ['Brakes', 'Suspension', 'Wheels', 'Tires']
    },
    {
      name: 'Controls & Handling',
      slug: 'controls-handling',
      icon: '🎮',
      subcategories: ['Handlebars', 'Levers', 'Grips', 'Foot Controls']
    },
    {
      name: 'Body & Protection',
      slug: 'body-protection',
      icon: '🛡️',
      subcategories: ['Body', 'Guards', 'Windshields', 'Seats']
    },
    {
      name: 'Electrical & Electronics',
      slug: 'electrical-electronics',
      icon: '🔌',
      subcategories: ['Batteries', 'Lighting', 'Audio', 'GPS']
    },
    {
      name: 'Apparel & Safety',
      slug: 'apparel-safety',
      icon: '👕',
      subcategories: ['Helmets', 'Jackets', 'Gloves', 'Boots']
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load featured products - get products with images and items
      const productsResponse = await fetch('/api/products?featured=true&include=items,images&page[size]=8');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setFeaturedProducts(productsData.data || []);
      }

      // Load popular brands
      const brandsResponse = await fetch('/api/brands?popular=true&page[size]=12');
      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json();
        setPopularBrands(brandsData.data || []);
      }
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = (e: React.KeyboardEvent | React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gray-900 text-white sticky top-0 z-50">
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                      placeholder="Search parts, brands, or part numbers..."
                      className="w-full px-4 py-2 pl-10 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <nav className="hidden md:flex space-x-6">
                <Link href="/brands" className="hover:text-orange-500">Brands</Link>
                <Link href="/cart" className="hover:text-orange-500">Cart</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Your One-Stop Motorcycle Parts Shop
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Find premium parts and accessories for street bikes, dirt bikes, ATVs, snowmobiles, and more.
              Over 100,000+ products from top brands.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Vehicle Type */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Vehicle Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicleCategories.map((category) => (
                  <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-gray-900/40 flex items-center justify-center">
                        <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex items-center text-orange-500 group-hover:text-orange-600">
                        <span className="font-semibold">Shop Now</span>
                        <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCategories.map((category) => (
                  <Link
                      key={category.slug}
                      href={`/parts/${category.slug}`}
                      className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{category.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500">
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.subcategories.slice(0, 4).map((sub) => (
                          <span key={sub} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                      {sub}
                    </span>
                      ))}
                    </div>
                    <div className="flex items-center text-orange-500 group-hover:text-orange-600">
                      <span className="font-semibold">Browse Parts</span>
                      <ChevronRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="bg-gray-300 aspect-square rounded mb-4"></div>
                        <div className="bg-gray-300 h-4 rounded mb-2"></div>
                        <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                      <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                          <img
                              src={buildImageUrl(product.images?.[0])}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500">
                            {product.name}
                          </h3>
                          <p className="text-orange-600 font-bold">
                            {getPriceRange(product.items || [])}
                          </p>
                        </div>
                      </Link>
                  ))}
                </div>
            )}
            <div className="text-center mt-8">
              <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                View All Products
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Brands */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularBrands.map((brand) => (
                  <Link
                      key={brand.id}
                      href={`/brand/${brand.id}`}
                      className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-md transition-all text-center"
                  >
                    <div className="font-semibold text-gray-900 group-hover:text-orange-500">
                      {brand.name}
                    </div>
                  </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                  href="/brands"
                  className="inline-flex items-center px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
              >
                View All Brands
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-orange-500">4SpeedMotorcycle</h3>
                <p className="text-gray-400">
                  Your trusted source for motorcycle, ATV, and powersports parts and accessories.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/category/street" className="hover:text-white">Street</Link></li>
                  <li><Link href="/category/offroad" className="hover:text-white">Off-Road</Link></li>
                  <li><Link href="/category/atv" className="hover:text-white">ATV/UTV</Link></li>
                  <li><Link href="/category/snow" className="hover:text-white">Snowmobile</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/parts/engine-performance" className="hover:text-white">Engine & Performance</Link></li>
                  <li><Link href="/parts/drivetrain-motion" className="hover:text-white">Drivetrain & Motion</Link></li>
                  <li><Link href="/parts/apparel-safety" className="hover:text-white">Apparel & Safety</Link></li>
                  <li><Link href="/brands" className="hover:text-white">All Brands</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="mailto:support@4speedmotorcycle.com" className="hover:text-white">Contact Us</a></li>
                  <li><a href="/shipping" className="hover:text-white">Shipping Info</a></li>
                  <li><a href="/returns" className="hover:text-white">Returns</a></li>
                  <li><a href="/help" className="hover:text-white">Help Center</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 4SpeedMotorcycle. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}