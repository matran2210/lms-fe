import { FLOATING_USER_POSITION_INTERVAL } from '../constants/index'
import { ZOOM_CONFIG } from '../constants/zoom'
import { RefObject, useEffect, useRef, useState } from 'react'

interface UseFloatingUserProps {
  floatingRef: RefObject<HTMLDivElement | null>
  onTamper?: () => void
}

export const useFloatingUser = ({ floatingRef, onTamper }: UseFloatingUserProps) => {
  const [position, setPosition] = useState({ top: -999, left: -999 })

  const onTamperRef = useRef(onTamper)
  onTamperRef.current = onTamper

  useEffect(() => {
    let tampered = false

    const removeMeetingContainer = () => {
      const meetingContainer = document.querySelector(ZOOM_CONFIG.MEETING_CONTAINER_ID) as HTMLElement
      meetingContainer?.remove()
    }

    /**
     * Khi phát hiện can thiệp: vừa dừng cuộc họp (gỡ container vì lý do bảo mật)
     * vừa báo lên UI để hiện trang cảnh báo toàn màn hình — KHÔNG để màn hình trắng.
     */
    const handleTamper = () => {
      if (tampered) return
      tampered = true
      removeMeetingContainer()
      onTamperRef.current?.()
    }

    const isWatermarkHidden = (node: HTMLElement): boolean => {
      // Bị gỡ khỏi DOM
      if (!document.body.contains(node)) return true

      if (node.hidden) return true

      if (node.getClientRects().length === 0) return true

      const style = window.getComputedStyle(node)
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') {
        return true
      }
      if (parseFloat(style.opacity || '1') < 0.3) return true

      const rect = node.getBoundingClientRect()
      if (rect.width < 8 || rect.height < 8) return true

      if (!node.textContent || node.textContent.trim().length === 0) return true

      return false
    }

    const changePosition = () => {
      const container = document.querySelector(
        `${ZOOM_CONFIG.MEETING_CONTAINER_ID} ${ZOOM_CONFIG.MEETING_VIDEO_SHARE_LAYOUT}`
      )

      if (!container || !floatingRef?.current) {
        return
      }

      // Generate random position in percentage (10% - 90%)
      const minPercent = 10
      const maxPercent = 90
      const newTopPercent = Math.round(minPercent + Math.random() * (maxPercent - minPercent))
      const newLeftPercent = Math.round(minPercent + Math.random() * (maxPercent - minPercent))

      setPosition({
        top: newTopPercent,
        left: newLeftPercent,
      })
    }

    // Gom nhiều mutation liên tiếp (extension có thể bắn rất nhiều) thành 1 lần
    // kiểm tra để tránh tốn hiệu năng và tránh đánh giá ở trạng thái tạm thời.
    let checkTimer: ReturnType<typeof setTimeout> | null = null
    const scheduleTamperCheck = () => {
      if (checkTimer) return
      checkTimer = setTimeout(() => {
        checkTimer = null
        const node = floatingRef.current
        if (node && isWatermarkHidden(node)) {
          handleTamper()
        }
      }, 100)
    }

    const createElementObserver = () => {
      let observer: MutationObserver | null = null
      if (floatingRef.current) {
        observer = new MutationObserver(_ => {
          if (!document.body.contains(floatingRef.current as Node)) {
            handleTamper()
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

    const createFloatingRefObserver = () => {
      let observer: MutationObserver | null = null
      const node = floatingRef.current
      if (node) {
        observer = new MutationObserver(() => {
          scheduleTamperCheck()
        })

        observer.observe(node, {
          attributes: true,
          attributeFilter: ['style', 'class', 'hidden'],
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
      return observer
    }

    const observer = createElementObserver()
    const floatingObserver = createFloatingRefObserver()
    changePosition()
    const intervalId = setInterval(changePosition, FLOATING_USER_POSITION_INTERVAL)

    return () => {
      clearInterval(intervalId)
      if (checkTimer) {
        clearTimeout(checkTimer)
      }
      if (observer) {
        observer.disconnect()
      }
      if (floatingObserver) {
        floatingObserver.disconnect()
      }
    }
  }, [floatingRef])

  return { position }
}
