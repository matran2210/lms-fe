import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const certId = searchParams.get('certId')
  const redirectUri = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/api/auth/callback`

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social%20r_liteprofile&certId=${certId}`
  return NextResponse.redirect(authorizationUrl)
}
