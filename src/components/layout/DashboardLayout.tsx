'use client'

import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const initialize = useAuthStore(s => s.initialize)
  const { showReconnectBanner } = useWebSocket()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg)' }}>
      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none grid-bg" style={{ zIndex: 0, opacity: 0.45 }} />

      {/* Ambient gold orb — top-left */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-130px', left: '-90px',
          width: '550px', height: '550px',
          background: 'radial-gradient(circle, var(--gold-subtle) 0%, transparent 65%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      {/* Ambient gold orb — bottom-right (gold instead of purple) */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-100px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, var(--gold-subtle) 0%, transparent 65%)',
          filter: 'blur(45px)',
          zIndex: 0,
        }}
      />

      <Sidebar />

      <div className="relative flex w-full flex-col overflow-hidden z-10">
        <TopBar />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {showReconnectBanner && (
          <div
            className="px-6 py-2 text-center text-xs"
            style={{
              borderTop: '1px solid var(--border-gold)',
              background: 'var(--gold-subtle)',
              color: 'var(--gold)',
            }}
          >
            Connessione ai segnali persa — riconnessione in corso…
          </div>
        )}
      </div>
    </div>
  )
}
