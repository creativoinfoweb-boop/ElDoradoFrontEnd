'use client'

import { SignUp, useAuth } from '@clerk/nextjs'
import { ClerkSessionGate } from '@/components/auth/ClerkSessionGate'
import { Check } from 'lucide-react'

const perks = [
  '7 giorni di trial gratuito — nessuna carta richiesta',
  'Copy trading automatico su XAU/USD',
  'Performance reali e verificate',
  'Cancella quando vuoi, senza vincoli',
  'Supporto prioritario incluso',
]

export default function RegisterPage() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04040A]">
        <p className="text-sm text-[#6B6B8A]">Caricamento…</p>
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-[#04040A]">
        <ClerkSessionGate />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#04040A] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" style={{ opacity: 0.1 }} />
        <div className="aurora-orb aurora-orb-2" style={{ opacity: 0.06 }} />
      </div>
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div className="relative w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center animate-fade-in-up">

        {/* Left panel */}
        <div className="hidden lg:block space-y-8">
          <div>
            <div className="mb-5"><img src="/eldorado.jpg" alt="El Dorado" style={{ width: 64, height: 64, borderRadius: '50%', border: '1.5px solid rgba(240,180,41,0.35)', objectFit: 'cover', objectPosition: 'top center', flexShrink: 0 }} /></div>
            <h1 className="text-3xl font-black text-gradient-gold leading-tight">El Dorado</h1>
            <p className="text-sm text-[#6B6B8A] mt-2">Copy Trading Professionale su XAU/USD</p>
          </div>
          <div className="space-y-4">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)' }}>
                  <Check className="w-3.5 h-3.5 text-[#00E676]" />
                </div>
                <p className="text-sm text-[#A0A0B8]">{p}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl text-xs text-[#6B6B8A] leading-relaxed" style={{ background: 'rgba(240,180,41,0.04)', border: '1px solid rgba(240,180,41,0.12)' }}>
            Nessuna EA da installare. Inserisci le credenziali MT5 nel pannello — il nostro server fa tutto in automatico 24/7.
          </div>
        </div>

        {/* Right panel */}
        <div>
          <div className="text-center mb-6 lg:hidden">
            <div className="mx-auto mb-3 flex justify-center"><img src="/eldorado.jpg" alt="El Dorado" style={{ width: 56, height: 56, borderRadius: '50%', border: '1.5px solid rgba(240,180,41,0.35)', objectFit: 'cover', objectPosition: 'top center', flexShrink: 0 }} /></div>
            <h1 className="text-xl font-black text-gradient-gold">El Dorado</h1>
          </div>

          <SignUp
            signInUrl="/auth/login"
            forceRedirectUrl="/auth/clerk-callback"
            fallbackRedirectUrl="/auth/clerk-callback"
          />
        </div>
      </div>
    </div>
  )
}
