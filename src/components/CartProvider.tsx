'use client'

import { useCartSync } from '@/hooks/useCartSync'
import { useWishlistSync } from '@/hooks/useWishlistSync'

export function CartProvider({ children }: { children: React.ReactNode }) {
  useCartSync()
  useWishlistSync()

  return <>{children}</>
}
