import type { Database, RolType } from '@/infrastructure/supabase/types'

export type Usuario = Database['public']['Tables']['usuarios']['Row']
export type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert']
export type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update']

export interface AuthUser {
  id: string
  email: string
  nombre: string
  rol: RolType
  activo: boolean
}

export interface SessionState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}
