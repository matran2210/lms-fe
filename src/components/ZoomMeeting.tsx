'use client'

import { ZoomApi } from '@/api/zoom'
import { useZoomElementAdjustment } from '@/hooks/useZoomElementAdjustment'
import { useZoomSDK } from '@/hooks/useZoomSDK'
import { ZoomMeetingConfig } from '@/types/zoom'
import { getToken, toggleMeetingContainer } from '@/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import FloatingUser from './FloatingUser'

export const ZoomMeeting = () => {
  const { isSDKLoaded, isJoining, isJoined, error, joinMeeting } = useZoomSDK()
  const [meetingConfig, setMeetingConfig] = useState<ZoomMeetingConfig | null>(null)
  const [isLoadingMeetingData, setIsLoadingMeetingData] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tokenFromParams = searchParams.get('token')

  useZoomElementAdjustment(isJoined)

  useEffect(() => {
    const currentToken = getToken(tokenFromParams)
    setToken(currentToken)
  }, [tokenFromParams])

  const getZoomMeeting = async (token: string) => {
    const userInfoData = await ZoomApi.getZoomToken(token)
    const signatureData = await ZoomApi.getZoomSignature(userInfoData.data.meeting_id)

    return {
      userInfo: userInfoData.data,
      signature: signatureData.data,
    }
  }

  // Process token and prepare meeting data
  useEffect(() => {
    const processMeetingToken = async () => {
      if (!token) return

      try {
        setIsLoadingMeetingData(true)

        const decodedToken = decodeURIComponent(token)
        const meetingData = await getZoomMeeting(decodedToken)

        const config: ZoomMeetingConfig = {
          userId: meetingData.userInfo.user_id,
          meetingNumber: meetingData.userInfo.meeting_id,
          passWord: meetingData.userInfo.password,
          userName: meetingData.userInfo.full_name || meetingData.userInfo.first_name || 'Guest',
          userEmail: meetingData.userInfo.email || '',
          tkToken: meetingData.userInfo.token,
          signature: meetingData.signature.signature,
          sdkKey: meetingData.signature.sdk_key,
          hubspotContactId: meetingData.userInfo.hubspot_contact_id,
        }

        setMeetingConfig(config)
        setIsLoadingMeetingData(false)
      } catch (err) {
        toggleMeetingContainer('none')
        setIsLoadingMeetingData(false)
      }
    }

    processMeetingToken()
  }, [token])

  // Auto join meeting when SDK is loaded and meeting config is ready
  useEffect(() => {
    if (isSDKLoaded && meetingConfig && !isJoining && !error) {
      if (tokenFromParams) {
        router.replace(pathname, { scroll: false })
      }
      handleJoinMeeting()
    }
  }, [isSDKLoaded, meetingConfig, isJoining, error, tokenFromParams, router, pathname])

  const handleJoinMeeting = async () => {
    if (!meetingConfig) return

    await joinMeeting(meetingConfig)
  }

  if (!token) {
    return <p className="p-8 text-center text-gray-600">Không có thông tin cuộc họp</p>
  }

  if (!meetingConfig && !isLoadingMeetingData) {
    return <p className="p-8 text-center text-gray-600">Không có thông tin cuộc họp</p>
  }

  return (
    <div className="mb-6">
      {error && (
        <div className="mb-4 rounded-lg border-l-4 border-red-400 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi cuộc họp</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={handleJoinMeeting}
                  className="rounded bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isJoined && meetingConfig && <FloatingUser hubspotContactId={meetingConfig.hubspotContactId} />}
    </div>
  )
}
