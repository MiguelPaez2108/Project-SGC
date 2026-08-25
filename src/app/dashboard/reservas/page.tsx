import { createClient } from '@/infrastructure/supabase/server'
import { CalendarDays, Plus } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/shared/lib/date'
import type { Metadata } from 'next'
import type { Database } from '@/infrastructure/supabase/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reservas | Project SGC',
  description: 'Gestión de reservas de canchas.',
}

const ESTADO_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:  { label: 'Pendiente',  color: '#b45309', bg: '#fef3c7' },
  confirmada: { label: 'Confirmada', color: '#0052a3', bg: '#dbeafe' },
  en_uso:     { label: 'En uso',     color: '#059669', bg: '#d1fae5' },
  completada: { label: 'Completada', color: '#374151', bg: '#f3f4f6' },
  cancelada:  { label: 'Cancelada',  color: '#d32f2f', bg: '#fdecea' },
}

type ReservaRow = Database['public']['Tables']['reservas']['Row']
type ReservaWithRelations = ReservaRow & {
  canchas: { nombre: string } | null
  usuarios: { nombre: string } | null
}

export default async function ReservasPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reservas')
    .select('id, fecha, hora_inicio, hora_fin, estado, precio_total, pagado, canchas(nombre), usuarios(nombre)')
    .order('fecha', { ascending: false })
    .limit(50)

  const reservas = (data ?? []) as ReservaWithRelations[]
  const cols = ['Cliente', 'Cancha', 'Fecha', 'Hora', 'Estado', 'Total', 'Pagado', '']

  return (
    <>
      <style>{`.sgc-row:hover { background: #f5f5f5; }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Reservas</h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
              {reservas.length} reservas recientes
            </p>
          </div>
          <Link href="/dashboard/reservas/nueva" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', background: 'var(--sgc-primary)', color: '#fff',
            borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
          }}>
            <Plus size={16} /> Nueva Reserva
          </Link>
        </div>

        <div style={{
          background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
          borderRadius: '12px', boxShadow: 'var(--sgc-shadow-sm)', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.2fr 1fr 110px 130px 100px 110px 70px 70px',
            padding: '10px 20px', background: '#fafafa', borderBottom: '1px solid var(--sgc-border)',
          }}>
            {cols.map(h => (
              <span key={h} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sgc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          {reservas.length === 0 ? (
            <div style={{ padding: '56px 20px', textAlign: 'center' }}>
              <CalendarDays size={36} color="var(--sgc-border-mid)" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ margin: 0, color: 'var(--sgc-text-muted)', fontSize: '0.875rem' }}>No hay reservas registradas</p>
              <Link href="/dashboard/reservas/nueva" style={{ color: 'var(--sgc-primary)', fontSize: '0.875rem', marginTop: '8px', display: 'inline-block' }}>
                Crear la primera reserva →
              </Link>
            </div>
          ) : (
            reservas.map((r, i) => {
              const badge = ESTADO_BADGE[r.estado] ?? ESTADO_BADGE.pendiente
              return (
                <div key={r.id} className="sgc-row" style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 1fr 110px 130px 100px 110px 70px 70px',
                  padding: '13px 20px', alignItems: 'center',
                  borderBottom: i < reservas.length - 1 ? '1px solid var(--sgc-border)' : 'none',
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sgc-text)' }}>{r.usuarios?.nombre ?? '—'}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{r.canchas?.nombre ?? '—'}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{formatDate(r.fecha)}</span>
                  <span style={{ fontSize: '0.825rem', color: 'var(--sgc-text-muted)' }}>{formatTime(r.hora_inicio)} - {formatTime(r.hora_fin)}</span>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '0.775rem', fontWeight: 600, color: badge.color, background: badge.bg,
                  }}>{badge.label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--sgc-text)' }}>{formatCurrency(r.precio_total)}</span>
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: r.pagado ? '#059669' : '#d97706' }}>
                    {r.pagado ? 'Sí' : 'No'}
                  </span>
                  <Link href={`/dashboard/reservas/${r.id}`} style={{
                    color: 'var(--sgc-primary)', textDecoration: 'none', fontSize: '0.825rem', fontWeight: 500,
                  }}>Ver</Link>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
