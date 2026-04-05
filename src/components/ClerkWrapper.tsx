'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { itIT } from '@clerk/localizations'
import type { ReactNode } from 'react'

const clerkAppearance = {
  variables: {
    colorPrimary: '#F0B429',
    colorBackground: '#0D0D1A',
    colorInputBackground: '#04040A',
    colorInputText: '#F0F0F5',
    colorText: '#F0F0F5',
    colorTextSecondary: '#6B6B8A',
    colorDanger: '#FF3D71',
    borderRadius: '0.75rem',
    fontFamily: 'var(--font-inter), sans-serif',
  },
  elements: {
    card: {
      background: 'rgba(13,13,26,0.95)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
    },
    headerTitle: { color: '#F0F0F5', fontWeight: '800' },
    headerSubtitle: { color: '#6B6B8A' },
    socialButtonsBlockButton: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#F0F0F5',
    },
    socialButtonsBlockButtonText: { color: '#F0F0F5', fontWeight: '500' },
    dividerLine: { background: 'rgba(255,255,255,0.06)' },
    dividerText: { color: '#3D3D5C' },
    formFieldLabel: {
      color: '#6B6B8A',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    formFieldInput: {
      background: 'rgba(4,4,10,0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#F0F0F5',
    },
    formButtonPrimary: {
      background: 'linear-gradient(135deg, #F0B429, #E8A020)',
      color: '#08080F',
      fontWeight: '700',
    },
    footerActionLink: { color: '#F0B429' },
    identityPreviewText: { color: '#F0F0F5' },
    formResendCodeLink: { color: '#F0B429' },
  },
}

/**
 * Clerk v7+ — vedi https://clerk.com/docs/nextjs/reference/components/clerk-provider
 * Redirect dopo login/registrazione: sempre verso il nostro sync JWT backend.
 * (Evita mismatch tra SignIn/SignUp e sessione.)
 */
export default function ClerkWrapper({ children }: { children: ReactNode }) {
  const afterAuth = '/auth/clerk-callback'

  return (
    <ClerkProvider
      localization={itIT}
      appearance={clerkAppearance}
      signInUrl="/auth/login"
      signUpUrl="/auth/register"
      signInForceRedirectUrl={afterAuth}
      signInFallbackRedirectUrl={afterAuth}
      signUpForceRedirectUrl={afterAuth}
      signUpFallbackRedirectUrl={afterAuth}
    >
      {children}
    </ClerkProvider>
  )
}
