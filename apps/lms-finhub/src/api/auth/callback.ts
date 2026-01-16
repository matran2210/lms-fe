import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// get accessToken
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code } = req.query
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`

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
    res.setHeader('Content-Type', 'text/html')
    res.send(`
    <script>
      window.opener.postMessage(
        { type: "LINKEDIN_TOKEN", token: "${accessToken}", personURN: "${urn}" },
        window.location.origin
      );
      window.close();
    </script>
  `)
  } catch (err: any) {
    res.status(500).json({ error: err.response?.data || err.message })
  }
}
