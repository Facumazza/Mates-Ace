import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../api/client'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      modalOpen: false,
      modalTab: 'login',

      openModal:    (tab = 'login') => set({ modalOpen: true, modalTab: tab }),
      closeModal:   ()              => set({ modalOpen: false }),
      setModalTab:  (tab)           => set({ modalTab: tab }),

      register: async (name, email, password) => {
        try {
          const data = await api.post('/auth/register', { name, email, password })
          set({ currentUser: data.user, token: data.token, modalOpen: false })
          return { ok: true }
        } catch (err) {
          return { ok: false, error: err.message }
        }
      },

      login: async (email, password) => {
        try {
          const data = await api.post('/auth/login', { email, password })
          set({ currentUser: data.user, token: data.token, modalOpen: false })
          return { ok: true }
        } catch (err) {
          return { ok: false, error: err.message }
        }
      },

      logout: () => {
        const token = get().token
        if (token) {
          fetch('/api/auth/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {})
        }
        set({ currentUser: null, token: null })
      },

      updateName: async (name) => {
        const token = get().token
        try {
          const data = await api.patch('/auth/profile', { name }, token)
          set({ currentUser: data.user, token: data.token })
          return { ok: true }
        } catch (err) {
          return { ok: false, error: err.message }
        }
      },
    }),
    {
      name: 'mates-ace-auth',
      partialize: (s) => ({ currentUser: s.currentUser, token: s.token }),
    }
  )
)
