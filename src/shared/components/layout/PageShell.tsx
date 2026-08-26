import type { AuthUser } from '@/domains/auth/types/auth.types'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface PageShellProps {
  user: AuthUser | null
  title?: string
  children: React.ReactNode
}

export function PageShell({ user, title, children }: PageShellProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--sgc-bg)' }}>
      <Sidebar user={user} />
      <div style={{
        marginLeft: 'var(--sgc-sidebar-w)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        <Header user={user} title={title} />
        <main style={{
          marginTop: 'var(--sgc-header-h)',
          padding: '28px 28px',
          flex: 1,
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

