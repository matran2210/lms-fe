'use client'

import { SHOW_FULL_SCREEN_CLASS } from '@/constants'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { useCallback, useEffect, useRef } from 'react'

export const useZoomElementAdjustment = (isJoined: boolean) => {
  const { setIsShowHeader } = useLayoutContext()
  const observerRef = useRef<MutationObserver | null>(null)

  const toggleFullScreen = useCallback((isFullScreen: boolean) => {
    const meetingContainer = document.getElementById(ZOOM_CONFIG.MEETING_CONTAINER_ID) as HTMLElement
    if (meetingContainer) {
      meetingContainer.classList.toggle(SHOW_FULL_SCREEN_CLASS, isFullScreen)
    }
  }, [])

  const setupFullScreenObserver = useCallback(() => {
    const fullScreenButton = document.querySelector(`.${ZOOM_CONFIG.MEETING_FULL_SCREEN_WIDGET}`)
    if (!fullScreenButton) return null

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
          const currentAriaLabel = fullScreenButton.getAttribute('aria-label')
          if (currentAriaLabel === ZOOM_CONFIG.MEETING_FULL_SCREEN_WIDGET_EXIT) {
            setIsShowHeader(false)
            toggleFullScreen(true)
            return
          }

          setIsShowHeader(true)
          toggleFullScreen(false)
        }
      })
    })

    observer.observe(fullScreenButton, {
      attributes: true,
      attributeFilter: ['aria-label'],
    })

    return observer
  }, [toggleFullScreen])

  useEffect(() => {
    if (!isJoined) return

    observerRef.current = setupFullScreenObserver()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [isJoined])
}
