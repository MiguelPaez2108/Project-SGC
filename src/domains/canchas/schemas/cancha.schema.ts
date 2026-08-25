import { z } from 'zod'

export const canchaSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  descripcion: z.string().max(2000, 'Máximo 2000 caracteres').optional().or(z.literal('')),
  tipo_deporte: z.string().min(1, 'Selecciona un deporte'),
  precio_por_hora: z
    .number({ message: 'Ingresa un precio válido' })
    .min(0, 'El precio no puede ser negativo')
    .max(9999999, 'Precio demasiado alto'),
  capacidad: z
    .number({ message: 'Ingresa una capacidad válida' })
    .int('La capacidad debe ser un número entero')
    .min(1, 'Mínimo 1 persona')
    .max(100000, 'Capacidad demasiado alta'),
  ubicacion: z.string().max(255).optional().or(z.literal('')),
  latitud: z.number().min(-90).max(90).optional().nullable(),
  longitud: z.number().min(-180).max(180).optional().nullable(),
  amenidades: z.array(z.string()),
  estado: z.enum(['activa', 'mantenimiento', 'inactiva']),
})

export type CanchaFormInput = z.infer<typeof canchaSchema>
