import { NextResponse } from 'next/server'
import axios from 'axios'

// get accessToken
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const redirectUri = `${process.env.NEXT_PUBLIC_WEB_LMS_URL}/api/auth/callback`
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }
  try {
    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: redirectUri,
        client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET!,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )

    const accessToken = tokenRes.data.access_token
    const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const urn = `urn:li:person:${profileRes.data.sub}`
    // Redirect về trang frontend kèm token
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: "LINKEDIN_TOKEN",
                  token: "${accessToken}",
                  personURN: "${urn}"
                },
                window.location.origin
              );
            }
            window.close();
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      },
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 },
    )
  }
}
