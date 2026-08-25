import { NextRequest, NextResponse } from 'next/server'

/**
 * Mock del endpoint /api/CountryApi/GetList que el bundle memberEntryPage.js
 * llama para obtener el WebsiteCode del país detectado por IP.
 *
 * En producción esto lo maneja el backend de ASUS (account.asus.com).
 * En desarrollo (localhost) no existe, así que devolvemos una respuesta
 * con la estructura esperada para evitar el TypeError:
 *   "Cannot read properties of undefined (reading 'WebsiteCode')"
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    Result: {
      WebsiteCode: 'global',
      CountryCode: 'global',
      LanguageCode: 'es',
    },
    Message: 'OK',
    Status: 0,
  })
}
