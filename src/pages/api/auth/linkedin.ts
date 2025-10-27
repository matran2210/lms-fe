import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shareUrl } = req.query

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent('openid profile email w_member_social')}&state=${encodeURIComponent(
    String(shareUrl),
  )}`

  res.redirect(authUrl)
}
