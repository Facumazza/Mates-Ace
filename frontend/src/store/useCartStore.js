import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, quantity = 1, variant = null) => {
        const items = get().items
        const key = `${product.id}-${variant?.value ?? 'default'}`
        const existing = items.find((i) => i.key === key)
        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              { key, product, quantity, variant, addedAt: Date.now() },
            ],
          })
        }
        set({ isOpen: true })
      },

      removeItem: (key) =>
        set((s) => ({ items: s.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) => {
        if (quantity < 1) {
          get().removeItem(key)
          return
        }
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        )
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'mates-ace-cart' }
  )
)
