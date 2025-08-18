import axios from 'axios'

export const uploadImageToLinkedIn = async (
  token: string,
  personURN: string,
  shareUrl: string,
  text: string,
) => {
  try {
    const res = await axios.post('/api/auth/linkedin/post', {
      accessToken: token,
      personURN,
      shareUrl,
      text,
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

export const getPersonURN = async (accessToken: string) => {
  try {
    const res = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return `urn:li:person:${res.data.sub}`
  } catch (error) {
    return ''
  }
}
