import { createClient } from '@/infrastructure/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate, formatTime, formatDateTime } from '@/shared/lib/date'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, User, MapPin, DollarSign } from 'lucide-react'
import CambiarEstadoReserva from './CambiarEstadoReserva'
import type { Database } from '@/infrastructure/supabase/types'

const ESTADO_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  pendiente:  { label: 'Pendiente',  color: '#b45309', bg: '#fef3c7' },
  confirmada: { label: 'Confirmada', color: '#0052a3', bg: '#dbeafe' },
  en_uso:     { label: 'En uso',     color: '#059669', bg: '#d1fae5' },
  completada: { label: 'Completada', color: '#374151', bg: '#f3f4f6' },
  cancelada:  { label: 'Cancelada',  color: '#d32f2f', bg: '#fdecea' },
}

type ReservaRow = Database['public']['Tables']['reservas']['Row']
type ReservaDetalle = ReservaRow & {
  canchas: { nombre: string; tipo_deporte: string; precio_por_hora: number } | null
  usuarios: { nombre: string; email: string; telefono: string | null } | null
}

export default async function ReservaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('reservas')
    .select('*, canchas(nombre, tipo_deporte, precio_por_hora), usuarios(nombre, email, telefono)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const reserva = data as ReservaDetalle

  const badge = ESTADO_BADGE[reserva.estado] ?? ESTADO_BADGE.pendiente

  const infoItems = [
    { icon: User,        label: 'Cliente',     value: (reserva as any).usuarios?.nombre ?? '—' },
    { icon: User,        label: 'Email',        value: (reserva as any).usuarios?.email ?? '—' },
    { icon: MapPin,      label: 'Cancha',       value: (reserva as any).canchas?.nombre ?? '—' },
    { icon: CalendarDays,label: 'Fecha',        value: formatDate(reserva.fecha) },
    { icon: Clock,       label: 'Horario',      value: `${formatTime(reserva.hora_inicio)} - ${formatTime(reserva.hora_fin)}` },
    { icon: DollarSign,  label: 'Total',        value: formatCurrency(reserva.precio_total) },
    { icon: DollarSign,  label: 'Pagado',       value: reserva.pagado ? 'Sí' : 'No' },
  ]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard/reservas" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--sgc-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '12px',
        }}>
          <ArrowLeft size={15} /> Volver a Reservas
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>
            Reserva #{id.slice(0, 8).toUpperCase()}
          </h1>
          <span style={{
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '0.8rem', fontWeight: 600, color: badge.color, background: badge.bg,
          }}>
            {badge.label}
          </span>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--sgc-text-muted)' }}>
          Creada {formatDateTime(reserva.created_at)}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Info card */}
        <div style={{
          background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
          borderRadius: '12px', padding: '24px', boxShadow: 'var(--sgc-shadow-sm)',
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>
            Información de la reserva
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--sgc-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Icon size={14} color="var(--sgc-primary)" />
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--sgc-text)', fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {reserva.notas && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--sgc-border)' }}>
              <p style={{ margin: '0 0 4px', fontSize: '0.775rem', color: 'var(--sgc-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notas</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--sgc-text)' }}>{reserva.notas}</p>
            </div>
          )}
        </div>

        {/* Cambiar estado */}
        <CambiarEstadoReserva reservaId={id} estadoActual={reserva.estado} />
      </div>
    </div>
  )
}
