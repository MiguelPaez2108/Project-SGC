import { createClient } from '@/infrastructure/supabase/client'
import type { Cancha, CanchaInsert, CanchaUpdate } from '../types/cancha.types'

const supabase = createClient()

export const canchasService = {
  async getAll(): Promise<Cancha[]> {
    const { data, error } = await (supabase.from('canchas') as any)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as Cancha[]
  },

  async getById(id: string): Promise<Cancha> {
    const { data, error } = await (supabase.from('canchas') as any)
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Cancha
  },

  async create(cancha: CanchaInsert): Promise<Cancha> {
    const { data, error } = await (supabase.from('canchas') as any)
      .insert(cancha)
      .select()
      .single()
    if (error) throw error
    return data as Cancha
  },

  async update(id: string, cancha: CanchaUpdate): Promise<Cancha> {
    const { data, error } = await (supabase.from('canchas') as any)
      .update({ ...cancha, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Cancha
  },

  async delete(id: string): Promise<void> {
    const { error } = await (supabase.from('canchas') as any).delete().eq('id', id)
    if (error) throw error
  },

  async getActivas(): Promise<Cancha[]> {
    const { data, error } = await (supabase.from('canchas') as any)
      .select('*')
      .eq('estado', 'activa')
      .order('nombre')
    if (error) throw error
    return (data || []) as Cancha[]
  },
}
