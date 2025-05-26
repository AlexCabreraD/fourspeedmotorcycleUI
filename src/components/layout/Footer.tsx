// src/components/layout/Footer.tsx
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Stay Updated with the Latest Deals
                        </h3>
                        <p className="text-yellow-100 mb-8 max-w-2xl mx-auto">
                            Get exclusive discounts, new product alerts, and expert tips delivered straight to your inbox.
                        </p>
                        <div className="max-w-md mx-auto">
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-4 py-3 rounded-l-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                />
                                <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-r-xl font-semibold transition-colors flex items-center">
                                    Subscribe
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                            <p className="text-xs text-yellow-100/80 mt-2">
                                No spam, unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">
                                <span className="text-yellow-500">4Speed</span>
                                <span className="text-white">Motorcycle</span>
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Your trusted partner for motorcycle, ATV, and powersports parts and accessories.
                                Quality products, expert support, fast shipping.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-300 text-sm">1-800-4SPEED-1</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-300 text-sm">support@4speedmotorcycle.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-300 text-sm">Ogden, Utah, USA</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Popular Categories</h4>
                        <ul className="space-y-3">
                            {[
                                'Suspension',
                                'Engine Parts',
                                'Electrical',
                                'Exhaust Systems',
                                'Brake Components',
                                'Drivetrain',
                                'Body & Accessories',
                                'Wheels & Tires'
                            ].map((category) => (
                                <li key={category}>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-yellow-500 transition-colors text-sm hover:underline"
                                    >
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Customer Support</h4>
                        <ul className="space-y-3">
                            {[
                                'Contact Us',
                                'Shipping Information',
                                'Return Policy',
                                'Warranty',
                                'FAQ',
                                'Order Tracking',
                                'Size Guide',
                                'Installation Help'
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-yellow-500 transition-colors text-sm hover:underline"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About & Connect */}
                    <div>
                        <h4 className="font-semibold mb-6 text-lg">About & Connect</h4>
                        <ul className="space-y-3 mb-6">
                            {[
                                'About Us',
                                'Careers',
                                'Press',
                                'Blog',
                                'Dealers',
                                'Affiliate Program',
                                'Privacy Policy',
                                'Terms of Service'
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-yellow-500 transition-colors text-sm hover:underline"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Social Media */}
                        <div>
                            <p className="text-sm text-gray-300 mb-4">Follow us for updates</p>
                            <div className="flex space-x-4">
                                {[
                                    { icon: Facebook, href: '#', label: 'Facebook' },
                                    { icon: Instagram, href: '#', label: 'Instagram' },
                                    { icon: Youtube, href: '#', label: 'YouTube' },
                                    { icon: Twitter, href: '#', label: 'Twitter' }
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="bg-gray-800 hover:bg-yellow-500 text-gray-300 hover:text-black p-2 rounded-lg transition-all duration-300 hover:scale-110"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-400">
                                &copy; 2025 4SpeedMotorcycle. All rights reserved.
                            </p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-400">We accept:</span>
                                <div className="flex space-x-2">
                                    {['VISA', 'MC', 'AMEX', 'DISC'].map((card) => (
                                        <div
                                            key={card}
                                            className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono"
                                        >
                                            {card}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500 text-center">
                            Prices and availability subject to change. Not responsible for typographical errors.
                            All trademarks are the property of their respective owners.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}