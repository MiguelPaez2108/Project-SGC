import { createClient } from '@/infrastructure/supabase/server'
import type { Metadata } from 'next'
import type { AuthUser, Usuario } from '@/domains/auth/types/auth.types'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Configuración | Project SGC',
  description: 'Configuración del sistema.',
}

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: Usuario | null = null
  if (user) {
    const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single()
    profile = data as Usuario | null
  }

  const infoSistema = [
    { label: 'Versión',     value: '1.0.0' },
    { label: 'Framework',   value: 'Next.js 15' },
    { label: 'Base de datos', value: 'Supabase (PostgreSQL)' },
    { label: 'Entorno',     value: process.env.NODE_ENV ?? 'development' },
  ]

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.775rem', fontWeight: 500,
    color: 'var(--sgc-text-muted)', textTransform: 'uppercase',
    letterSpacing: '0.5px', marginBottom: '4px',
  }
  const valueStyle: React.CSSProperties = {
    margin: 0, fontSize: '0.9rem', color: 'var(--sgc-text)', fontWeight: 500,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 680 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Configuración</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
          Información del sistema y perfil de administrador
        </p>
      </div>

      {/* Perfil */}
      {profile && (
        <div style={{
          background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
          borderRadius: '12px', padding: '24px', boxShadow: 'var(--sgc-shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Settings size={18} color="var(--sgc-primary)" />
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>Mi Perfil</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--sgc-border)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--sgc-primary)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 700, flexShrink: 0,
            }}>
              {profile.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>{profile.nombre}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)', textTransform: 'capitalize' }}>
                {profile.rol} · {profile.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={labelStyle}>Nombre</span>
              <p style={valueStyle}>{profile.nombre}</p>
            </div>
            <div>
              <span style={labelStyle}>Email</span>
              <p style={valueStyle}>{profile.email}</p>
            </div>
            <div>
              <span style={labelStyle}>Teléfono</span>
              <p style={valueStyle}>{profile.telefono ?? '—'}</p>
            </div>
            <div>
              <span style={labelStyle}>Rol</span>
              <p style={{ ...valueStyle, textTransform: 'capitalize' }}>{profile.rol}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info del sistema */}
      <div style={{
        background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
        borderRadius: '12px', padding: '24px', boxShadow: 'var(--sgc-shadow-sm)',
      }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>
          Información del Sistema
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {infoSistema.map(({ label, value }) => (
            <div key={label}>
              <span style={labelStyle}>{label}</span>
              <p style={valueStyle}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
