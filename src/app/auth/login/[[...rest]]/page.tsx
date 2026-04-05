'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { ClerkSessionGate } from '@/components/auth/ClerkSessionGate'

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030308' }}>
        <p className="text-sm" style={{ color: 'rgba(110,110,140,0.7)' }}>
          Caricamento…
        </p>
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen" style={{ background: '#030308' }}>
        <ClerkSessionGate />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#030308' }}
    >
      {/* Cyber grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(240,180,41,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,0.018) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Gold ambient top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(240,180,41,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm animate-fade-in-up">

        {/* Brand header */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/eldorado.jpg"
            alt="El Dorado"
            className="gold-avatar-ring mx-auto mb-4"
            style={{ width: 64, height: 64, display: 'block' }}
          />
          <div className="brand-cinzel text-lg tracking-[0.2em] mb-1">EL DORADO</div>
          <p className="text-xs" style={{ color: 'rgba(110,110,140,0.7)' }}>
            Copy Trading Professionale su XAU/USD
          </p>
        </div>

        <SignIn
          signUpUrl="/auth/register"
          forceRedirectUrl="/auth/clerk-callback"
          fallbackRedirectUrl="/auth/clerk-callback"
        />

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {['Trial 7 giorni', 'No carta richiesta', 'Cancella quando vuoi'].map(t => (
            <span key={t} className="text-[9px] font-medium" style={{ color: 'rgba(80,80,105,0.8)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
