'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/infrastructure/supabase/client'
import { authService } from '../services/auth.service'
import type { AuthUser, SessionState } from '../types/auth.types'

export function useAuth(): SessionState {
  const [state, setState] = useState<SessionState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const supabase = createClient()

    const loadUser = async () => {
      const authUser = await authService.getUser()
      if (!authUser) {
        setState({ user: null, isLoading: false, isAuthenticated: false })
        return
      }

      const profile = await authService.getUserProfile(authUser.id)
      if (!profile) {
        setState({ user: null, isLoading: false, isAuthenticated: false })
        return
      }

      setState({
        user: {
          id: profile.id,
          email: profile.email,
          nombre: profile.nombre,
          rol: profile.rol,
          activo: profile.activo,
        },
        isLoading: false,
        isAuthenticated: true,
      })
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser()
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
