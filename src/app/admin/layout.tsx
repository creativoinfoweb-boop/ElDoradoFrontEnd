'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'
import { LayoutDashboard, Users, Tags, Radio, LogOut } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user?.is_admin) {
    return null
  }

  const adminNavigation = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Utenti', href: '/admin/users', icon: Users },
    { label: 'Coupon', href: '/admin/coupons', icon: Tags },
    { label: 'Segnali', href: '/admin/signals', icon: Radio },
  ]

  return (
    <div className="flex h-screen bg-[#070710]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E1E35] bg-[#12121F] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#1E1E35]">
          <h2 className="text-xl font-bold text-[#F5A623]">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#A1A1AA] hover:bg-[#1A1A2E] hover:text-[#F4F4F5] transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E1E35] space-y-2">
          <div className="text-xs text-[#71717A] px-4 py-2">
            <p className="font-semibold text-[#F4F4F5]">{user?.username}</p>
            <p className="text-[#A1A1AA]">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logout()
              router.push('/auth/login')
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-loss-red hover:bg-loss-red/10 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A14]">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
