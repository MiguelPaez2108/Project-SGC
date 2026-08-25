import type { Metadata } from 'next'
import Link from 'next/link'
import './LoginAsus.css'

export const metadata: Metadata = {
  title: 'Acceso | Project SGC',
  description: 'Ingresa a tu cuenta para gestionar reservas de canchas deportivas.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="asus-login-page">
      {/* Header */}
      <header className="asus-header">
        <div className="asus-logo">
          <Link href="/login">
          </Link>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="asus-footer">
        <div className="asus-footer-content">
          <div className="asus-footer-copy">
            © ASUSTeK Computer Inc. Todos los derechos reservados. / Project SGC
          </div>
          <div className="asus-footer-links">
            <a href="#">Condiciones de uso</a>
            <a href="#">Política de privacidad</a>
          </div>

        </div>
      </footer>
    </div>
  )
}

