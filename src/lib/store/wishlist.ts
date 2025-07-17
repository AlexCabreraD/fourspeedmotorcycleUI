'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: string
  image: string
  brand?: string
  sku?: string
  slug?: string
  addedDate?: string
  productType?: string
}

interface WishlistState {
  items: WishlistItem[]
  userId: string | null
  isLoading: boolean
  isSaving: boolean
  
  // Actions
  addItem: (item: WishlistItem) => void
  removeItem: (itemId: string) => void
  removeItems: (itemIds: string[]) => void
  clearWishlist: () => void
  isInWishlist: (itemId: string) => boolean
  toggleItem: (item: WishlistItem) => void
  
  // User management
  setUserId: (userId: string | null) => void
  loadUserWishlist: () => Promise<void>
  saveUserWishlist: () => Promise<void>
  mergeGuestWishlist: (guestItems: WishlistItem[]) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      isLoading: false,
      isSaving: false,

      addItem: (item: WishlistItem) => {
        const { items, userId } = get()
        
        // Check if item already exists
        if (items.find(existingItem => existingItem.id === item.id)) {
          return
        }

        // Add current date if not provided
        const itemWithDate = {
          ...item,
          addedDate: item.addedDate || new Date().toISOString()
        }

        const newItems = [...items, itemWithDate]
        set({ items: newItems })

        // Save to user metadata if logged in
        if (userId) {
          get().saveUserWishlist()
        }
      },

      removeItem: (itemId: string) => {
        const { items, userId } = get()
        const newItems = items.filter(item => item.id !== itemId)
        set({ items: newItems })

        // Save to user metadata if logged in
        if (userId) {
          get().saveUserWishlist()
        }
      },

      removeItems: (itemIds: string[]) => {
        const { items, userId } = get()
        const newItems = items.filter(item => !itemIds.includes(item.id))
        set({ items: newItems })

        // Save to user metadata if logged in
        if (userId) {
          get().saveUserWishlist()
        }
      },

      clearWishlist: () => {
        const { userId } = get()
        set({ items: [] })

        // Save to user metadata if logged in
        if (userId) {
          get().saveUserWishlist()
        }
      },

      isInWishlist: (itemId: string) => {
        const { items } = get()
        return items.some(item => item.id === itemId)
      },

      toggleItem: (item: WishlistItem) => {
        const { items, addItem, removeItem } = get()
        const existingItem = items.find(existingItem => existingItem.id === item.id)
        
        if (existingItem) {
          removeItem(item.id)
        } else {
          addItem(item)
        }
      },

      setUserId: (userId: string | null) => {
        set({ userId })
      },

      loadUserWishlist: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/user/wishlist', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.wishlist) {
              set({ items: data.wishlist })
            }
          }
        } catch (error) {
          console.error('Failed to load user wishlist:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      saveUserWishlist: async () => {
        const { items, isSaving } = get()
        
        // Prevent concurrent saves
        if (isSaving) return
        
        set({ isSaving: true })
        try {
          await fetch('/api/user/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ wishlist: items }),
          })
        } catch (error) {
          console.error('Failed to save user wishlist:', error)
        } finally {
          set({ isSaving: false })
        }
      },

      mergeGuestWishlist: (guestItems: WishlistItem[]) => {
        const { items } = get()
        const mergedItems = [...items]

        // Add guest items that don't already exist
        guestItems.forEach(guestItem => {
          if (!mergedItems.find(item => item.id === guestItem.id)) {
            mergedItems.push(guestItem)
          }
        })

        set({ items: mergedItems })
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.userId ? [] : state.items, // Only persist guest items locally
      }),
    }
  )
)

// Selectors
export const selectWishlistItems = (state: WishlistState) => state.items
export const selectWishlistCount = (state: WishlistState) => state.items.length
export const selectIsInWishlist = (itemId: string) => (state: WishlistState) => 
  state.items.some(item => item.id === itemId)