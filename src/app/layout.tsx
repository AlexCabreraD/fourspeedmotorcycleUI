import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'

import { CartProvider } from '@/components/CartProvider'

export const metadata: Metadata = {
  title: '4SpeedMotorcycle - Premium Motorcycle Parts & Accessories',
  description:
    'Shop premium motorcycle parts, accessories, and gear from top brands. Fast shipping, expert support, and competitive prices for all your motorcycle needs.',
  keywords:
    'motorcycle parts, motorcycle accessories, motorcycle gear, bike parts, motorcycle equipment',
  authors: [{ name: '4SpeedMotorcycle' }],
  openGraph: {
    title: '4SpeedMotorcycle - Premium Motorcycle Parts & Accessories',
    description: 'Shop premium motorcycle parts, accessories, and gear from top brands.',
    type: 'website',
    siteName: '4SpeedMotorcycle',
  },
  twitter: {
    card: 'summary_large_image',
    title: '4SpeedMotorcycle - Premium Motorcycle Parts & Accessories',
    description: 'Shop premium motorcycle parts, accessories, and gear from top brands.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en' className='scroll-smooth'>
        <body className='antialiased bg-slate-50 text-slate-900'>
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
