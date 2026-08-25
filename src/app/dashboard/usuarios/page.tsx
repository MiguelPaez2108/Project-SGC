import { createClient } from '@/infrastructure/supabase/server'
import { Users } from 'lucide-react'
import { formatDate } from '@/shared/lib/date'
import type { Metadata } from 'next'
import type { Database } from '@/infrastructure/supabase/types'

export const metadata: Metadata = {
  title: 'Usuarios | Project SGC',
  description: 'Gestión de usuarios y clientes.',
}

const ROL_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  admin:         { label: 'Admin',         color: '#0052a3', bg: '#dbeafe' },
  recepcionista: { label: 'Recepcionista', color: '#6d28d9', bg: '#ede9fe' },
  cliente:       { label: 'Cliente',       color: '#374151', bg: '#f3f4f6' },
}

type Usuario = Database['public']['Tables']['usuarios']['Row']

export default async function UsuariosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('usuarios')
    .select('*')
    .order('created_at', { ascending: false })

  const usuarios = (data ?? []) as Usuario[]
  const cols = ['Nombre', 'Email', 'Teléfono', 'Rol', 'Activo', 'Registrado']

  return (
    <>
      <style>{`.sgc-row:hover { background: #f5f5f5; }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Usuarios</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
            {usuarios.length} usuarios registrados
          </p>
        </div>

        <div style={{
          background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
          borderRadius: '12px', boxShadow: 'var(--sgc-shadow-sm)', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 2fr 130px 110px 70px 120px',
            padding: '10px 20px', background: '#fafafa', borderBottom: '1px solid var(--sgc-border)',
          }}>
            {cols.map(h => (
              <span key={h} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sgc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          {usuarios.length === 0 ? (
            <div style={{ padding: '56px 20px', textAlign: 'center' }}>
              <Users size={36} color="var(--sgc-border-mid)" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ margin: 0, color: 'var(--sgc-text-muted)', fontSize: '0.875rem' }}>No hay usuarios registrados</p>
            </div>
          ) : (
            usuarios.map((u, i) => {
              const rol = ROL_BADGE[u.rol] ?? ROL_BADGE.cliente
              return (
                <div key={u.id} className="sgc-row" style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 2fr 130px 110px 70px 120px',
                  padding: '13px 20px', alignItems: 'center',
                  borderBottom: i < usuarios.length - 1 ? '1px solid var(--sgc-border)' : 'none',
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--sgc-text)' }}>{u.nombre}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{u.email}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{u.telefono ?? '—'}</span>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '0.775rem', fontWeight: 600, color: rol.color, background: rol.bg,
                  }}>{rol.label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: u.activo ? '#059669' : '#d32f2f' }}>
                    {u.activo ? 'Sí' : 'No'}
                  </span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--sgc-text-muted)' }}>{formatDate(u.created_at)}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
