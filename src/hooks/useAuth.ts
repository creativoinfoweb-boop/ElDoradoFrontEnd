'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import api from '@/lib/api'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials extends LoginCredentials {
  name: string
  confirmPassword: string
}

export function useAuth() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, setUser, setToken, logout, initialize } =
    useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await api.post('/auth/login', credentials)
        const { user: userData, token: authToken } = response.data

        setToken(authToken)
        setUser(userData)

        router.push('/dashboard')
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Login failed',
        }
      }
    },
    [setToken, setUser, router]
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        const { confirmPassword, ...payload } = credentials
        const response = await api.post('/auth/register', payload)
        const { user: userData, token: authToken } = response.data

        setToken(authToken)
        setUser(userData)

        router.push('/dashboard')
        return { success: true }
      } catch (error) {
        console.error('Register error:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Registration failed',
        }
      }
    },
    [setToken, setUser, router]
  )

  const logoutUser = useCallback(() => {
    logout()
    router.push('/auth/login')
  }, [logout, router])

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logoutUser()
      return null
    }
  }, [setUser, logoutUser])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: logoutUser,
    refreshUser,
  }
}
