'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser, useClerk } from '@clerk/nextjs'
import { useAuthStore } from '@/store/auth'
import api, { getApiErrorMessage } from '@/lib/api'

export default function ClerkCallbackPage() {
  const router = useRouter()
  const { getToken, userId, isLoaded } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerk()
  const { setToken, setUser } = useAuthStore()
  const ran = useRef(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!isLoaded || !userLoaded) return

    if (!userId) {
      router.replace('/auth/login')
      return
    }

    if (ran.current) return
    ran.current = true
    setSyncError(null)

    const sync = async () => {
      try {
        const clerkToken = await getToken()
        if (!clerkToken) {
          throw new Error('Nessun session token Clerk')
        }

        const email =
          user?.primaryEmailAddress?.emailAddress ||
          user?.emailAddresses?.[0]?.emailAddress
        const fullName = user?.fullName || user?.firstName || undefined

        const res = await api.post('/auth/clerk-sync', {
          clerk_token: clerkToken,
          email: email || undefined,
          full_name: fullName || undefined,
        })
        const { access_token, refresh_token } = res.data
        if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
        setToken(access_token)
        const me = await api.get('/auth/me')
        setUser(me.data)
        let nextPath = '/dashboard'
        if (typeof window !== 'undefined') {
          const stored = sessionStorage.getItem('eldorado_post_auth_path')
          if (stored) {
            sessionStorage.removeItem('eldorado_post_auth_path')
            nextPath = stored.startsWith('/') ? stored : '/dashboard'
          }
        }
        router.replace(nextPath)
      } catch (err) {
        console.error('[clerk-callback]', err)
        const msg = getApiErrorMessage(
          err,
          'Sincronizzazione account fallita. Controlla backend attivo e che CLERK_JWKS_URL / chiavi nel .env corrispondano a questa applicazione Clerk.'
        )
        setSyncError(msg)
      }
    }

    void sync()
  }, [isLoaded, userLoaded, userId, user, getToken, router, setToken, setUser, retryKey])

  const handleRetry = () => {
    ran.current = false
    setSyncError(null)
    setRetryKey(k => k + 1)
  }

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/auth/login' })
  }

  return (
    <div className="min-h-screen bg-[#04040A] flex flex-col items-center justify-center gap-4 px-4">
      <div className={syncError ? '' : 'animate-pulse'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/eldorado.jpg"
          alt="El Dorado"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '1.5px solid rgba(240,180,41,0.35)',
            objectFit: 'cover',
            objectPosition: 'top center',
            flexShrink: 0,
          }}
        />
      </div>
      {syncError ? (
        <div className="max-w-md text-center space-y-4">
          <p className="text-sm text-[#FF3D71] font-medium">Impossibile completare l&apos;accesso</p>
          <p className="text-xs text-[#6B6B8A] leading-relaxed">{syncError}</p>
          <p className="text-[10px] text-[#3D3D5C] leading-relaxed">
            Dopo aver creato una <strong className="text-[#A1A1AA]">nuova app</strong> su Clerk, aggiorna{' '}
            <code className="text-[#F0B429]">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> nel frontend e{' '}
            <code className="text-[#F0B429]">CLERK_SECRET_KEY</code> +{' '}
            <code className="text-[#F0B429]">CLERK_JWKS_URL</code> nel backend (stessa istanza Development).
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #F0B429, #E8A020)', color: '#08080F' }}
            >
              Riprova
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl px-4 py-2.5 text-sm border border-white/10 text-[#A1A1AA]"
            >
              Esci e torna al login
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[#6B6B8A] text-sm">Accesso in corso…</p>
      )}
    </div>
  )
}
