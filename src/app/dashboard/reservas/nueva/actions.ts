'use server'

import { createClient } from '@/infrastructure/supabase/server'
import type { Database } from '@/infrastructure/supabase/types'
import { z } from 'zod'

type UsuarioRow = Database['public']['Tables']['usuarios']['Row']
type CanchaRow  = Database['public']['Tables']['canchas']['Row']
type ReservaRow = Database['public']['Tables']['reservas']['Row']
type ReservaInsert = Database['public']['Tables']['reservas']['Insert']

// Schema de validacion server-side (sin precio — lo calculamos nosotros)
const reservaInputSchema = z.object({
  usuario_id:  z.string().uuid('ID de usuario invalido'),
  cancha_id:   z.string().uuid('ID de cancha invalido'),
  fecha:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha invalida'),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Hora de inicio invalida'),
  hora_fin:    z.string().regex(/^\d{2}:\d{2}$/, 'Hora de fin invalida'),
  estado:      z.enum(['pendiente', 'confirmada', 'en_uso', 'completada', 'cancelada']),
  notas:       z.string().max(500).optional(),
})

export type CrearReservaResult =
  | { ok: true; reservaId: string }
  | { ok: false; error: string }

export async function crearReserva(
  formData: z.infer<typeof reservaInputSchema>
): Promise<CrearReservaResult> {
  // 1. Verificar sesion activa
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  // Verificar que el usuario es staff (admin o recepcionista)
  const { data: profileData } = await (supabase as any)
    .from('usuarios')
    .select('rol, activo')
    .eq('id', user.id)
    .single()

  const profile = profileData as Pick<UsuarioRow, 'rol' | 'activo'> | null

  if (!profile || !profile.activo || profile.rol === 'cliente') {
    return { ok: false, error: 'Sin permiso para crear reservas' }
  }

  // 2. Validar input
  const parsed = reservaInputSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { ok: false, error: firstError.message }
  }
  const data = parsed.data

  // Validar que hora_fin > hora_inicio
  if (data.hora_fin <= data.hora_inicio) {
    return { ok: false, error: 'La hora de fin debe ser mayor que la hora de inicio' }
  }

  // Validar que la fecha no sea en el pasado
  const hoy = new Date().toISOString().split('T')[0]
  if (data.fecha < hoy) {
    return { ok: false, error: 'No se pueden crear reservas en fechas pasadas' }
  }

  // 3. Obtener precio_por_hora de la DB (nunca del cliente)
  const { data: canchaData, error: canchaError } = await (supabase as any)
    .from('canchas')
    .select('precio_por_hora, estado')
    .eq('id', data.cancha_id)
    .single()

  const cancha = canchaData as Pick<CanchaRow, 'precio_por_hora' | 'estado'> | null

  if (canchaError || !cancha) {
    return { ok: false, error: 'Cancha no encontrada' }
  }
  if (cancha.estado !== 'activa') {
    return { ok: false, error: 'La cancha no esta disponible' }
  }

  // Calcular precio total en el servidor
  const [h1, m1] = data.hora_inicio.split(':').map(Number)
  const [h2, m2] = data.hora_fin.split(':').map(Number)
  const horas = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60
  if (horas <= 0) {
    return { ok: false, error: 'Duracion de reserva invalida' }
  }
  const precioTotal = Math.round(horas * cancha.precio_por_hora)

  // 4. Verificar solapamiento de horarios
  const { data: reservasData, error: solapError } = await (supabase as any)
    .from('reservas')
    .select('id, hora_inicio, hora_fin')
    .eq('cancha_id', data.cancha_id)
    .eq('fecha', data.fecha)
    .neq('estado', 'cancelada')

  if (solapError) {
    return { ok: false, error: 'Error al verificar disponibilidad' }
  }

  const reservasExistentes = (reservasData ?? []) as Pick<ReservaRow, 'id' | 'hora_inicio' | 'hora_fin'>[]

  const hayConflicto = reservasExistentes.some((r) => {
    // Overlap: inicio_existente < fin_nueva AND fin_existente > inicio_nueva
    return r.hora_inicio < data.hora_fin && r.hora_fin > data.hora_inicio
  })

  if (hayConflicto) {
    return {
      ok: false,
      error: 'La cancha ya tiene una reserva activa en ese horario. Elegí otro horario.',
    }
  }

  // 5. Insertar la reserva
  const payload: ReservaInsert = {
    usuario_id:   data.usuario_id,
    cancha_id:    data.cancha_id,
    fecha:        data.fecha,
    hora_inicio:  data.hora_inicio,
    hora_fin:     data.hora_fin,
    estado:       data.estado,
    precio_total: precioTotal,
    pagado:       false,
    notas:        data.notas || null,
  }

  const { data: nuevaData, error: insertError } = await (supabase as any)
    .from('reservas')
    .insert(payload)
    .select('id')
    .single()

  const nuevaReserva = nuevaData as Pick<ReservaRow, 'id'> | null

  if (insertError || !nuevaReserva) {
    return { ok: false, error: insertError?.message ?? 'Error al crear la reserva' }
  }

  return { ok: true, reservaId: nuevaReserva.id }
}
