'use client'

import { useEffect, useRef } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

interface OAuthButtonsProps {
  mode: 'login' | 'register'
}

export default function OAuthButtons({ mode }: OAuthButtonsProps) {
  const router = useRouter()
  const { setToken, setUser } = useAuthStore()
  const googleBtnRef = useRef<HTMLDivElement>(null)

  // ─── Handle credential from Google ────────────────────
  const handleGoogleCredential = async (response: { credential: string }) => {
    try {
      const res = await api.post('/auth/google', { credential: response.credential })
      const { access_token, refresh_token } = res.data
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      setToken(access_token)
      const me = await api.get('/auth/me')
      setUser(me.data)
      router.push('/dashboard')
    } catch {
      console.error('Google login failed')
    }
  }

  // ─── Load Google GSI script ───────────────────────────
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const existingScript = document.getElementById('google-gsi')
    const initGoogle = () => {
      const g = (window as unknown as { google: { accounts: { id: { initialize: (cfg: object) => void; renderButton: (el: HTMLElement, cfg: object) => void } } } }).google
      if (!g?.accounts?.id) return
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        use_fedcm_for_prompt: true,
      })
      if (googleBtnRef.current) {
        g.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: googleBtnRef.current.offsetWidth || 400,
          text: mode === 'register' ? 'signup_with' : 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        })
      }
    }

    if (existingScript) {
      initGoogle()
    } else {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.id = 'google-gsi'
      script.async = true
      script.defer = true
      script.onload = initGoogle
      document.head.appendChild(script)
    }
  }, [mode])

  // ─── Apple Sign In ─────────────────────────────────────
  useEffect(() => {
    const existingScript = document.getElementById('apple-signin')
    const initApple = () => {
      const apple = (window as unknown as { AppleID: { auth: { init: (cfg: object) => void; signIn: () => Promise<{ authorization: { id_token: string }; user?: { name?: { firstName?: string; lastName?: string } } }> } } }).AppleID
      if (!apple?.auth) return
      apple.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'com.goldbotboss.app',
        scope: 'name email',
        redirectURI: typeof window !== 'undefined' ? window.location.origin + '/auth/apple/callback' : '',
        usePopup: true,
      })
    }
    if (existingScript) {
      initApple()
    } else {
      const script = document.createElement('script')
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
      script.id = 'apple-signin'
      script.async = true
      script.onload = initApple
      document.head.appendChild(script)
    }
  }, [])

  const handleApple = async () => {
    try {
      const apple = (window as unknown as { AppleID: { auth: { signIn: () => Promise<{ authorization: { id_token: string }; user?: { name?: { firstName?: string; lastName?: string } } }> } } }).AppleID
      const data = await apple.auth.signIn()
      const id_token = data.authorization.id_token
      const name = data.user?.name
        ? [data.user.name.firstName, data.user.name.lastName].filter(Boolean).join(' ')
        : undefined

      const res = await api.post('/auth/apple', { id_token, name })
      const { access_token, refresh_token } = res.data
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      setToken(access_token)
      const me = await api.get('/auth/me')
      setUser(me.data)
      router.push('/dashboard')
    } catch {
      console.error('Apple login failed')
    }
  }

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] text-[#3D3D5C] uppercase tracking-widest font-medium">oppure continua con</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Google — rendered by GSI SDK */}
      {GOOGLE_CLIENT_ID ? (
        <div
          ref={googleBtnRef}
          className="w-full rounded-xl overflow-hidden"
          style={{ minHeight: 44 }}
        />
      ) : (
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-sm font-medium text-[#6B6B8A] cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <GoogleIcon />
          {mode === 'register' ? 'Registrati con Google' : 'Accedi con Google'}
          <span className="text-[10px] opacity-50 ml-auto">(configura GOOGLE_CLIENT_ID)</span>
        </button>
      )}

      {/* Apple */}
      <button
        type="button"
        onClick={handleApple}
        className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      >
        <AppleIcon />
        {mode === 'register' ? 'Registrati con Apple' : 'Accedi con Apple'}
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="white">
      <path d="M13.769 10.557c-.022-2.379 1.946-3.533 2.034-3.59-1.11-1.622-2.837-1.843-3.448-1.868-1.467-.149-2.871.864-3.616.864-.745 0-1.894-.845-3.116-.821-1.598.023-3.076.928-3.898 2.353C.032 10.276.78 14.39 2.465 16.62c.837 1.192 1.831 2.527 3.137 2.479 1.26-.051 1.738-.807 3.26-.807 1.523 0 1.957.807 3.284.782 1.357-.023 2.213-1.213 3.037-2.414.963-1.383 1.358-2.727 1.38-2.797-.03-.013-2.644-1.013-2.668-3.306h-.126zM11.334 3.427C12.007 2.607 12.47 1.48 12.34.33c-.963.039-2.13.642-2.825 1.441C8.851 2.554 8.316 3.7 8.466 4.829c1.073.083 2.172-.544 2.868-1.402z"/>
    </svg>
  )
}
