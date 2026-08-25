import { type NextRequest } from 'next/server'
import { updateSession } from '@/infrastructure/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Entry_Page (static assets for the registration page)
     * - Any static file extension (js, css, svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|Entry_Page|.*\\.(?:js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)',
  ],
}
