import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'Mínimo 6 caracteres'),
})

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(3, 'Mínimo 3 caracteres'),
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Ingresa un email válido'),
    telefono: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 7, 'Número inválido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
