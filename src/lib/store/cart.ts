import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WPSItem } from '@/lib/api/wps-client'

export interface CartItem extends WPSItem {
  quantity: number
  addedAt: Date
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  userId: string | null
  isLoading: boolean
  // Actions
  addItem: (item: WPSItem, quantity?: number) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  closeCart: () => void
  // User-specific actions
  setUser: (userId: string | null) => void
  loadUserCart: (userId: string) => Promise<void>
  saveUserCart: (userId: string) => Promise<void>
  mergeGuestCart: (guestItems: CartItem[]) => void
}

// Selectors
export const selectTotalItems = (state: CartState) => 
  state.items.reduce((total, item) => total + item.quantity, 0)

export const selectTotalPrice = (state: CartState) => 
  state.items.reduce((total, item) => {
    const price = parseFloat(item.list_price) || 0
    return total + (price * item.quantity)
  }, 0)

export const selectShippingTotal = (state: CartState) => {
  const total = selectTotalPrice(state)
  return total > 99 ? 0 : 12.95
}

export const selectTaxTotal = (state: CartState) => {
  return selectTotalPrice(state) * 0.085
}

export const selectGrandTotal = (state: CartState) => {
  return selectTotalPrice(state) + selectShippingTotal(state) + selectTaxTotal(state)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      userId: null,
      isLoading: false,
      
      addItem: (item: WPSItem, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(cartItem => cartItem.id === item.id)
          
          if (existingItem) {
            // Update quantity if item exists
            const newItems = state.items.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            )
            return { items: newItems }
          } else {
            // Add new item
            const newItems = [...state.items, { ...item, quantity, addedAt: new Date() }]
            return { items: newItems }
          }
        })
        
        // Auto-save to user account if logged in
        const state = get()
        if (state.userId) {
          state.saveUserCart(state.userId)
        }
      },
      
      removeItem: (itemId: number) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
        
        // Auto-save to user account if logged in
        const state = get()
        if (state.userId) {
          state.saveUserCart(state.userId)
        }
      },
      
      updateQuantity: (itemId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
        
        // Auto-save to user account if logged in
        const state = get()
        if (state.userId) {
          state.saveUserCart(state.userId)
        }
      },
      
      clearCart: () => {
        set({ items: [] })
        
        // Auto-save to user account if logged in
        const state = get()
        if (state.userId) {
          state.saveUserCart(state.userId)
        }
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      setUser: (userId: string | null) => {
        set({ userId })
      },
      
      loadUserCart: async (userId: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`/api/cart/${userId}`)
          if (response.ok) {
            const userData = await response.json()
            if (userData.cart) {
              set({ items: userData.cart, userId })
            }
          }
        } catch (error) {
          console.error('Failed to load user cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      
      saveUserCart: async (userId: string) => {
        const state = get()
        try {
          await fetch(`/api/cart/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: state.items })
          })
        } catch (error) {
          console.error('Failed to save user cart:', error)
        }
      },
      
      mergeGuestCart: (guestItems: CartItem[]) => {
        set((state) => {
          const mergedItems = [...state.items]
          
          guestItems.forEach(guestItem => {
            const existingItem = mergedItems.find(item => item.id === guestItem.id)
            if (existingItem) {
              existingItem.quantity += guestItem.quantity
            } else {
              mergedItems.push(guestItem)
            }
          })
          
          return { items: mergedItems }
        })
        
        // Auto-save merged cart
        const state = get()
        if (state.userId) {
          state.saveUserCart(state.userId)
        }
      }
    }),
    {
      name: 'fourspeed-cart',
      partialize: (state) => ({ 
        items: state.userId ? [] : state.items // Only persist guest cart items
      }),
    }
  )
)