import { createClient } from '@/infrastructure/supabase/server'
import { CalendarDays, MapPin, Users, DollarSign, Clock, ArrowRight } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '@/shared/lib/date'
import type { Metadata } from 'next'
import type { Database } from '@/infrastructure/supabase/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard | Project SGC',
  description: 'Panel principal del Sistema de Gestión de Canchas.',
}

type ReservaRow = Database['public']['Tables']['reservas']['Row']
type PendienteRow = ReservaRow & {
  canchas: { nombre: string } | null
  usuarios: { nombre: string } | null
}

async function getDashboardStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const [canchasRes, reservasHoyRes, clientesRes, ingresosRes, pendientesRes] = await Promise.all([
    supabase.from('canchas').select('id, estado', { count: 'exact' }),
    supabase.from('reservas').select('id', { count: 'exact' }).eq('fecha', today),
    supabase.from('usuarios').select('id', { count: 'exact' }).eq('rol', 'cliente').eq('activo', true),
    supabase.from('reservas').select('precio_total').eq('estado', 'completada').gte('created_at', firstOfMonth),
    supabase
      .from('reservas')
      .select('id, fecha, hora_inicio, hora_fin, precio_total, estado, cancha_id, canchas(nombre), usuarios(nombre)')
      .eq('estado', 'pendiente')
      .order('fecha', { ascending: true })
      .limit(6),
  ])

  const canchasActivas = (canchasRes.data as { estado: string }[] | null)?.filter(c => c.estado === 'activa').length ?? 0
  const ingresosMes = (ingresosRes.data as { precio_total: number }[] | null)?.reduce((s, r) => s + r.precio_total, 0) ?? 0

  return {
    canchasActivas,
    reservasHoy: reservasHoyRes.count ?? 0,
    totalClientes: clientesRes.count ?? 0,
    ingresosMes,
    pendientes: (pendientesRes.data ?? []) as PendienteRow[],
  }
}

const ESTADO_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:   { label: 'Pendiente',   color: '#b45309', bg: '#fef3c7' },
  confirmada:  { label: 'Confirmada',  color: '#0052a3', bg: '#dbeafe' },
  en_uso:      { label: 'En uso',      color: '#059669', bg: '#d1fae5' },
  completada:  { label: 'Completada',  color: '#374151', bg: '#f3f4f6' },
  cancelada:   { label: 'Cancelada',   color: '#d32f2f', bg: '#fdecea' },
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const kpis = [
    { label: 'Canchas Activas',  value: stats.canchasActivas,             icon: MapPin,       color: '#0066cc' },
    { label: 'Reservas Hoy',     value: stats.reservasHoy,                icon: CalendarDays, color: '#0052a3' },
    { label: 'Clientes Activos', value: stats.totalClientes,              icon: Users,        color: '#003d7a' },
    { label: 'Ingresos del Mes', value: formatCurrency(stats.ingresosMes),icon: DollarSign,   color: '#0066cc', isString: true },
  ]

  return (
    <>
      <style>{`
        .sgc-row:hover { background: #f5f5f5; }
        .sgc-action-card:hover { border-color: var(--sgc-primary) !important; box-shadow: 0 2px 8px rgba(0,102,204,0.12) !important; }
        .sgc-link-all:hover { text-decoration: underline; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Encabezado */}
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>
            Dashboard
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
            Resumen general del sistema de gestión de canchas
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {kpis.map(({ label, value, icon: Icon, color, isString }) => (
            <div key={label} style={{
              background: 'var(--sgc-surface)',
              border: '1px solid var(--sgc-border)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--sgc-shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sgc-text-muted)', fontWeight: 500 }}>{label}</p>
                  <p style={{ margin: '8px 0 0', fontSize: isString ? '1.4rem' : '1.8rem', fontWeight: 700, color: 'var(--sgc-text)', lineHeight: 1 }}>
                    {isString ? value : (value as number).toLocaleString('es-CO')}
                  </p>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: 'var(--sgc-primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reservas pendientes */}
        <div style={{
          background: 'var(--sgc-surface)',
          border: '1px solid var(--sgc-border)',
          borderRadius: '12px',
          boxShadow: 'var(--sgc-shadow-sm)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--sgc-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--sgc-primary)" />
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--sgc-text)' }}>
                Reservas Pendientes
              </span>
            </div>
            <Link href="/dashboard/reservas" className="sgc-link-all" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.825rem', color: 'var(--sgc-primary)',
              textDecoration: 'none', fontWeight: 500,
            }}>
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          {stats.pendientes.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <CalendarDays size={36} color="var(--sgc-border-mid)" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ margin: 0, color: 'var(--sgc-text-muted)', fontSize: '0.875rem' }}>No hay reservas pendientes</p>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 130px 110px 90px',
                padding: '10px 20px',
                background: '#fafafa',
                borderBottom: '1px solid var(--sgc-border)',
              }}>
                {['Cliente', 'Cancha', 'Fecha', 'Hora', 'Total'].map(h => (
                  <span key={h} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sgc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
                ))}
              </div>
              {stats.pendientes.map((r, i) => (
                <div key={r.id} className="sgc-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 130px 110px 90px',
                  padding: '13px 20px',
                  borderBottom: i < stats.pendientes.length - 1 ? '1px solid var(--sgc-border)' : 'none',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sgc-text)' }}>
                    {r.usuarios?.nombre ?? '—'}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
                    {r.canchas?.nombre ?? '—'}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
                    {formatDate(r.fecha)}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>
                    {formatTime(r.hora_inicio)} - {formatTime(r.hora_fin)}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--sgc-text)' }}>
                    {formatCurrency(r.precio_total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { href: '/dashboard/canchas/nueva',  label: 'Nueva Cancha',  sub: 'Agregar al sistema',   icon: MapPin       },
            { href: '/dashboard/reservas/nueva', label: 'Nueva Reserva', sub: 'Crear reserva rápida', icon: CalendarDays },
            { href: '/dashboard/reportes',       label: 'Ver Reportes',  sub: 'Análisis e ingresos',  icon: DollarSign   },
          ].map(({ href, label, sub, icon: Icon }) => (
            <Link key={href} href={href} className="sgc-action-card" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px', background: 'var(--sgc-surface)',
              border: '1px solid var(--sgc-border)', borderRadius: '12px',
              textDecoration: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
              boxShadow: 'var(--sgc-shadow-sm)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '9px',
                background: 'var(--sgc-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} color="var(--sgc-primary)" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--sgc-text)' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--sgc-text-muted)' }}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </>
  )
}
