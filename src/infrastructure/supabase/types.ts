export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type RolType = 'admin' | 'recepcionista' | 'cliente'
export type EstadoCancha = 'activa' | 'mantenimiento' | 'inactiva'
export type EstadoReserva = 'pendiente' | 'confirmada' | 'en_uso' | 'completada' | 'cancelada'
export type EstadoPago = 'pendiente' | 'exitoso' | 'fallido' | 'reembolsado'
export type TipoMantenimiento = 'preventivo' | 'correctivo'
export type EstadoMantenimiento = 'planificado' | 'en_progreso' | 'completado'

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          telefono: string | null
          rol: RolType
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nombre: string
          telefono?: string | null
          rol?: RolType
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          nombre?: string
          telefono?: string | null
          rol?: RolType
          activo?: boolean
          updated_at?: string
        }
      }
      canchas: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          tipo_deporte: string
          precio_por_hora: number
          capacidad: number
          ubicacion: string | null
          latitud: number | null
          longitud: number | null
          amenidades: Json | null
          fotos_url: string[] | null
          estado: EstadoCancha
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          tipo_deporte: string
          precio_por_hora: number
          capacidad: number
          ubicacion?: string | null
          latitud?: number | null
          longitud?: number | null
          amenidades?: Json | null
          fotos_url?: string[] | null
          estado?: EstadoCancha
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?: string
          descripcion?: string | null
          tipo_deporte?: string
          precio_por_hora?: number
          capacidad?: number
          ubicacion?: string | null
          latitud?: number | null
          longitud?: number | null
          amenidades?: Json | null
          fotos_url?: string[] | null
          estado?: EstadoCancha
          updated_at?: string
        }
      }
      franjas_horarias: {
        Row: {
          id: string
          cancha_id: string
          hora_inicio: string
          hora_fin: string
          dia_semana: number
          precio_multiplicador: number
          disponible: boolean
          created_at: string
        }
        Insert: {
          id?: string
          cancha_id: string
          hora_inicio: string
          hora_fin: string
          dia_semana: number
          precio_multiplicador?: number
          disponible?: boolean
          created_at?: string
        }
        Update: {
          hora_inicio?: string
          hora_fin?: string
          dia_semana?: number
          precio_multiplicador?: number
          disponible?: boolean
        }
      }
      reservas: {
        Row: {
          id: string
          usuario_id: string
          cancha_id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          estado: EstadoReserva
          precio_total: number
          pagado: boolean
          metodo_pago: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          cancha_id: string
          fecha: string
          hora_inicio: string
          hora_fin: string
          estado?: EstadoReserva
          precio_total: number
          pagado?: boolean
          metodo_pago?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          fecha?: string
          hora_inicio?: string
          hora_fin?: string
          estado?: EstadoReserva
          precio_total?: number
          pagado?: boolean
          metodo_pago?: string | null
          notas?: string | null
          updated_at?: string
        }
      }
      pagos: {
        Row: {
          id: string
          reserva_id: string
          usuario_id: string
          monto: number
          moneda: string
          estado: EstadoPago
          stripe_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reserva_id: string
          usuario_id: string
          monto: number
          moneda?: string
          estado?: EstadoPago
          stripe_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          estado?: EstadoPago
          stripe_payment_id?: string | null
          updated_at?: string
        }
      }
      notificaciones: {
        Row: {
          id: string
          usuario_id: string
          tipo: string | null
          mensaje: string
          leida: boolean
          reserva_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          tipo?: string | null
          mensaje: string
          leida?: boolean
          reserva_id?: string | null
          created_at?: string
        }
        Update: {
          leida?: boolean
        }
      }
      mantenimiento: {
        Row: {
          id: string
          cancha_id: string
          tipo: TipoMantenimiento
          descripcion: string | null
          fecha_inicio: string | null
          fecha_fin: string | null
          estado: EstadoMantenimiento
          notas: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cancha_id: string
          tipo: TipoMantenimiento
          descripcion?: string | null
          fecha_inicio?: string | null
          fecha_fin?: string | null
          estado?: EstadoMantenimiento
          notas?: string | null
          created_at?: string
        }
        Update: {
          tipo?: TipoMantenimiento
          descripcion?: string | null
          fecha_inicio?: string | null
          fecha_fin?: string | null
          estado?: EstadoMantenimiento
          notas?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      rol_type: RolType
      estado_cancha: EstadoCancha
      estado_reserva: EstadoReserva
      estado_pago: EstadoPago
      tipo_mantenimiento: TipoMantenimiento
      estado_mantenimiento: EstadoMantenimiento
    }
  }
}
