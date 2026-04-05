'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { useTradingStore } from '@/store/trading'
import { useAuthStore } from '@/store/auth'
import { performAppLogout } from '@/lib/logout'
import { Bell, ChevronDown, User, LogOut, Settings, Wifi, WifiOff, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

const pageNames: Record<string, string> = {
  '/dashboard':               'Dashboard',
  '/dashboard/live-trading':  'Live Trading',
  '/dashboard/performance':   'Performance',
  '/dashboard/trades':        'Trade Aperti',
  '/dashboard/history':       'Storico Trade',
  '/dashboard/bots':          'Bot Control',
  '/dashboard/risk':          'Risk Settings',
  '/dashboard/accounts':      'Account MT5',
  '/dashboard/billing':       'Billing',
  '/dashboard/profile':       'Profilo',
  '/dashboard/setup-guide':   'Setup Guide',
  '/dashboard/api-keys':      'API Keys',
  '/admin':                   'Admin Panel',
  '/admin/users':             'Gestione Utenti',
  '/admin/signals':           'Segnali Master',
  '/admin/coupons':           'Coupon',
}

export function TopBar() {
  const pathname        = usePathname()
  const router          = useRouter()
  const queryClient     = useQueryClient()
  const { signOut }     = useClerk()
  const { theme, setTheme } = useTheme()
  const { botStatuses } = useTradingStore()
  const { user } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const isDark = theme !== 'light'

  const pageTitle   = pageNames[pathname] || 'Dashboard'
  const botStatus   = Object.values(botStatuses)[0]
  const isConnected = botStatus?.status === 'connected'

  const handleLogout = async () => {
    setShowUserMenu(false)
    try {
      await performAppLogout(queryClient, signOut)
    } catch {
      router.push('/')
    }
  }

  return (
    <div
      className="sticky top-0 z-20"
      style={{
        background: 'var(--glass-bg)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(32px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
      }}
    >
      {/* Gold top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--glass-top-gold) 30%, var(--gold) 50%, var(--glass-top-gold) 70%, transparent 100%)', opacity: 0.6 }}
      />

      <div className="flex h-14 items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
            {pageTitle}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Connection badge */}
          {botStatus && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
              style={{
                background: isConnected ? 'var(--green-subtle)' : 'var(--glass-bg)',
                border: `1px solid ${isConnected ? 'color-mix(in srgb, var(--green) 30%, transparent)' : 'var(--border)'}`,
                color: isConnected ? 'var(--green)' : 'var(--text-muted)',
              }}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'Bot Attivo' : 'Bot Offline'}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="theme-toggle"
            title={isDark ? 'Modalità chiara' : 'Modalità scura'}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* Notification bell */}
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-all"
            style={{ border: '1px solid transparent' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'var(--gold-subtle)'
              el.style.borderColor = 'var(--border-gold)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.borderColor = 'transparent'
            }}
          >
            <Bell className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} />
            <span
              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--gold)', boxShadow: '0 0 6px color-mix(in srgb, var(--gold) 90%, transparent)' }}
            />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all"
              style={{
                background: showUserMenu ? 'var(--gold-subtle)' : 'transparent',
                border: `1px solid ${showUserMenu ? 'var(--border-gold)' : 'transparent'}`,
              }}
              onMouseEnter={e => {
                if (!showUserMenu) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--glass-bg)'
                  el.style.borderColor = 'var(--border)'
                }
              }}
              onMouseLeave={e => {
                if (!showUserMenu) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.borderColor = 'transparent'
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/eldorado.jpg"
                alt="avatar"
                className="gold-avatar-ring"
                style={{ width: 28, height: 28, flexShrink: 0 }}
              />

              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {user?.full_name || 'Utente'}
                </p>
                {user?.is_admin && (
                  <p className="text-[9px] leading-tight" style={{ color: 'var(--gold)' }}>Admin</p>
                )}
              </div>

              <ChevronDown
                className={cn('h-3 w-3 transition-transform duration-200', showUserMenu && 'rotate-180')}
                style={{ color: 'var(--text-muted)' }}
              />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div
                className="absolute right-0 top-[calc(100%+6px)] w-52 rounded-xl overflow-hidden animate-fade-in-down"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(32px) saturate(1.8)',
                  WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-lg), var(--shadow-gold)',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {user?.full_name || 'Utente'}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                </div>

                <div className="py-1">
                  {[
                    { icon: User,     label: 'Profilo',     href: '/dashboard/profile' },
                    { icon: Settings, label: 'Abbonamento', href: '/dashboard/billing' },
                  ].map(item => (
                    <button
                      key={item.href}
                      onClick={() => { setShowUserMenu(false); router.push(item.href) }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = 'var(--text-primary)'
                        el.style.background = 'var(--gold-subtle)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.color = 'var(--text-secondary)'
                        el.style.background = 'transparent'
                      }}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="py-1" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all"
                    style={{ color: 'var(--red)' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'var(--red-subtle)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'transparent'
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Esci
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
