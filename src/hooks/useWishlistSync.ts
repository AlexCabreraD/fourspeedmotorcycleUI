'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

import { useWishlistStore } from '@/lib/store/wishlist'

export function useWishlistSync() {
  const { user, isLoaded } = useUser()
  const setUserId = useWishlistStore((state) => state.setUserId)
  const loadUserWishlist = useWishlistStore((state) => state.loadUserWishlist)
  const saveUserWishlist = useWishlistStore((state) => state.saveUserWishlist)
  const mergeGuestWishlist = useWishlistStore((state) => state.mergeGuestWishlist)
  const syncedUserRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (user?.id) {
      // Only sync once per user login
      if (syncedUserRef.current === user.id) {
        return
      }

      const currentState = useWishlistStore.getState()
      const wasGuest = !currentState.userId
      const guestItems = wasGuest ? [...currentState.items] : []

      // Set user ID
      setUserId(user.id)
      syncedUserRef.current = user.id

      // Load user's wishlist and merge with guest items
      if (wasGuest && guestItems.length > 0) {
        loadUserWishlist().then(() => {
          mergeGuestWishlist(guestItems)
          saveUserWishlist()
        })
      } else {
        loadUserWishlist()
      }
    } else {
      // User signed out
      setUserId(null)
      syncedUserRef.current = null
    }
  }, [user?.id, isLoaded, setUserId, loadUserWishlist, saveUserWishlist, mergeGuestWishlist])
}
