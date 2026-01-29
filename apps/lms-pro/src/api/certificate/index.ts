import { ICertificate } from '@lms/core'
import axios from 'axios'

export const uploadImageToLinkedIn = async (
  token: string,
  personURN: string,
  shareUrl: string,
  text: string,
  imageBase64: string,
) => {
  try {
    const res = await axios.post('/api/auth/linkedin/post', {
      accessToken: token,
      personURN,
      // shareUrl,
      text,
      imageBase64,
    })

    if (res.data.success) {
      return res
    } else {
      throw new Error(res.data.message)
    }
  } catch (err: any) {
    throw new Error(err.message)
  }
}
