'use client'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, Shield, Zap, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Hero Background with Dramatic Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/assets/craftsmanship-workshop-mechanic.JPG"
          alt="Motorcycle Workshop"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex">
        
        {/* Left Side - Brand Story & Welcome */}
        <div className="hidden lg:flex lg:w-3/5 relative">
          <div className={`flex flex-col justify-between p-16 xl:p-24 text-white h-full transition-all duration-1500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            
            {/* Top Section - Logo */}
            <div className="space-y-8">
              <div className="flex items-center">
                <Link href="/" className="group">
                  <img 
                    src="/assets/4speedMotorcylceLogo.svg" 
                    alt="4Speed Motorcycle" 
                    className="h-12 w-auto filter brightness-0 invert transition-all duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Premium Badge */}
              <div className="inline-block px-6 py-3 bg-orange-500 text-white text-sm font-bold uppercase tracking-[0.2em] rounded-full">
                Join Community
              </div>
            </div>

            {/* Center Section - Main Headline */}
            <div className="max-w-2xl space-y-8">
              <h1 className="text-6xl xl:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block text-white drop-shadow-2xl">Join the</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
                  Ride
                </span>
                <span className="block text-white/90 text-2xl font-light tracking-wider mt-4">START YOUR JOURNEY</span>
              </h1>
              
              <div className="w-24 h-1 bg-orange-500"></div>
              
              <p className="text-xl xl:text-2xl text-white/90 leading-relaxed font-light max-w-lg">
                Become part of a passionate community of riders. Access exclusive parts, track orders, and connect with fellow enthusiasts.
              </p>
            </div>

            {/* Bottom Section - Community Features */}
            <div className="space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Community Access</h3>
                    <p className="text-white/70 text-sm">Connect with passionate riders</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Exclusive Access</h3>
                    <p className="text-white/70 text-sm">Early access to new parts</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-white/80 font-medium">Powered by WPS Distribution - Trusted by thousands of riders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-2/5 bg-white flex flex-col relative">
          
          {/* Subtle Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#f97316_1px,transparent_1px),linear-gradient(-45deg,#f97316_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>

          <div className={`relative z-10 flex flex-col h-full p-8 lg:p-12 transition-all duration-1500 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-12">
              <img 
                src="/assets/4speedMotorcylceLogo.svg" 
                alt="4Speed Motorcycle" 
                className="h-12 w-auto mx-auto mb-6"
              />
              <h1 className="text-3xl font-black text-steel-900 mb-2">
                Join the <span className="text-orange-600">Community</span>
              </h1>
              <p className="text-steel-600">Start your motorcycle journey</p>
            </div>

            {/* Desktop Back Button */}
            <div className="hidden lg:block mb-8">
              <Link 
                href="/sign-in" 
                className="inline-flex items-center space-x-2 text-steel-500 hover:text-steel-900 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Return to sign in</span>
              </Link>
            </div>

            {/* Main Sign Up Container */}
            <div className="flex-1 flex flex-col justify-center w-full">
              
              {/* Header Section */}
              <div className="text-center mb-12 px-8">
                <h2 className="text-3xl font-bold text-steel-900 mb-3">Start Your Journey</h2>
                <p className="text-steel-500 text-base">Join the motorcycle community</p>
              </div>

              {/* Clerk Sign Up Component */}
              <div className="max-w-md mx-auto w-full" style={{ placeItems: 'center' }}>
                <SignUp 
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  redirectUrl="/"
                />
              </div>

              {/* Bottom Links */}
              <div className="text-center mt-8 px-8">
                <div className="lg:hidden">
                  <Link 
                    href="/sign-in" 
                    className="inline-flex items-center space-x-2 text-steel-400 hover:text-steel-600 text-sm transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Return to sign in</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}