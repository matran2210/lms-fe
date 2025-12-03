import { FLOATING_USER_POSITION_INTERVAL } from '@/constants'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { RefObject, useEffect, useRef, useState } from 'react'

interface UseFloatingUserProps {
  floatingRef: RefObject<HTMLDivElement | null>
}

export const useFloatingUser = ({ floatingRef }: UseFloatingUserProps) => {
  const [position, setPosition] = useState({ top: -999, left: -999 })
  const allowedTopLeftRef = useRef<{ top: string; left: string } | null>(null)

  useEffect(() => {
    const removeMeetingContainer = () => {
      const meetingContainer = document.querySelector(ZOOM_CONFIG.MEETING_CONTAINER_ID) as HTMLElement
      meetingContainer?.remove()
    }

    const parseStyleStringToMap = (styleString: string) => {
      const styleMap: Record<string, string> = {}
      styleString
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .forEach(pair => {
          const [rawProp, rawVal] = pair.split(':')
          if (!rawProp || !rawVal) return
          const prop = rawProp.trim().toLowerCase()
          const val = rawVal.trim()
          styleMap[prop] = val
        })
      return styleMap
    }

    const isOnlyTopLeftChanged = (oldStyle: string, newStyle: string) => {
      const oldMap = parseStyleStringToMap(oldStyle || '')
      const newMap = parseStyleStringToMap(newStyle || '')

      // Only ignore top/left when the new style matches the last code-driven position
      const allowed = allowedTopLeftRef.current
      const newTop = newMap['top']
      const newLeft = newMap['left']
      const matchesAllowed = Boolean(allowed && newTop === allowed.top && newLeft === allowed.left)
      if (!matchesAllowed) return false

      // Remove position keys we allow to change for deep equality check
      delete oldMap['top']
      delete oldMap['left']
      delete newMap['top']
      delete newMap['left']

      const oldKeys = Object.keys(oldMap)
      const newKeys = Object.keys(newMap)
      if (oldKeys.length !== newKeys.length) return false
      for (const key of oldKeys) {
        if (!(key in newMap)) return false
        if (oldMap[key] !== newMap[key]) return false
      }
      return true
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

      allowedTopLeftRef.current = {
        top: `${newTopPercent}%`,
        left: `${newLeftPercent}%`,
      }

      setPosition({
        top: newTopPercent,
        left: newLeftPercent,
      })
    }

    const createElementObserver = () => {
      let observer: MutationObserver | null = null
      if (floatingRef.current) {
        observer = new MutationObserver(_ => {
          if (!document.body.contains(floatingRef.current as Node)) {
            removeMeetingContainer()
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
        observer = new MutationObserver(mutationList => {
          for (const mutation of mutationList) {
            if (mutation.type === 'attributes') {
              const attributeName = mutation.attributeName
              if (attributeName === 'style') {
                const oldValue = (mutation as MutationRecord & { oldValue?: string }).oldValue || ''
                const newValue = (mutation.target as HTMLElement).getAttribute('style') || ''
                if (isOnlyTopLeftChanged(oldValue, newValue)) {
                  continue
                }
              }
              removeMeetingContainer()
              break
            } else {
              removeMeetingContainer()
              break
            }
          }
        })

        observer.observe(node, {
          attributes: true,
          attributeOldValue: true,
          childList: true,
          subtree: true,
          characterData: true,
          characterDataOldValue: true,
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
