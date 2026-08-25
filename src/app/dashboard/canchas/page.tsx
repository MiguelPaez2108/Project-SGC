import { createClient } from '@/infrastructure/supabase/server'
import { MapPin, Plus, Pencil } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/date'
import type { Metadata } from 'next'
import type { Database } from '@/infrastructure/supabase/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Canchas | Project SGC',
  description: 'Gestión de canchas deportivas.',
}

type Cancha = Database['public']['Tables']['canchas']['Row']

const ESTADO_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  activa:        { label: 'Activa',        color: '#059669', bg: '#d1fae5' },
  mantenimiento: { label: 'Mantenimiento', color: '#d97706', bg: '#fef3c7' },
  inactiva:      { label: 'Inactiva',      color: '#d32f2f', bg: '#fdecea' },
}

export default async function CanchasPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('canchas')
    .select('*')
    .order('created_at', { ascending: false })

  const canchas = (data ?? []) as Cancha[]
  const cols = ['Nombre', 'Deporte', 'Precio/hora', 'Capacidad', 'Ubicación', 'Estado', '']

  return (
    <>
      <style>{`
        .sgc-row:hover { background: #f5f5f5; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Canchas</h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
              {canchas.length} canchas registradas
            </p>
          </div>
          <Link href="/dashboard/canchas/nueva" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', background: 'var(--sgc-primary)', color: '#fff',
            borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
          }}>
            <Plus size={16} /> Nueva Cancha
          </Link>
        </div>

        <div style={{
          background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
          borderRadius: '12px', boxShadow: 'var(--sgc-shadow-sm)', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 120px 90px 1.5fr 100px 80px',
            padding: '10px 20px', background: '#fafafa', borderBottom: '1px solid var(--sgc-border)',
          }}>
            {cols.map(h => (
              <span key={h} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sgc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          {canchas.length === 0 ? (
            <div style={{ padding: '56px 20px', textAlign: 'center' }}>
              <MapPin size={36} color="var(--sgc-border-mid)" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ margin: 0, color: 'var(--sgc-text-muted)', fontSize: '0.875rem' }}>No hay canchas registradas aún</p>
              <Link href="/dashboard/canchas/nueva" style={{ color: 'var(--sgc-primary)', fontSize: '0.875rem', marginTop: '8px', display: 'inline-block' }}>
                Agregar la primera cancha →
              </Link>
            </div>
          ) : (
            canchas.map((c, i) => {
              const est = ESTADO_STYLE[c.estado] ?? ESTADO_STYLE.inactiva
              return (
                <div key={c.id} className="sgc-row" style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 120px 90px 1.5fr 100px 80px',
                  padding: '14px 20px', alignItems: 'center',
                  borderBottom: i < canchas.length - 1 ? '1px solid var(--sgc-border)' : 'none',
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--sgc-text)' }}>{c.nombre}</p>
                    {c.descripcion && <p style={{ margin: '2px 0 0', fontSize: '0.775rem', color: 'var(--sgc-text-muted)' }}>{c.descripcion.slice(0, 50)}{c.descripcion.length > 50 ? '…' : ''}</p>}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)', textTransform: 'capitalize' }}>{c.tipo_deporte}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text)', fontWeight: 500 }}>{formatCurrency(c.precio_por_hora)}/h</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{c.capacidad} pers.</span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--sgc-text-muted)' }}>{c.ubicacion ?? '—'}</span>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '0.775rem', fontWeight: 600, color: est.color, background: est.bg,
                  }}>
                    {est.label}
                  </span>
                  <Link href={`/dashboard/canchas/${c.id}/editar`} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    color: 'var(--sgc-primary)', textDecoration: 'none', fontSize: '0.825rem', fontWeight: 500,
                  }}>
                    <Pencil size={14} /> Editar
                  </Link>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
