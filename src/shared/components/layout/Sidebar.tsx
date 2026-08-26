'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  Users,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/infrastructure/supabase/client'
import { useRouter } from 'next/navigation'
import { NAV_ITEMS_DEF } from '@/lib/rbac'
import type { AuthUser } from '@/domains/auth/types/auth.types'

const ICON_MAP: Record<string, React.ElementType> = {
  '/dashboard':               LayoutDashboard,
  '/dashboard/canchas':       MapPin,
  '/dashboard/reservas':      CalendarDays,
  '/dashboard/usuarios':      Users,
  '/dashboard/reportes':      TrendingUp,
  '/dashboard/configuracion': Settings,
}

interface SidebarProps {
  user: AuthUser | null
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  // Filtrar ítems según el rol del usuario
  const navItems = NAV_ITEMS_DEF.filter((item) =>
    user ? item.roles.includes(user.rol) : false
  )

  return (
    <aside style={{
      width: 'var(--sgc-sidebar-w)',
      minHeight: '100vh',
      background: 'var(--sgc-surface)',
      borderRight: '1px solid var(--sgc-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
      boxShadow: 'var(--sgc-shadow-sm)',
    }}>

      {/* Logo */}
      <div style={{
        height: 'var(--sgc-header-h)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--sgc-border)',
        flexShrink: 0,
      }}>
        <span style={{
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--sgc-primary)',
          letterSpacing: '-0.3px',
        }}>
          Project SGC
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(({ href, label }) => {
          const active = isActive(href)
          const Icon = ICON_MAP[href] ?? LayoutDashboard
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--sgc-primary)' : 'var(--sgc-text-muted)',
                background: active ? 'var(--sgc-primary-light)' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = '#f5f5f5'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--sgc-text)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--sgc-text-muted)'
                }
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--sgc-border)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '9px 12px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 400,
            color: 'var(--sgc-text-muted)',
            fontFamily: 'var(--sgc-font)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.background = 'var(--sgc-danger-bg)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--sgc-danger)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--sgc-text-muted)'
          }}
        >
          <LogOut size={18} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

