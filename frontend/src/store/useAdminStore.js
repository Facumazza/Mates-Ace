import { create } from 'zustand'
import { api } from '../api/client'
import { PRODUCTS } from '../data/products'

// Los productos base (PRODUCTS) siguen siendo locales (catálogo estático).
// Los productos del admin se guardan en el backend y se sincronizan aquí.
export const useAdminStore = create((set, get) => ({
  adminProducts: [],
  loading: false,

  fetchAdminProducts: async (token) => {
    set({ loading: true })
    try {
      const data = await api.get('/products', token)
      set({ adminProducts: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  getAllProducts: () => [...PRODUCTS, ...get().adminProducts],

  addProduct: async (data, token) => {
    const payload = buildPayload(data)
    const product = await api.post('/products', payload, token)
    set((s) => ({ adminProducts: [...s.adminProducts, product] }))
    return product
  },

  updateProduct: async (id, data, token) => {
    const payload = buildPayload(data)
    const product = await api.put(`/products/${id}`, payload, token)
    set((s) => ({
      adminProducts: s.adminProducts.map((p) => (p.id === id ? product : p)),
    }))
    return product
  },

  deleteAdminProduct: async (id, token) => {
    await api.delete(`/products/${id}`, token)
    set((s) => ({ adminProducts: s.adminProducts.filter((p) => p.id !== id) }))
  },
}))

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function buildPayload(data) {
  return {
    name:         data.name,
    slug:         data.slug || generateSlug(data.name),
    category:     data.category,
    subcategory:  data.subcategory || null,
    description:  data.description || null,
    price:        data.price,
    originalPrice: data.originalPrice || null,
    images:       data.images?.length ? data.images : [],
    features:     data.features || [],
    variantsJson: data.variants ? JSON.stringify(data.variants) : null,
    badge:        data.badge || null,
    inStock:      data.inStock !== false,
    stock:        data.stock != null ? Number(data.stock) : null,
    weight:       data.weight || null,
    dimensions:   data.dimensions || null,
  }
}
