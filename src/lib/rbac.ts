import type { RolType } from '@/infrastructure/supabase/types'

/**
 * Mapa de rutas protegidas y los roles que tienen acceso.
 * El match es por prefijo (mas especifico primero).
 */
export const ROUTE_PERMISSIONS: { prefix: string; roles: RolType[] }[] = [
  { prefix: '/dashboard/usuarios',          roles: ['admin'] },
  { prefix: '/dashboard/configuracion',     roles: ['admin'] },
  { prefix: '/dashboard/canchas/nueva',     roles: ['admin'] },
  { prefix: '/dashboard/canchas/',          roles: ['admin', 'recepcionista'] },
  { prefix: '/dashboard/reportes',          roles: ['admin', 'recepcionista'] },
]

export interface NavItemDef {
  href: string
  label: string
  roles: RolType[]
}

export const NAV_ITEMS_DEF: NavItemDef[] = [
  { href: '/dashboard',               label: 'Dashboard',    roles: ['admin', 'recepcionista'] },
  { href: '/dashboard/canchas',       label: 'Canchas',      roles: ['admin', 'recepcionista'] },
  { href: '/dashboard/reservas',      label: 'Reservas',     roles: ['admin', 'recepcionista'] },
  { href: '/dashboard/usuarios',      label: 'Usuarios',     roles: ['admin'] },
  { href: '/dashboard/reportes',      label: 'Reportes',     roles: ['admin', 'recepcionista'] },
  { href: '/dashboard/configuracion', label: 'Configuracion',roles: ['admin'] },
]

/**
 * Verifica si un rol tiene acceso a una ruta.
 * Retorna true si la ruta no tiene restriccion especifica.
 */
export function canAccess(rol: RolType, pathname: string): boolean {
  const sorted = [...ROUTE_PERMISSIONS].sort((a, b) => b.prefix.length - a.prefix.length)
  const rule = sorted.find((r) => pathname.startsWith(r.prefix))
  if (!rule) return true
  return rule.roles.includes(rol)
}
