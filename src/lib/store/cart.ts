import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WPSItem } from '@/lib/api/wps-client'
import { type ShippingAddress, type ShippingRate } from '@/lib/services/shipping'

export interface CartItem extends WPSItem {
  quantity: number
  addedAt: Date
}

// Re-export types from shipping service for convenience
export type { ShippingRate, ShippingAddress } from '@/lib/services/shipping'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  userId: string | null
  isLoading: boolean
  // Shipping state
  shippingAddress: ShippingAddress | null
  availableShippingRates: ShippingRate[]
  selectedShippingRate: ShippingRate | null
  shippingCalculating: boolean
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
  // Shipping actions
  setShippingAddress: (address: ShippingAddress) => void
  calculateShippingRates: () => Promise<void>
  selectShippingRate: (rate: ShippingRate) => void
  clearShipping: () => void
  // Computed values
  getTotalPrice: () => number
  getTotalItems: () => number
  getShippingTotal: () => number
  getTaxTotal: () => number
  getGrandTotal: () => number
}

// Note: Selector functions have been replaced with instance methods in the store

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      userId: null,
      isLoading: false,
      // Shipping state
      shippingAddress: null,
      availableShippingRates: [],
      selectedShippingRate: null,
      shippingCalculating: false,
      
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
      },

      // Shipping actions
      setShippingAddress: (address: ShippingAddress) => {
        set({ shippingAddress: address })
        // Clear previous rates when address changes
        set({ availableShippingRates: [], selectedShippingRate: null })
      },

      calculateShippingRates: async () => {
        const state = get()
        
        if (!state.shippingAddress || state.items.length === 0) {
          console.warn('Cannot calculate shipping: missing address or items')
          return
        }

        set({ shippingCalculating: true })

        try {
          const response = await fetch('/api/shipping/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: state.shippingAddress,
              items: state.items.map(item => ({
                id: item.id,
                sku: item.sku,
                name: item.name,
                quantity: item.quantity,
                list_price: item.list_price,
                weight: item.weight,
                product_type: item.product_type
              }))
            })
          })

          const result = await response.json()

          if (result.success) {
            set({ 
              availableShippingRates: result.rates,
              selectedShippingRate: result.rates[0] || null // Auto-select cheapest option
            })
          } else {
            console.error('Shipping calculation failed:', result.error)
            // Set fallback rates
            set({ 
              availableShippingRates: [],
              selectedShippingRate: null
            })
          }
        } catch (error) {
          console.error('Shipping calculation error:', error)
          set({ 
            availableShippingRates: [],
            selectedShippingRate: null
          })
        } finally {
          set({ shippingCalculating: false })
        }
      },

      selectShippingRate: (rate: ShippingRate) => {
        set({ selectedShippingRate: rate })
      },

      clearShipping: () => {
        set({ 
          shippingAddress: null,
          availableShippingRates: [],
          selectedShippingRate: null,
          shippingCalculating: false
        })
      },

      // Computed values
      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          const price = parseFloat(item.list_price) || 0
          return total + (price * item.quantity)
        }, 0)
      },

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getShippingTotal: () => {
        const state = get()
        
        // Only return shipping cost if a shipping rate is actually selected
        if (state.selectedShippingRate) {
          return state.selectedShippingRate.rate
        }
        
        // Return 0 until shipping method is selected
        return 0
      },

      getTaxTotal: () => {
        const state = get()
        const total = state.items.reduce((total, item) => {
          const price = parseFloat(item.list_price) || 0
          return total + (price * item.quantity)
        }, 0)
        return total * 0.085
      },

      getGrandTotal: () => {
        const state = get()
        const total = state.items.reduce((total, item) => {
          const price = parseFloat(item.list_price) || 0
          return total + (price * item.quantity)
        }, 0)
        const shipping = total > 99 ? 0 : 12.95
        const tax = total * 0.085
        return total + shipping + tax
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