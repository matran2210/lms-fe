import { BaseResponse } from '@/types'
import { DecryptedZoomUserInfo, ZoomSignature } from '@/types/zoom'
import axios from 'axios'

export class ZoomApi {
  static async getZoomToken(token: string): Promise<BaseResponse<DecryptedZoomUserInfo>> {
    return axios
      .get(`http://localhost:7749/api/secure/decrypt-token?token=${encodeURIComponent(token)}`)
      .then(res => res.data)
  }

  static async getZoomSignature(meetingNumber: string): Promise<BaseResponse<ZoomSignature>> {
    return axios.get(`http://localhost:7749/api/secure/signature?meeting_number=${meetingNumber}`).then(res => res.data)
  }
}
