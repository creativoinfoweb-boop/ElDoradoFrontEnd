'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { performAppLogout } from '@/lib/logout'
import {
  LayoutDashboard,
  Radio,
  TrendingUp,
  BookOpen,
  Database,
  CreditCard,
  History,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Activity,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: any
  adminOnly?: boolean
  badge?: string
}

const NAV_MAIN: NavItem[] = [
  { label: 'Dashboard',    href: '/dashboard',              icon: LayoutDashboard },
  { label: 'Live Trading', href: '/dashboard/live-trading', icon: Radio, badge: 'LIVE' },
  { label: 'Performance',  href: '/dashboard/performance',  icon: TrendingUp },
  { label: 'Trade Aperti', href: '/dashboard/trades',       icon: Activity },
  { label: 'Storico',      href: '/dashboard/history',      icon: History },
]

const NAV_ACCOUNT: NavItem[] = [
  { label: 'Setup Guide',  href: '/dashboard/setup-guide', icon: BookOpen },
  { label: 'Account MT5',  href: '/dashboard/accounts',    icon: Database },
  { label: 'Billing',      href: '/dashboard/billing',     icon: CreditCard },
  { label: 'Profilo',      href: '/dashboard/profile',     icon: User },
  { label: 'Admin',        href: '/admin',                 icon: Shield, adminOnly: true },
]

export function Sidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const queryClient = useQueryClient()
  const { signOut } = useClerk()
  const user = useAuthStore(s => s.user)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/')

  const closeMobile = () => setMobileOpen(false)
  const handleLogout = async () => {
    setMobileOpen(false)
    try {
      await performAppLogout(queryClient, signOut)
    } catch {
      router.push('/')
    }
  }

  const visibleAccount = NAV_ACCOUNT.filter(i => !i.adminOnly || user?.is_admin)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[110] flex items-center justify-center w-9 h-9 rounded-xl lg:hidden transition-all"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-gold)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {mobileOpen
          ? <X className="h-4 w-4" style={{ color: 'var(--gold)' }} />
          : <Menu className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
        }
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — usa clsx (no tailwind-merge): cn() toglieva lg:translate-x-0 in conflitto con -translate-x-full → sidebar fuori schermo */}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-[200] isolate flex h-screen w-60 flex-col transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          background: 'var(--glass-bg)',
          borderRight: '1px solid var(--glass-border)',
          backdropFilter: 'blur(32px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
          pointerEvents: 'auto',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 45% at 50% 0%, var(--gold-subtle) 0%, transparent 100%)' }}
        />

        <div className="relative flex h-full min-h-0 flex-col">
          <div className="holo-scan" />

          <div className="px-5 pt-6 pb-5">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/eldorado.jpg"
                  alt="El Dorado"
                  className="gold-avatar-ring"
                  style={{ width: 36, height: 36 }}
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                  style={{
                    background: 'var(--green)',
                    border: '1.5px solid var(--bg)',
                    boxShadow: '0 0 8px color-mix(in srgb, var(--green) 90%, transparent)',
                  }}
                />
              </div>

              <div>
                <div className="brand-cinzel text-[11px] tracking-[0.22em]">EL DORADO</div>
                <div className="text-[9px] font-medium tracking-[0.15em] uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Copy Trading
                </div>
              </div>
            </div>
          </div>

          <div className="divider mx-4 mb-4" />

          <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-3 space-y-0.5">
            <div className="px-3 pb-2">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Principale
              </span>
            </div>

            {NAV_MAIN.map(item => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  scroll
                  onClick={() => closeMobile()}
                  className={cn('nav-item w-full text-left', active && 'active')}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: active ? 'var(--gold-subtle)' : 'var(--glass-bg)',
                      border: `1px solid ${active ? 'var(--border-gold)' : 'var(--border)'}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: active ? 'var(--gold)' : 'var(--text-secondary)' }}
                    />
                  </div>
                  <span className="flex-1 text-xs">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded-full tracking-wider"
                      style={{
                        background: 'var(--green-subtle)',
                        border: '1px solid color-mix(in srgb, var(--green) 30%, transparent)',
                        color: 'var(--green)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="h-3 w-3 opacity-50" style={{ color: 'var(--gold)' }} />}
                </Link>
              )
            })}

            <div className="px-3 pt-5 pb-2">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Account
              </span>
            </div>

            {visibleAccount.map(item => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  scroll
                  onClick={() => closeMobile()}
                  className={cn('nav-item w-full text-left', active && 'active')}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: active ? 'var(--gold-subtle)' : 'var(--glass-bg)',
                      border: `1px solid ${active ? 'var(--border-gold)' : 'var(--border)'}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: active ? 'var(--gold)' : 'var(--text-secondary)' }}
                    />
                  </div>
                  <span className="flex-1 text-xs">{item.label}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-50" style={{ color: 'var(--gold)' }} />}
                </Link>
              )
            })}
          </nav>

          <div className="relative mt-auto flex-shrink-0 p-3">
            <div className="divider mb-3" />

            <Link
              href="/dashboard/profile"
              prefetch={false}
              scroll
              onClick={() => closeMobile()}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-1.5 text-left transition-all"
              style={{
                background: 'var(--gold-subtle)',
                border: '1px solid var(--border-gold)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-gold-hover)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-gold)'
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  background: 'var(--gold-subtle)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold)',
                }}
              >
                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.full_name || 'Trader'}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user?.email}
                </p>
              </div>

              {user?.is_admin && (
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: 'var(--gold-subtle)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold)',
                  }}
                >
                  ADM
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all"
              style={{ color: 'var(--text-secondary)', border: '1px solid transparent' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--red)'
                el.style.background = 'var(--red-subtle)'
                el.style.borderColor = 'color-mix(in srgb, var(--red) 25%, transparent)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--text-secondary)'
                el.style.background = 'transparent'
                el.style.borderColor = 'transparent'
              }}
            >
              <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="hidden lg:block lg:w-60 flex-shrink-0" />
    </>
  )
}
