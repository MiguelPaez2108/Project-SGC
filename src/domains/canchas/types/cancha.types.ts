import type { Database } from '@/infrastructure/supabase/types'

export type Cancha = Database['public']['Tables']['canchas']['Row']
export type CanchaInsert = Database['public']['Tables']['canchas']['Insert']
export type CanchaUpdate = Database['public']['Tables']['canchas']['Update']
export type EstadoCancha = 'activa' | 'mantenimiento' | 'inactiva'

export const DEPORTES = [
  'Fútbol',
  'Baloncesto',
  'Tenis',
  'Pádel',
  'Voleibol',
  'Béisbol',
  'Softball',
  'Squash',
  'Bádminton',
  'Otro',
] as const

export const AMENIDADES = [
  'Iluminación nocturna',
  'Estacionamiento',
  'Vestuarios',
  'Duchas',
  'WiFi',
  'Cafetería',
  'Tienda deportiva',
  'Área de calentamiento',
  'Tribuna',
  'Alquiler de equipos',
] as const

export const ESTADO_CANCHA_LABELS: Record<EstadoCancha, string> = {
  activa: 'Activa',
  mantenimiento: 'En Mantenimiento',
  inactiva: 'Inactiva',
}

export const ESTADO_CANCHA_COLORS: Record<EstadoCancha, string> = {
  activa: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  mantenimiento: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  inactiva: 'text-red-400 bg-red-400/10 border-red-400/20',
}
