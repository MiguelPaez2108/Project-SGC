import { createClient } from '@/infrastructure/supabase/server'
import { redirect } from 'next/navigation'
import { PageShell } from '@/shared/components/layout/PageShell'
import type { AuthUser, Usuario } from '@/domains/auth/types/auth.types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = data as Usuario | null

  // Si el perfil no existe o el usuario está inactivo, cerrar sesión
  if (!profile || !profile.activo) {
    await supabase.auth.signOut()
    redirect('/login')
  }

  const authUser: AuthUser = {
    id: profile.id,
    email: profile.email,
    nombre: profile.nombre,
    rol: profile.rol,
    activo: profile.activo,
  }

  return <PageShell user={authUser}>{children}</PageShell>
}
