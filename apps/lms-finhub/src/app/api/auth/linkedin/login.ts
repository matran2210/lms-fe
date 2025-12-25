import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { certId } = req.query
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social%20r_liteprofile&certId=${certId}`
  res.redirect(authorizationUrl)
}
