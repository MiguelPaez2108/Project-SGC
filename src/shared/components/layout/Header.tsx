import type { AuthUser } from '@/domains/auth/types/auth.types'

interface HeaderProps {
  user: AuthUser | null
  title?: string
}

export function Header({ user, title }: HeaderProps) {
  const initials = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <header style={{
      height: 'var(--sgc-header-h)',
      background: 'var(--sgc-surface)',
      borderBottom: '1px solid var(--sgc-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 'var(--sgc-sidebar-w)',
      right: 0,
      zIndex: 30,
      boxShadow: 'var(--sgc-shadow-sm)',
    }}>

      {/* Título de la página */}
      <span style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--sgc-text)',
        letterSpacing: '-0.1px',
      }}>
        {title ?? 'Dashboard'}
      </span>

      {/* Usuario */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--sgc-text)' }}>
            {user?.nombre ?? 'Usuario'}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--sgc-text-muted)', textTransform: 'capitalize' }}>
            {user?.rol ?? ''}
          </p>
        </div>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'var(--sgc-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          flexShrink: 0,
          letterSpacing: '0.5px',
        }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
