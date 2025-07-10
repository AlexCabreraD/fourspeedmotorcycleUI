'use client'

import { useState } from 'react'
import HeroSection from '@/components/home/HeroSection'
import HeroVariants from '@/components/home/HeroVariants'

export default function HeroTestPage() {
  const [activeVariant, setActiveVariant] = useState<'split' | 'centered' | 'minimal' | 'dynamic'>('split')

  const variants = [
    { 
      key: 'split' as const, 
      name: 'Split Layout', 
      description: 'Text left, visual elements right - professional and balanced' 
    },
    { 
      key: 'centered' as const, 
      name: 'Centered Impact', 
      description: 'Massive typography, center-focused - dramatic and bold' 
    },
    { 
      key: 'minimal' as const, 
      name: 'Minimal Clean', 
      description: 'Bottom-left positioning, subtle design - elegant and refined' 
    },
    { 
      key: 'dynamic' as const, 
      name: 'Dynamic Layout', 
      description: 'Adaptive positioning, floating elements - modern and flexible' 
    }
  ]

  return (
    <div className="min-h-screen bg-steel-50">
      {/* Hero Section */}
      {activeVariant === 'split' ? (
        <HeroSection />
      ) : (
        <HeroVariants variant={activeVariant} />
      )}
      
      {/* Control Panel */}
      <div className="fixed top-20 left-4 z-50 bg-white rounded-xl shadow-xl border border-steel-200 p-6 max-w-sm">
        <h3 className="font-bold text-steel-900 mb-4">Hero Layout Testing</h3>
        <p className="text-sm text-steel-600 mb-6">
          Switch between different hero section layouts to see various approaches based on motorcycle industry research.
        </p>
        
        <div className="space-y-3">
          {variants.map((variant) => (
            <button
              key={variant.key}
              onClick={() => setActiveVariant(variant.key)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                activeVariant === variant.key
                  ? 'bg-primary-50 border-primary-200 text-primary-900'
                  : 'bg-steel-50 border-steel-200 text-steel-700 hover:bg-steel-100'
              }`}
            >
              <div className="font-medium">{variant.name}</div>
              <div className="text-xs text-steel-500 mt-1">{variant.description}</div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-steel-200">
          <p className="text-xs text-steel-500">
            Research-based designs inspired by Tesla, Harley Davidson, and other leading automotive/motorcycle brands.
          </p>
        </div>
      </div>
    </div>
  )
}