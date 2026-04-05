'use client'

/**
 * Evita il loop: Clerk session attiva → /auth/login → redirect → /dashboard senza JWT → di nuovo login.
 * Se sei già loggato con Clerk:
 * - con API token → dashboard
 * - senza API token → /auth/clerk-callback (sync JWT backend)
 */
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function ClerkSessionGate() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (apiToken) {
      router.replace('/dashboard')
    } else {
      router.replace('/auth/clerk-callback')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3"
      style={{ background: 'var(--bg, #030308)' }}
    >
      <p className="text-sm" style={{ color: 'var(--text-muted, #6B6B8A)' }}>
        Reindirizzamento…
      </p>
    </div>
  )
}
