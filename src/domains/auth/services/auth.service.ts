import { createClient } from '@/infrastructure/supabase/client'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema'
import type { Usuario } from '../types/auth.types'

const supabase = createClient()

export const authService = {
  async login({ email, password }: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  async signInWithFacebook() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  async signInWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  async signInWithMicrosoft() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  },

  async register({ email, password, nombre, telefono }: RegisterInput) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
      },
    })
    if (error) throw error

    // Insert into public usuarios table (non-fatal: auth already succeeded)
    if (data.user) {
      const { error: insertError } = await (supabase.from('usuarios') as any).insert({
        id: data.user.id,
        email,
        nombre,
        telefono: telefono || null,
        rol: 'cliente',
      })
      if (insertError) {
        // No lanzamos el error: el usuario ya existe en auth.users
        // El perfil se puede completar más adelante
        console.warn('[register] No se pudo insertar en tabla usuarios:', insertError.message)
      }
    }

    return data
  },

  async forgotPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    })
    if (error) throw error
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  },

  async getUserProfile(userId: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data as Usuario | null
  },
}
