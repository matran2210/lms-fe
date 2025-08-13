import { ZOOM_CONFIG } from '@/constants/zoom'
import { RefObject, useEffect, useState } from 'react'

interface AreaBoundary {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

interface UseFloatingUserProps {
  floatingRef: RefObject<HTMLDivElement | null>
  areaBoundary?: AreaBoundary
}

export const useFloatingUser = ({ floatingRef, areaBoundary }: UseFloatingUserProps) => {
  const [position, setPosition] = useState({ top: -9999, left: -9999 })

  useEffect(() => {
    const changePosition = () => {
      const container = document.querySelector(
        `#${ZOOM_CONFIG.MEETING_CONTAINER_ID} .${ZOOM_CONFIG.MEETING_VIDEO_FRAME}`
      )

      if (!container || !floatingRef?.current) {
        return
      }

      const containerRect = areaBoundary || container.getBoundingClientRect()
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

    const intervalId = setInterval(changePosition, 5000)

    return () => {
      clearInterval(intervalId)
    }
  }, [floatingRef, areaBoundary])

  return { position }
}
