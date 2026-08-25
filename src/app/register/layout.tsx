import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Crear cuenta | Project SGC',
  description: 'Crea tu cuenta para acceder a Project SGC Ultimate.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* CSS de memberEntryPage */}
      <link href="/Entry_Page/public/css/memberEntryPage.css?t=27" rel="stylesheet" />

      {/* AsusAPIConfig se define en el root layout con strategy="beforeInteractive" */}

      {/*
        Script de guardia: intercepta la lógica de redirección geográfica del bundle
        memberEntryPage.js para que no saque al usuario de /register.
        Se ejecuta síncronamente ANTES de que el bundle cargue.
      */}
      <Script
        id="register-guard"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Prevenir que el script de ASUS redirija fuera de /register
              var _origHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
              try {
                Object.defineProperty(window.location, 'href', {
                  set: function(val) {
                    // Permitir solo si NO es una redirección interna del script ASUS
                    // (rutas que no sean /register se bloquean mientras estemos en /register)
                    if (window.location.pathname === '/register' &&
                        typeof val === 'string' &&
                        val.indexOf('/register') === -1 &&
                        val.indexOf('login') === -1) {
                      console.warn('[SGC] Redirección bloqueada por guardia de registro:', val);
                      return;
                    }
                    if (_origHrefDescriptor && _origHrefDescriptor.set) {
                      _origHrefDescriptor.set.call(window.location, val);
                    } else {
                      window.location.assign(val);
                    }
                  },
                  get: function() {
                    return window.location.toString();
                  },
                  configurable: true
                });
              } catch(e) {
                // location.href no siempre es configurable; ignorar
              }
            })();
          `,
        }}
      />

      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #f3f3f3 !important;
        }
        /* Eliminar la franja gris (espacio de 48px) creada por el pseudo-elemento body::before en memberEntryPage.css */
        body::before {
          content: none !important;
          display: none !important;
          height: 0 !important;
        }
        /* Ocultar cualquier header oficial inyectado por el script de ASUS */
        #OfficialHeaderWrapper, 
        .headerExternal, 
        [id*="OfficialHeaderWrapper"], 
        [class*="Header_headerWrapper"] {
          display: none !important;
        }
        /* Ocultar el overlay de carga del script ASUS */
        #loading {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
