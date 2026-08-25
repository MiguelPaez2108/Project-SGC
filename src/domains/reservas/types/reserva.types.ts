import type { Database } from '@/infrastructure/supabase/types'

export type Reserva = Database['public']['Tables']['reservas']['Row']
export type ReservaInsert = Database['public']['Tables']['reservas']['Insert']
export type ReservaUpdate = Database['public']['Tables']['reservas']['Update']
export type EstadoReserva = 'pendiente' | 'confirmada' | 'en_uso' | 'completada' | 'cancelada'

export const ESTADO_RESERVA_LABELS: Record<EstadoReserva, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  en_uso: 'En Uso',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

export const ESTADO_RESERVA_COLORS: Record<EstadoReserva, string> = {
  pendiente: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  confirmada: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  en_uso: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  completada: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  cancelada: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export interface ReservaConRelaciones extends Reserva {
  usuarios?: { nombre: string; email: string; telefono: string | null }
  canchas?: { nombre: string; tipo_deporte: string }
}
