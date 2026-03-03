import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
  const { accessToken, personURN, shareUrl, text, imageBase64 } =
    await req.json()

  try {
    // Step 1: Register upload
    const registerRes = await axios.post(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      {
        registerUploadRequest: {
          owner: personURN, // ví dụ: "urn:li:person:xxxx"
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          serviceRelationships: [
            {
              identifier: 'urn:li:userGeneratedContent',
              relationshipType: 'OWNER',
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    )

    const uploadUrl =
      registerRes.data.value.uploadMechanism[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ].uploadUrl
    const asset = registerRes.data.value.asset

    // Step 2. Download image from shareUrl
    // const decodedUrl = decodeURIComponent(shareUrl as string)
    // const imageRes = await axios.get(decodedUrl as string, {
    //   responseType: 'arraybuffer',
    // })
    // Step 2.5 Upload image binary lên LinkedIn
    // const contentType = imageRes.headers['content-type'] || 'image/png'

    // await axios.put(uploadUrl, imageRes.data, {
    //   headers: {
    //     'Content-Type': contentType, // hoặc 'image/jpeg' tùy loại ảnh thật sự
    //   },
    // })
    const contentType = 'image/png'
    const bufferImage = Buffer.from(imageBase64, 'base64')

    await axios.put(uploadUrl, bufferImage, {
      headers: {
        'Content-Type': contentType, // hoặc 'image/jpeg' tùy loại ảnh thật sự
      },
    })

    // Step 3: Create post
    await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: personURN,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: text },
            shareMediaCategory: 'IMAGE',
            media: [{ status: 'READY', media: asset }],
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return NextResponse.json({ success: true, message: 'Post successfully!' })
  } catch (err: any) {
    return NextResponse.json(
      {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      },
      { status: 500 },
    )
  }
}
