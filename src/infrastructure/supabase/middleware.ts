import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database, RolType } from '@/infrastructure/supabase/types'
import { canAccess } from '@/lib/rbac'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT remove this getUser() call.
  // It refreshes the auth token and ensures cookies stay fresh.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/auth/callback']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users to login (excluyendo llamadas de API locales)
  if (!user && !isPublicRoute && !pathname.startsWith('/api')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && isPublicRoute && pathname !== '/auth/callback') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // RBAC: check role-based access for dashboard routes
  if (user && pathname.startsWith('/dashboard')) {
    // Fetch user profile to get rol — cast necesario porque los tipos generados no encajan sin as any
    const { data: profileData } = await (supabase as any)
      .from('usuarios')
      .select('rol, activo')
      .eq('id', user.id)
      .single()

    const profile = profileData as { rol: RolType; activo: boolean } | null

    // If no profile or user is inactive, redirect to login
    if (!profile || !profile.activo) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const rol = profile.rol

    // Clientes have no access to the dashboard
    if (rol === 'cliente') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'sin_acceso_dashboard')
      return NextResponse.redirect(url)
    }

    // Check if the role can access this specific route
    if (!canAccess(rol, pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/acceso-denegado'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

