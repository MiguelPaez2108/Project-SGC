import { z } from 'zod'

export const reservaSchema = z
  .object({
    cancha_id: z.string().min(1, 'Selecciona una cancha'),
    usuario_id: z.string().min(1, 'Selecciona un cliente'),
    fecha: z.string().min(1, 'Selecciona una fecha'),
    hora_inicio: z.string().min(1, 'Selecciona la hora de inicio'),
    hora_fin: z.string().min(1, 'Selecciona la hora de fin'),
    precio_total: z
      .number({ message: 'Precio inválido' })
      .min(0, 'Precio no puede ser negativo'),
    metodo_pago: z.string().optional(),
    notas: z.string().max(500).optional().or(z.literal('')),
    pagado: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.hora_inicio || !data.hora_fin) return true
      return data.hora_fin > data.hora_inicio
    },
    {
      message: 'La hora de fin debe ser mayor que la hora de inicio',
      path: ['hora_fin'],
    }
  )

export type ReservaFormInput = z.infer<typeof reservaSchema>

export const METODOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'daviplata', label: 'Daviplata' },
] as const
