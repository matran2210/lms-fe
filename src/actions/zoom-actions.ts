'use server'

import { BaseResponse } from '@/types'
import { DecryptedZoomUserInfo, ZoomSignature } from '@/types/zoom'
import axios from 'axios'

export async function processZoomTokenAction(token: string): Promise<DecryptedZoomUserInfo> {
  try {
    if (!token) {
      throw new Error('Token is required')
    }

    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7749/api'

    if (!BACKEND_URL) {
      throw new Error('Backend token URL not configured')
    }

    const url = `${BACKEND_URL}/secure/decrypt-token?token=${encodeURIComponent(token)}`

    // Call external backend to process token (server-side)
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

    // Call external backend to get signature (server-side)
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
