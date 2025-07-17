'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useCartStore } from '@/lib/store/cart'

export function useCartSync() {
  const { user, isLoaded } = useUser()
  
  // Always call hooks in the same order
  const setUser = useCartStore(state => state.setUser)
  const loadUserCart = useCartStore(state => state.loadUserCart)
  const mergeGuestCart = useCartStore(state => state.mergeGuestCart)
  const items = useCartStore(state => state.items)
  const userId = useCartStore(state => state.userId)
  const isCartLoading = useCartStore(state => state.isLoading)

  useEffect(() => {
    if (!isLoaded) return

    const handleUserChange = async () => {
      if (user?.id) {
        // User just signed in
        if (userId !== user.id) {
          const guestItems = [...items] // Save current guest cart
          setUser(user.id)
          
          // Load user's saved cart
          await loadUserCart(user.id)
          
          // Merge guest cart with user cart if guest had items
          if (guestItems.length > 0) {
            mergeGuestCart(guestItems)
          }
        }
      } else {
        // User signed out
        if (userId) {
          setUser(null)
          // Guest cart will be managed by localStorage persistence
        }
      }
    }

    handleUserChange()
  }, [user?.id, isLoaded, userId, items, setUser, loadUserCart, mergeGuestCart])

  return {
    isLoading: !isLoaded || isCartLoading,
    user,
    isAuthenticated: !!user
  }
}