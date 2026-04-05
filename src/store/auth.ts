import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true })
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Qui chiameremo l'API reale
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          })

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', data.token)
          }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('auth-storage')
        }
      },

      initialize: () => {
        if (typeof window === 'undefined') return
        let token = localStorage.getItem('auth_token')
        if (!token) {
          try {
            const raw = localStorage.getItem('auth-storage')
            if (raw) {
              const parsed = JSON.parse(raw) as { state?: { token?: string | null } }
              const zt = parsed?.state?.token
              if (typeof zt === 'string' && zt.length > 0) {
                token = zt
                localStorage.setItem('auth_token', zt)
              }
            }
          } catch {
            /* ignore */
          }
        }
        if (token) {
          set({ token, isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
