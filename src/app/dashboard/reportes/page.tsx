import { createClient } from '@/infrastructure/supabase/server'
import { formatCurrency } from '@/shared/lib/date'
import type { Metadata } from 'next'
import { TrendingUp, DollarSign, CalendarDays, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reportes | Project SGC',
  description: 'Reportes e ingresos del sistema.',
}

async function getReportData() {
  const supabase = await createClient()
  const now = new Date()
  const firstThisMonth  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstLastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const firstThisMonthStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [ingresosMesRes, ingresosAnteriorRes, reservasPorEstadoRes, canchasMasReservadasRes] = await Promise.all([
    supabase.from('reservas').select('precio_total').eq('estado', 'completada').gte('created_at', firstThisMonth),
    supabase.from('reservas').select('precio_total').eq('estado', 'completada')
      .gte('created_at', firstLastMonth).lt('created_at', firstThisMonthStr),
    supabase.from('reservas').select('estado'),
    supabase.from('reservas').select('cancha_id, canchas(nombre)').neq('estado', 'cancelada'),
  ])

  const ingresosMes      = (ingresosMesRes.data as { precio_total: number }[] | null)?.reduce((s, r) => s + r.precio_total, 0) ?? 0
  const ingresosAnterior = (ingresosAnteriorRes.data as { precio_total: number }[] | null)?.reduce((s, r) => s + r.precio_total, 0) ?? 0

  // Reservas por estado
  const porEstado: Record<string, number> = {}
  ;(reservasPorEstadoRes.data ?? []).forEach((r: any) => {
    porEstado[r.estado] = (porEstado[r.estado] ?? 0) + 1
  })

  // Canchas más reservadas
  const porCancha: Record<string, { nombre: string; count: number }> = {}
  ;(canchasMasReservadasRes.data ?? []).forEach((r: any) => {
    const id = r.cancha_id
    if (!porCancha[id]) porCancha[id] = { nombre: r.canchas?.nombre ?? 'Desconocida', count: 0 }
    porCancha[id].count++
  })
  const topCanchas = Object.values(porCancha).sort((a, b) => b.count - a.count).slice(0, 5)
  const totalReservas = Object.values(porCancha).reduce((s, c) => s + c.count, 0)

  return { ingresosMes, ingresosAnterior, porEstado, topCanchas, totalReservas }
}

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente', confirmada: 'Confirmada',
  en_uso: 'En uso', completada: 'Completada', cancelada: 'Cancelada',
}
const ESTADO_COLOR: Record<string, string> = {
  pendiente: '#d97706', confirmada: '#0066cc', en_uso: '#059669', completada: '#374151', cancelada: '#d32f2f',
}

export default async function ReportesPage() {
  const { ingresosMes, ingresosAnterior, porEstado, topCanchas, totalReservas } = await getReportData()
  const variacion = ingresosAnterior > 0 ? ((ingresosMes - ingresosAnterior) / ingresosAnterior) * 100 : null
  const totalEstados = Object.values(porEstado).reduce((s, n) => s + n, 0) || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Reportes</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
          Análisis de ingresos y uso del sistema
        </p>
      </div>

      {/* Ingresos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { label: 'Ingresos este mes', value: formatCurrency(ingresosMes),      icon: DollarSign, sub: variacion !== null ? `${variacion > 0 ? '+' : ''}${variacion.toFixed(1)}% vs mes anterior` : 'Sin datos del mes anterior' },
          { label: 'Ingresos mes anterior', value: formatCurrency(ingresosAnterior), icon: TrendingUp, sub: 'Mes completado' },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} style={{
            background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
            borderRadius: '12px', padding: '20px', boxShadow: 'var(--sgc-shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sgc-text-muted)', fontWeight: 500 }}>{label}</p>
                <p style={{ margin: '8px 0 4px', fontSize: '1.6rem', fontWeight: 700, color: 'var(--sgc-text)', lineHeight: 1 }}>{value}</p>
                <p style={{ margin: 0, fontSize: '0.775rem', color: variacion && variacion > 0 ? '#059669' : 'var(--sgc-text-muted)' }}>{sub}</p>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: '10px', background: 'var(--sgc-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color="var(--sgc-primary)" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reservas por estado */}
      <div style={{
        background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
        borderRadius: '12px', padding: '24px', boxShadow: 'var(--sgc-shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <CalendarDays size={18} color="var(--sgc-primary)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>Reservas por Estado</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(porEstado).sort((a, b) => b[1] - a[1]).map(([estado, count]) => {
            const pct = Math.round((count / totalEstados) * 100)
            return (
              <div key={estado}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text)', fontWeight: 500 }}>
                    {ESTADO_LABEL[estado] ?? estado}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: ESTADO_COLOR[estado] ?? 'var(--sgc-primary)',
                    borderRadius: '4px', transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top canchas */}
      <div style={{
        background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
        borderRadius: '12px', padding: '24px', boxShadow: 'var(--sgc-shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <MapPin size={18} color="var(--sgc-primary)" />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>Canchas más Reservadas</h2>
        </div>
        {topCanchas.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--sgc-text-muted)', fontSize: '0.875rem' }}>Sin datos aún</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCanchas.map(({ nombre, count }, idx) => {
              const pct = totalReservas > 0 ? Math.round((count / totalReservas) * 100) : 0
              return (
                <div key={nombre} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', background: 'var(--sgc-primary-light)',
                    color: 'var(--sgc-primary)', fontSize: '0.75rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{idx + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sgc-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</span>
                      <span style={{ fontSize: '0.825rem', color: 'var(--sgc-text-muted)', flexShrink: 0, marginLeft: '8px' }}>{count} reservas</span>
                    </div>
                    <div style={{ height: 6, background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--sgc-primary)', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
