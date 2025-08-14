import { ZOOM_CONFIG } from '@/constants/zoom'
import { RefObject, useEffect, useState } from 'react'

interface UseFloatingUserProps {
  floatingRef: RefObject<HTMLDivElement | null>
}

export const useFloatingUser = ({ floatingRef }: UseFloatingUserProps) => {
  const [position, setPosition] = useState({ top: -999, left: -999 })

  useEffect(() => {
    const changePosition = () => {
      const container = document.querySelector(
        `#${ZOOM_CONFIG.MEETING_CONTAINER_ID} .${ZOOM_CONFIG.MEETING_VIDEO_FRAME}`
      )

      if (!container || !floatingRef?.current) {
        return
      }

      const containerRect = container.getBoundingClientRect()
      const floatingRect = floatingRef.current.getBoundingClientRect()

      const floatingWidth = floatingRect.width
      const floatingHeight = floatingRect.height

      // Calculate boundaries based on provided area or container
      const minLeft = containerRect.left || 0
      const minTop = containerRect.top || 0
      const maxLeft = (containerRect.right || containerRect.width) - floatingWidth
      const maxTop = (containerRect.bottom || containerRect.height) - floatingHeight

      // Generate random position within boundaries
      const newTop = Math.max(minTop, Math.min(maxTop, Math.floor(minTop + Math.random() * (maxTop - minTop))))
      const newLeft = Math.max(minLeft, Math.min(maxLeft, Math.floor(minLeft + Math.random() * (maxLeft - minLeft))))

      setPosition({
        top: newTop,
        left: newLeft,
      })
    }

    const createElementObserver = () => {
      let observer: MutationObserver | null = null
      if (floatingRef.current) {
        observer = new MutationObserver(_ => {
          if (!document.body.contains(floatingRef.current as Node)) {
            const meetingContainer = document.getElementById(ZOOM_CONFIG.MEETING_CONTAINER_ID)
            if (meetingContainer) {
              meetingContainer.remove()
            }
            observer?.disconnect()
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })
      }
      return observer
    }

    const observer = createElementObserver()
    const intervalId = setInterval(changePosition, 5000)

    return () => {
      clearInterval(intervalId)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [floatingRef])

  return { position }
}
