import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`

  const providers: Record<string, { clientId: string; authorizeUrl: string; scopes: string[] }> = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: ['openid', 'profile', 'email'],
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID || '',
      authorizeUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
      scopes: ['public_profile', 'email'],
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      authorizeUrl: 'https://appleid.apple.com/auth/authorize',
      scopes: ['openid', 'email', 'name'],
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID || '',
      authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      scopes: ['openid', 'profile', 'email'],
    },
  }

  const config = providers[provider]

  if (!config || !config.clientId) {
    return NextResponse.json(
      { error: `OAuth provider ${provider} not configured` },
      { status: 400 }
    )
  }

  const params_obj = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: Math.random().toString(36).substring(7),
  })

  const url = `${config.authorizeUrl}?${params_obj.toString()}`
  return NextResponse.redirect(url)
}
