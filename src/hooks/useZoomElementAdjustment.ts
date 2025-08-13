'use client'

import { ZOOM_CONFIG } from '@/constants/zoom'
import { adjustElementHeight } from '@/utils'
import { useEffect } from 'react'

export const useZoomElementAdjustment = (isJoined: boolean) => {
  const adjustFrameAvatarElements = () => {
    const frameSelector = `.${ZOOM_CONFIG.MEETING_VIDEO_FRAME}`
    const avatarSelector = `.${ZOOM_CONFIG.MEETING_VIDEO_AVATAR}`

    const frameElement = document.querySelector(frameSelector)
    const avatarElement = document.querySelector(avatarSelector)

    frameElement && adjustElementHeight(frameElement)
    avatarElement && adjustElementHeight(avatarElement)
  }

  const adjustAllElements = () => {
    adjustFrameAvatarElements()
  }

  useEffect(() => {
    if (!isJoined) return

    adjustAllElements()
  }, [isJoined])

  return {
    adjustAllElements,
    adjustFrameAvatarElements,
  }
}
