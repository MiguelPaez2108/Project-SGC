'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/infrastructure/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const schema = z.object({
  nombre:          z.string().min(2, 'Nombre requerido'),
  tipo_deporte:    z.string().min(2, 'Tipo de deporte requerido'),
  precio_por_hora: z.coerce.number().positive('Debe ser mayor a 0'),
  capacidad:       z.coerce.number().int().positive('Debe ser mayor a 0'),
  descripcion:     z.string().optional(),
  ubicacion:       z.string().optional(),
  estado:          z.enum(['activa', 'mantenimiento', 'inactiva']),
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

export default function NuevaCanchaPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { estado: 'activa' },
  })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = createClient()
    const { error } = await (supabase.from('canchas') as any).insert({
      nombre:          data.nombre,
      tipo_deporte:    data.tipo_deporte,
      precio_por_hora: data.precio_por_hora,
      capacidad:       data.capacidad,
      descripcion:     data.descripcion || null,
      ubicacion:       data.ubicacion || null,
      estado:          data.estado,
    })
    if (error) { setServerError((error as any).message); return }
    router.push('/dashboard/canchas')
    router.refresh()
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard/canchas" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--sgc-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '12px',
        }}>
          <ArrowLeft size={15} /> Volver a Canchas
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Nueva Cancha</h1>
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

        <form onSubmit={handleSubmit(onSubmit as any)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombre *</label>
              <input {...register('nombre')} style={inputStyle} placeholder="Ej: Cancha Norte A" />
              {errors.nombre && <span style={errorStyle}>{errors.nombre.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Tipo de Deporte *</label>
              <input {...register('tipo_deporte')} style={inputStyle} placeholder="Ej: Fútbol, Tenis..." />
              {errors.tipo_deporte && <span style={errorStyle}>{errors.tipo_deporte.message}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Precio por hora (COP) *</label>
              <input {...register('precio_por_hora')} type="number" style={inputStyle} placeholder="50000" />
              {errors.precio_por_hora && <span style={errorStyle}>{errors.precio_por_hora.message}</span>}
            </div>
            <div>
              <label style={labelStyle}>Capacidad (personas) *</label>
              <input {...register('capacidad')} type="number" style={inputStyle} placeholder="10" />
              {errors.capacidad && <span style={errorStyle}>{errors.capacidad.message}</span>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea {...register('descripcion')} rows={3} style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical' }} placeholder="Descripción opcional de la cancha..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Ubicación</label>
              <input {...register('ubicacion')} style={inputStyle} placeholder="Ej: Bloque A, Piso 1" />
            </div>
            <div>
              <label style={labelStyle}>Estado *</label>
              <select {...register('estado')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="activa">Activa</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--sgc-border)' }}>
            <Link href="/dashboard/canchas" style={{
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
              {isSubmitting ? 'Guardando...' : 'Guardar Cancha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
