import { BaseResponse } from '@/types'
import { DecryptedZoomUserInfo, ZoomSignature } from '@/types/zoom'
import axios from 'axios'

export async function processZoomMeetingAction(token: string): Promise<{
  userInfo: DecryptedZoomUserInfo
  signature: ZoomSignature
}> {
  try {
    if (!token) {
      throw new Error('Token is required')
    }

    const userInfo = await getZoomTokenAction(token)
    const signature = await getZoomSignatureAction(userInfo.meeting_id)

    return {
      userInfo,
      signature,
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to process meeting data')
  }
}

export async function getZoomTokenAction(token: string): Promise<DecryptedZoomUserInfo> {
  try {
    if (!token) {
      throw new Error('Token is required')
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7749/api'

    if (!BACKEND_URL) {
      throw new Error('Backend token URL not configured')
    }

    const url = `${BACKEND_URL}/secure/decrypt-token?token=${encodeURIComponent(token)}`

    const response = await axios.get<BaseResponse<DecryptedZoomUserInfo>>(url)

    const tokenData = response.data

    if (!tokenData.success) {
      throw new Error('Invalid response from backend - missing meeting info')
    }

    return tokenData.data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to process token')
  }
}

export async function getZoomSignatureAction(meetingNumber: string): Promise<ZoomSignature> {
  try {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7749/api'

    if (!BACKEND_URL) {
      throw new Error('Backend signature URL not configured')
    }

    const url = `${BACKEND_URL}/secure/signature?meeting_number=${meetingNumber}`

    const response = await axios.get<BaseResponse<ZoomSignature>>(url)

    const signatureData = response.data

    if (!signatureData.success) {
      throw new Error(signatureData.message || 'Failed to get signature from backend')
    }

    return signatureData.data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get signature')
  }
}
