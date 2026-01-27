import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const shareUrl = searchParams.get('shareUrl')

  const redirectUri = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/api/auth/callback`

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent('openid profile email w_member_social')}&state=${encodeURIComponent(
    String(shareUrl),
  )}`

  return NextResponse.redirect(authUrl)
}
