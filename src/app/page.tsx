// src/app/page.tsx
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import PopularItemsSection from '@/components/home/PopularItemsSection';
import DealsSection from '@/components/home/DealsSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
      <div className="min-h-screen bg-white">
        {/* Navigation - Fixed overlay */}
        <Navigation />

        <main>
          {/* Hero Section - Full screen with navigation overlay */}
          <HeroSection />

          {/* Content Sections */}
          <CategoriesSection />
          <PopularItemsSection />
          <DealsSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
  );
}