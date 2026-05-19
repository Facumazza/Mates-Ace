import { create } from 'zustand'
import { api } from '../api/client'

export const useOrdersStore = create((set) => ({
  orders: [],
  loading: false,

  fetchMyOrders: async (token) => {
    set({ loading: true })
    try {
      const data = await api.get('/orders/mine', token)
      set({ orders: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  fetchAllOrders: async (token) => {
    set({ loading: true })
    try {
      const data = await api.get('/orders', token)
      set({ orders: data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addOrder: async (items, total, channel, token, shipping = {}) => {
    const payload = {
      total,
      channel,
      shippingFirstName: shipping.firstName ?? '',
      shippingLastName:  shipping.lastName  ?? '',
      shippingPhone:     shipping.phone     ?? '',
      shippingAddress:   shipping.address   ?? '',
      items: items.map((i) => ({
        productId:    String(i.product.id),
        productName:  i.product.name,
        productPrice: i.product.price,
        quantity:     i.quantity,
        subtotal:     i.product.price * i.quantity,
        variant:      i.variant?.label ?? null,
      })),
    }
    const order = await api.post('/orders', payload, token)
    set((s) => ({ orders: [order, ...s.orders] }))
    return order
  },
}))
