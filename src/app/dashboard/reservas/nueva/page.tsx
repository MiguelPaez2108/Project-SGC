import { createClient } from '@/infrastructure/supabase/server'
import type { Metadata } from 'next'
import { NuevaReservaForm } from './NuevaReservaForm'

export const metadata: Metadata = {
  title: 'Nueva Reserva | Project SGC',
}

export default async function NuevaReservaPage() {
  const supabase = await createClient()

  const [{ data: clientesData }, { data: canchasData }] = await Promise.all([
    supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('rol', 'cliente')
      .eq('activo', true)
      .order('nombre'),
    supabase
      .from('canchas')
      .select('id, nombre, precio_por_hora')
      .eq('estado', 'activa')
      .order('nombre'),
  ])

  return (
    <NuevaReservaForm
      clientes={clientesData ?? []}
      canchas={canchasData ?? []}
    />
  )
}
