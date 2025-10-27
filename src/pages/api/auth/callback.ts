import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { code, state: shareUrl } = req.query
//   try {
//     const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`

//     // 1. Exchange code lấy access_token
//     const tokenRes = await axios.post(
//       'https://www.linkedin.com/oauth/v2/accessToken',
//       new URLSearchParams({
//         grant_type: 'authorization_code',
//         code: code as string,
//         redirect_uri: redirectUri,
//         client_id: process.env.LINKEDIN_CLIENT_ID!,
//         client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
//       }),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     )

//     const accessToken = tokenRes.data.access_token

//     const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })

//     const urn = `urn:li:person:${profileRes.data.sub}`

//     // 3. Register image upload
//     const registerUploadRes = await axios.post(
//       'https://api.linkedin.com/v2/assets?action=registerUpload',
//       {
//         registerUploadRequest: {
//           owner: urn,
//           recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
//           serviceRelationships: [
//             {
//               identifier: 'urn:li:userGeneratedContent',
//               relationshipType: 'OWNER',
//             },
//           ],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//           'X-Restli-Protocol-Version': '2.0.0',
//         },
//       },
//     )

//     const uploadUrl =
//       registerUploadRes.data.value.uploadMechanism[
//         'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
//       ].uploadUrl

//     const asset = registerUploadRes.data.value.asset

//     // 4. Download image from shareUrl
//     const imageRes = await axios.get(shareUrl as string, {
//       responseType: 'arraybuffer',
//     })

//     // 5. Upload image to LinkedIn
//     await axios.put(uploadUrl, imageRes.data, {
//       headers: {
//         'Content-Type': 'image/png', // Hoặc image/jpeg tùy ảnh
//       },
//     })

//     res.setHeader('Content-Type', 'text/html')
//     return res.send(`
//       <html>
//         <head>
//           <script>
//             window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL}/share-linkedin?accessToken=${accessToken}&urn=${urn}&asset=${encodeURIComponent(asset)}&shareUrl=${encodeURIComponent(shareUrl as string)}';
//           </script>
//         </head>
//       </html>
//     `)
//   } catch (err) {
//     return res.send(`<script>
//       window.opener.postMessage({ status: 'error' }, "${process.env.NEXT_PUBLIC_BASE_URL}");
//       window.close();
//     </script>`)
//   }
// }

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
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
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
