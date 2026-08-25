'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/domains/auth/schemas/auth.schema'
import { authService } from '@/domains/auth/services/auth.service'

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const emailValue = watch('email')

  async function onSubmit(data: ForgotPasswordInput) {
    setServerError(null)
    try {
      await authService.forgotPassword(data.email)
      setSuccess(true)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Error al enviar el email')
    }
  }

  return (
    <div className="asus-wrapper">
      <div className="asus-main">
        {/* Left Side - Benefits */}
        <div className="asus-left">
          <div className="asus-ad">
            <img src="/assets/icons/login_img02.png" alt="Project SGC Ultimate" className="asus-main-img" />
            <h1>Restablece tu contraseña de Project SGC Ultimate</h1>
            <h2>No te preocupes, te ayudaremos a recuperar el acceso a tu portal deportivo.</h2>
            <ul>
              <li>
                <img src="/assets/icons/login_icon_01.svg" alt="" />
                <span>Gestiona tus reservas de canchas deportivas</span>
              </li>
              <li>
                <img src="/assets/icons/login_icon_02.svg" alt="" />
                <span>Realiza pagos de forma segura y rápida</span>
              </li>
              <li>
                <img src="/assets/icons/login_icon_03.svg" alt="" />
                <span>Obtén asistencia técnica y seguimiento personalizado</span>
              </li>
              <li>
                <img src="/assets/icons/login_icon_04.svg" alt="" />
                <span>Accede a tu historial completo de reservas</span>
              </li>
              <li>
                <img src="/assets/icons/login_icon_05.svg" alt="" />
                <span>Recibe notificaciones y actualizaciones en tiempo real</span>
              </li>
              <li>
                <img src="/assets/icons/login_icon_06.svg" alt="" />
                <span>Permanece al tanto de eventos y promociones exclusivas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="asus-right">
          <h3 className="asus-form-title">Recuperar contraseña</h3>

          {serverError && (
            <div className="asus-alert asus-alert-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#D32F2F"/>
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {success ? (
            <div className="asus-success-container" style={{ padding: '20px 0' }}>
              <div className="asus-alert" style={{ backgroundColor: '#e6f4ea', color: '#137333', border: '1px solid #c2e7c9' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '8px' }}>
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#137333"/>
                </svg>
                <span>¡Email enviado con éxito!</span>
              </div>
              <p style={{ color: '#4d4d4d', fontSize: '0.9375rem', marginBottom: '24px', lineHeight: '1.5' }}>
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Link
                href="/login"
                className="asus-btn asus-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="asus-form" noValidate>
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '20px', lineHeight: '1.4' }}>
                Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              {/* Email Input */}
              <div className={`asus-form-group ${touchedFields.email && errors.email ? 'asus-has-error' : ''} ${emailValue ? 'asus-has-value' : ''}`}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Su correo electrónico"
                  autoComplete="email"
                  {...register('email')}
                />
                <span className="asus-field-hint">Su correo electrónico</span>
                {touchedFields.email && errors.email && (
                  <span className="asus-error-text" id="email-error" role="alert">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="asus-btn asus-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="asus-spinner"></span>
                    Enviando enlace...
                  </>
                ) : (
                  'Enviar enlace'
                )}
              </button>

              <div className="asus-form-footer">
                <Link href="/login" className="asus-link">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
