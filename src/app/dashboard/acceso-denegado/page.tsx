import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceso denegado | Project SGC',
}

export default function AccesoDenegadoPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: '16px', textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '16px',
        background: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ShieldX size={28} color="#d32f2f" />
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--sgc-text)' }}>
          Acceso denegado
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'var(--sgc-text-muted)', maxWidth: 380 }}>
          No tenés permiso para ver esta sección. Si creés que es un error,
          contactá al administrador del sistema.
        </p>
      </div>
      <Link
        href="/dashboard"
        style={{
          marginTop: '8px', padding: '9px 24px', borderRadius: '8px',
          background: 'var(--sgc-primary)', color: '#fff',
          textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
        }}
      >
        Volver al dashboard
      </Link>
    </div>
  )
}
