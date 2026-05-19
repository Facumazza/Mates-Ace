import { create } from 'zustand'
import { api } from '../api/client'

// items = array of productId strings (sincronizado con el backend cuando hay sesión)
// Para usuarios no logueados el array queda vacío.
export const useWishlistStore = create((set, get) => ({
  items: [],   // productId[]
  loading: false,

  fetchWishlist: async (token) => {
    if (!token) { set({ items: [] }); return }
    try {
      const data = await api.get('/wishlist', token)
      set({ items: data.items })
    } catch {
      set({ items: [] })
    }
  },

  toggle: async (product, token) => {
    const id = String(product.id)
    const already = get().items.includes(id)
    if (!token) return  // requiere login

    if (already) {
      set((s) => ({ items: s.items.filter((i) => i !== id) }))
      await api.delete(`/wishlist/${id}`, token).catch(() => {})
    } else {
      set((s) => ({ items: [...s.items, id] }))
      await api.post(`/wishlist/${id}`, {}, token).catch(() => {})
    }
  },

  isWishlisted: (id) => get().items.includes(String(id)),

  remove: async (id, token) => {
    set((s) => ({ items: s.items.filter((i) => i !== String(id)) }))
    if (token) await api.delete(`/wishlist/${String(id)}`, token).catch(() => {})
  },

  clear: () => set({ items: [] }),
}))
