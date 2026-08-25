import { createClient } from '@/infrastructure/supabase/server'
import { notFound } from 'next/navigation'
import EditarCanchaForm from './EditarCanchaForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Database } from '@/infrastructure/supabase/types'

type Cancha = Database['public']['Tables']['canchas']['Row']

export default async function EditarCanchaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('canchas').select('*').eq('id', id).single()
  if (!data) notFound()
  const cancha = data as Cancha

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard/canchas" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--sgc-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '12px',
        }}>
          <ArrowLeft size={15} /> Volver a Canchas
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--sgc-text)' }}>Editar Cancha</h1>
        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'var(--sgc-text-muted)' }}>{cancha.nombre}</p>
      </div>
      <EditarCanchaForm cancha={cancha} />
    </div>
  )
}
