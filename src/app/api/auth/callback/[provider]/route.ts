import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/register?error=${encodeURIComponent(error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/register?error=missing_code`
    )
  }

  try {
    // TODO: Exchange code for token with OAuth provider
    // This involves:
    // 1. Making a request to the provider's token endpoint with the code
    // 2. Getting the access token
    // 3. Using the access token to get user info
    // 4. Creating or updating user in database
    // 5. Creating session/JWT token

    // For now, redirecting to login with a success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?oauth_success=true`
    )
  } catch (error) {
    console.error(`OAuth callback error for ${provider}:`, error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/register?error=oauth_failed`
    )
  }
}
