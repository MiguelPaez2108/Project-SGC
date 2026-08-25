'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/infrastructure/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const schema = z.object({
  usuario_id:  z.string().min(1, 'Selecciona un cliente'),
  cancha_id:   z.string().min(1, 'Selecciona una cancha'),
  fecha:       z.string().min(1, 'Selecciona una fecha'),
  hora_inicio: z.string().min(1, 'Ingresa hora de inicio'),
  hora_fin:    z.string().min(1, 'Ingresa hora de fin'),
  estado:      z.enum(['pendiente', 'confirmada', 'en_uso', 'completada', 'cancelada']),
  notas:       z.string().optional(),
})
type FormData = z.infer<typeof schema>

const inputStyle: React.CSSProperties = {
  width: '100%', height: '44px', padding: '0 12px',
  border: '1px solid #818181', borderRadius: '8px',
  fontSize: '0.9375rem', color: 'var(--sgc-text)',
  fontFamily: 'var(--sgc-font)', background: '#fff',
  outline: 'none', transition: 'border-color 0.2s',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.9375rem', fontWeight: 400,
  color: 'var(--sgc-text)', marginBottom: '6px',
}
const errorStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8125rem', color: 'var(--sgc-danger)', marginTop: '5px',
}

export default function NuevaReservaPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<{ id: string; nombre: string }[]>([])
  const [canchas, setCanchas] = useState<{ id: string; nombre: string; precio_por_hora: number }[]>([])
  const [precioCalculado, setPrecioCalculado] = useState<number | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { estado: 'pendiente' },
  })

  const watchCancha    = watch('cancha_id')
  const watchHoraIn   = watch('hora_inicio')
  const watchHoraFin  = watch('hora_fin')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('usuarios').select('id, nombre').eq('rol', 'cliente').eq('activo', true)
      .then(({ data }) => setClientes(data ?? []))
    supabase.from('canchas').select('id, nombre, precio_por_hora').eq('estado', 'activa')
      .then(({ data }) => setCanchas(data ?? []))
  }, [])

  useEffect(() => {
    if (!watchCancha || !watchHoraIn || !watchHoraFin) { setPrecioCalculado(null); return }
    const cancha = canchas.find(c => c.id === watchCancha)
    if (!cancha) { setPrecioCalculado(null); return }
    const [h1, m1] = watchHoraIn.split(':').map(Number)
    const [h2, m2] = watchHoraFin.split(':').map(Number)
    const horas = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60
    if (horas > 0) setPrecioCalculado(horas * cancha.precio_por_hora)
    else setPrecioCalculado(null)
  }, [watchCancha, watchHoraIn, watchHoraFin, canchas])

  async function onSubmit(data: FormData) {
    setServerError(null)
    if (!precioCalculado) { setServerError('Verifica las horas ingresadas'); return }
    const supabase = createClient()
    const { error } = await (supabase.from('reservas') as any).insert({
      usuario_id:  data.usuario_id,
      cancha_id:   data.cancha_id,
      fecha:       data.fecha,
      hora_inicio: data.hora_inicio,
      hora_fin:    data.hora_fin,
      estado:      data.estado,
      precio_total: precioCalculado,
      pagado:      false,
      notas:       data.notas || null,
    })
    if (error) { setServerError(error.message); return }
    router.push('/dashboard/reservas')
    router.refresh()
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard/reservas" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--sgc-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '12px',
        }}>
          <ArrowLeft size={15} /> Volver a Reservas
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Nueva Reserva</h1>
      </div>

      <div style={{
        background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
        borderRadius: '12px', padding: '28px', boxShadow: 'var(--sgc-shadow-sm)',
      }}>
        {serverError && (
          <div style={{ background: '#fdecea', border: '1px solid #f5c6cb', color: '#d32f2f', borderRadius: '6px', padding: '10px 14px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Cliente *</label>
              <select {...register('usuario_id')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Seleccionar cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              {errors.usuario_id && <span style={errorStyle}>{errors.usuario_id.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Cancha *</label>
              <select {...register('cancha_id')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Seleccionar cancha...</option>
                {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              {errors.cancha_id && <span style={errorStyle}>{errors.cancha_id.message}</span>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Fecha *</label>
            <input {...register('fecha')} type="date" style={inputStyle} />
            {errors.fecha && <span style={errorStyle}>{errors.fecha.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Hora inicio *</label>
              <input {...register('hora_inicio')} type="time" style={inputStyle} />
              {errors.hora_inicio && <span style={errorStyle}>{errors.hora_inicio.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Hora fin *</label>
              <input {...register('hora_fin')} type="time" style={inputStyle} />
              {errors.hora_fin && <span style={errorStyle}>{errors.hora_fin.message}</span>}
            </div>
          </div>

          {/* Precio calculado */}
          {precioCalculado !== null && (
            <div style={{
              background: 'var(--sgc-primary-light)', border: '1px solid #bfdbfe',
              borderRadius: '8px', padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--sgc-primary)', fontWeight: 500 }}>Precio calculado</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sgc-primary)' }}>
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precioCalculado)}
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Estado</label>
              <select {...register('estado')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_uso">En uso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notas</label>
            <textarea {...register('notas')} rows={3} style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical' }} placeholder="Observaciones opcionales..." />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--sgc-border)' }}>
            <Link href="/dashboard/reservas" style={{
              padding: '9px 20px', borderRadius: '8px', border: '1px solid var(--sgc-border)',
              color: 'var(--sgc-text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
            }}>
              Cancelar
            </Link>
            <button type="submit" disabled={isSubmitting} style={{
              padding: '9px 24px', borderRadius: '8px', border: 'none',
              background: isSubmitting ? '#ccc' : 'var(--sgc-primary)', color: '#fff',
              fontSize: '0.9rem', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--sgc-font)',
            }}>
              {isSubmitting ? 'Guardando...' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
