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
  // Actions
  addItem: (item: WPSItem, quantity?: number) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  closeCart: () => void
  // Computed values
  totalItems: number
  totalPrice: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item: WPSItem, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(cartItem => cartItem.id === item.id)
          
          if (existingItem) {
            // Update quantity if item exists
            return {
              items: state.items.map(cartItem =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem
              )
            }
          } else {
            // Add new item
            return {
              items: [...state.items, { ...item, quantity, addedAt: new Date() }]
            }
          }
        })
      },
      
      removeItem: (itemId: number) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
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
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      // Computed values
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      get totalPrice() {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.list_price) || 0
          return total + (price * item.quantity)
        }, 0)
      },
      
      get shippingTotal() {
        const total = get().totalPrice
        // Free shipping over $99, otherwise $12.95
        return total > 99 ? 0 : 12.95
      },
      
      get taxTotal() {
        // 8.5% tax rate (can be configurable)
        return get().totalPrice * 0.085
      },
      
      get grandTotal() {
        return get().totalPrice + get().shippingTotal + get().taxTotal
      }
    }),
    {
      name: 'fourspeed-cart',
      partialize: (state) => ({ items: state.items }), // Only persist cart items
    }
  )
)