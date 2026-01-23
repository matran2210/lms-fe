import { fetcher } from '@/services/request'
import { BaseResponse } from '@/types'
import { DecryptedZoomUserInfo, ZoomSignature } from '@/types/zoom'

export class ZoomApi {
  static async getZoomToken(token: string, schedule_id?: string): Promise<BaseResponse<DecryptedZoomUserInfo>> {
    return fetcher(`/secure/decrypt-token?token=${encodeURIComponent(token)}&schedule_id=${schedule_id}`)
  }

  static async getZoomSignature(meetingNumber: string): Promise<BaseResponse<ZoomSignature>> {
    return fetcher(`/secure/signature?meeting_number=${meetingNumber}`)
  }
}
