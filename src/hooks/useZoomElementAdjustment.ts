'use client'

import { ZOOM_CONFIG } from '@/constants/zoom'
import { adjustElement } from '@/utils'
import { useCallback, useEffect, useRef } from 'react'

export const useZoomElementAdjustment = (isJoined: boolean) => {
  const observerRef = useRef<MutationObserver | null>(null)

  const adjustFrameElement = useCallback(() => {
    const frameSelector = `.${ZOOM_CONFIG.MEETING_VIDEO_FRAME}`
    adjustElement(frameSelector)
  }, [])

  const adjustAvatarElement = useCallback(() => {
    const avatarSelector = `.${ZOOM_CONFIG.MEETING_VIDEO_AVATAR}`
    adjustElement(avatarSelector)
  }, [])

  const adjustVideoPlayerElement = useCallback(() => {
    const videoPlayerSelector = `.${ZOOM_CONFIG.MEETING_VIDEO_FRAME} > video-player`
    // Wait for the video player to be available
    setTimeout(() => {
      adjustElement(videoPlayerSelector)
    }, 1000)
  }, [])

  const setupFullScreenObserver = useCallback(() => {
    const fullScreenButton = document.querySelector(`.${ZOOM_CONFIG.MEETING_FULL_SCREEN_WIDGET}`)
    if (!fullScreenButton) return null

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
          const currentAriaLabel = fullScreenButton.getAttribute('aria-label')
          if (currentAriaLabel === ZOOM_CONFIG.MEETING_FULL_SCREEN_WIDGET_EXIT) return

          adjustFrameElement()
        }
      })
    })

    observer.observe(fullScreenButton, {
      attributes: true,
      attributeFilter: ['aria-label'],
    })

    return observer
  }, [adjustFrameElement])

  useEffect(() => {
    if (!isJoined) return

    adjustFrameElement()
    adjustAvatarElement()

    observerRef.current = setupFullScreenObserver()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [isJoined])

  return {
    adjustFrameElement,
    adjustAvatarElement,
    adjustVideoPlayerElement,
  }
}
