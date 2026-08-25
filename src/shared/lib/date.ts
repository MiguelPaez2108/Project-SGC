import { format, formatDistance, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Fecha inválida'
  return format(d, pattern, { locale: es })
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "dd/MM/yyyy 'a las' HH:mm")
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(d, new Date(), { addSuffix: true, locale: es })
}

export function formatTime(time: string) {
  // time format: HH:MM:SS or HH:MM
  return time.slice(0, 5)
}

export function formatCurrency(amount: number, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}
