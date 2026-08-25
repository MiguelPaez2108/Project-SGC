import { createClient } from '@/infrastructure/supabase/client'
import type { ReservaInsert, ReservaUpdate } from '../types/reserva.types'

const supabase = createClient()

export const reservasService = {
  async getAll() {
    const { data, error } = await (supabase.from('reservas') as any)
      .select(`
        *,
        usuarios(nombre, email, telefono),
        canchas(nombre, tipo_deporte)
      `)
      .order('fecha', { ascending: false })
      .order('hora_inicio', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await (supabase.from('reservas') as any)
      .select(`
        *,
        usuarios(nombre, email, telefono),
        canchas(nombre, tipo_deporte, precio_por_hora)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByDate(fecha: string) {
    const { data, error } = await (supabase.from('reservas') as any)
      .select(`
        *,
        usuarios(nombre, email),
        canchas(nombre, tipo_deporte)
      `)
      .eq('fecha', fecha)
      .order('hora_inicio')
    if (error) throw error
    return data
  },

  async getByCancha(canchaId: string, fecha: string) {
    const { data, error } = await (supabase.from('reservas') as any)
      .select('hora_inicio, hora_fin, estado')
      .eq('cancha_id', canchaId)
      .eq('fecha', fecha)
      .neq('estado', 'cancelada')
    if (error) throw error
    return data
  },

  async create(reserva: ReservaInsert) {
    const { data, error } = await (supabase.from('reservas') as any)
      .insert(reserva)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, reserva: ReservaUpdate) {
    const { data, error } = await (supabase.from('reservas') as any)
      .update({ ...reserva, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async changeStatus(id: string, estado: string) {
    return reservasService.update(id, { estado: estado as any })
  },

  async cancel(id: string) {
    return reservasService.changeStatus(id, 'cancelada')
  },
}
