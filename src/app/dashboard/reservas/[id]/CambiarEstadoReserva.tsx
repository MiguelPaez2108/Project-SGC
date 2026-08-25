'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/infrastructure/supabase/client'

const ESTADOS = [
  { value: 'pendiente',  label: 'Pendiente'  },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'en_uso',     label: 'En uso'     },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada',  label: 'Cancelada'  },
] as const

type EstadoReserva = typeof ESTADOS[number]['value']

interface Props {
  reservaId: string
  estadoActual: string
}

export default function CambiarEstadoReserva({ reservaId, estadoActual }: Props) {
  const router = useRouter()
  const [estado, setEstado] = useState<EstadoReserva>(estadoActual as EstadoReserva)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setSaving(true); setError(null); setSuccess(false)
    const supabase = createClient()
    const { error } = await (supabase
      .from('reservas') as any)
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', reservaId)
    setSaving(false)
    if (error) { setError(error.message); return }
    setSuccess(true)
    setTimeout(() => { setSuccess(false); router.refresh() }, 1200)
  }

  return (
    <div style={{
      background: 'var(--sgc-surface)', border: '1px solid var(--sgc-border)',
      borderRadius: '12px', padding: '24px', boxShadow: 'var(--sgc-shadow-sm)',
    }}>
      <h2 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600, color: 'var(--sgc-text)' }}>
        Cambiar Estado
      </h2>

      {error && (
        <div style={{ background: '#fdecea', color: '#d32f2f', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#d1fae5', color: '#059669', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.875rem' }}>
          Estado actualizado correctamente
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {ESTADOS.map(e => (
          <button
            key={e.value}
            onClick={() => setEstado(e.value)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: '2px solid',
              borderColor: estado === e.value ? 'var(--sgc-primary)' : 'var(--sgc-border)',
              background: estado === e.value ? 'var(--sgc-primary-light)' : '#fff',
              color: estado === e.value ? 'var(--sgc-primary)' : 'var(--sgc-text-muted)',
              fontWeight: estado === e.value ? 600 : 400,
              fontSize: '0.875rem', cursor: 'pointer',
              fontFamily: 'var(--sgc-font)', transition: 'all 0.15s',
            }}
          >
            {e.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || estado === estadoActual}
        style={{
          padding: '9px 24px', borderRadius: '8px', border: 'none',
          background: saving || estado === estadoActual ? '#ccc' : 'var(--sgc-primary)',
          color: '#fff', fontSize: '0.9rem', fontWeight: 500,
          cursor: saving || estado === estadoActual ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--sgc-font)',
        }}
      >
        {saving ? 'Guardando...' : 'Guardar Estado'}
      </button>
    </div>
  )
}
