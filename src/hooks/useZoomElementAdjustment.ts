'use client'

import { HEADER_HEIGHT, SHOW_FULL_SCREEN_CLASS } from '@/constants'
import { ZOOM_ARIA_LABELS, ZOOM_CONFIG } from '@/constants/zoom'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { useCallback, useEffect, useRef } from 'react'

export const useZoomElementAdjustment = (isJoined: boolean) => {
  const { isShowHeader, setIsShowHeader } = useLayoutContext()
  const observerRef = useRef<(MutationObserver | ResizeObserver)[]>([])
  const observedElementsRef = useRef<Set<HTMLElement>>(new Set())

  const toggleFullScreen = useCallback((isFullScreen: boolean) => {
    const meetingContainer = document.querySelector(ZOOM_CONFIG.MEETING_CONTAINER_ID) as HTMLElement
    if (meetingContainer) {
      meetingContainer.classList.toggle(SHOW_FULL_SCREEN_CLASS, isFullScreen)
    }
  }, [])

  const handleAriaChange = useCallback(
    (target: HTMLElement | null) => {
      if (!target) return
      const currentAriaLabel = target.getAttribute('aria-label') as string
      if (ZOOM_ARIA_LABELS.includes(currentAriaLabel)) {
        setIsShowHeader(false)
        toggleFullScreen(true)
        return
      }

      setIsShowHeader(true)
      toggleFullScreen(false)
    },
    [setIsShowHeader, toggleFullScreen]
  )

  const createObserverForTarget = useCallback(
    (target: HTMLElement | null) => {
      if (!target) {
        return null
      }

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
            handleAriaChange(target)
          }
        })
      })

      handleAriaChange(target)

      observer.observe(target, {
        attributes: true,
        attributeFilter: ['aria-label'],
      })

      observerRef.current.push(observer)

      return observer
    },
    [handleAriaChange]
  )

  const setupObserverForWidget = useCallback(() => {
    const widget = document.querySelector(ZOOM_CONFIG.MEETING_FULL_SCREEN_WIDGET) as HTMLElement | null
    return createObserverForTarget(widget)
  }, [createObserverForTarget])

  const setupObserverForPopMenu = useCallback(() => {
    const icon = document.querySelector(ZOOM_CONFIG.MEETING_FULL_SCREEN_DROPDOWN) as HTMLElement | null
    if (!icon) return

    const handleClick = () => {
      setTimeout(() => {
        const popMenuItem = document.querySelector(ZOOM_CONFIG.MEETING_FULL_SCREEN_DROPDOWN_POP_MENU) as HTMLElement
        if (!popMenuItem) return

        createObserverForTarget(popMenuItem)
      }, 0)
    }

    icon.addEventListener('click', handleClick)
  }, [createObserverForTarget])

  const setupFullScreenObserver = useCallback(() => {
    setupObserverForWidget()
    setupObserverForPopMenu()
  }, [setupObserverForPopMenu, setupObserverForWidget])

  const updateMaxHeight = useCallback((targetElement: HTMLElement) => {
    const cssHeight = targetElement.style.height

    const heightValue = parseFloat(cssHeight)
    if (!isNaN(heightValue) && heightValue > 0) {
      targetElement.style.maxHeight = `${heightValue - HEADER_HEIGHT}px`
    }
  }, [])

  const removeMaxHeight = useCallback((targetElement: HTMLElement) => {
    targetElement.style.maxHeight = ''
  }, [])

  /**
   * Lắng nghe thay đổi CSS height của element và tự động cập nhật maxHeight
   */
  const observeElementHeightChange = useCallback(
    (element: HTMLElement) => {
      if (!element) return

      // Tránh observe cùng một element nhiều lần
      if (observedElementsRef.current.has(element)) {
        return
      }

      observedElementsRef.current.add(element)

      if (isShowHeader) {
        updateMaxHeight(element)
      } else {
        removeMaxHeight(element)
      }

      const resizeObserver = new ResizeObserver(() => {
        if (isShowHeader) {
          updateMaxHeight(element)
        } else {
          removeMaxHeight(element)
        }
      })
      resizeObserver.observe(element)
      observerRef.current.push(resizeObserver)
    },
    [isShowHeader, updateMaxHeight, removeMaxHeight]
  )

  /**
   * Lắng nghe khi một element (selector) xuất hiện trong DOM
   * rồi mới xử lý tiếp (callback onAvailable)
   * Nếu có nhiều hơn 1 phần tử thì bỏ qua
   */
  const observeElementWhenAvailable = useCallback((selector: string, onAvailable: (el: HTMLElement) => void) => {
    const existingElements = document.querySelectorAll(selector)

    if (existingElements.length === 1) {
      onAvailable(existingElements[0] as HTMLElement)
      return
    }

    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(selector)

      if (elements.length === 1) {
        onAvailable(elements[0] as HTMLElement)
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    observerRef.current.push(observer)
  }, [])

  useEffect(() => {
    if (!isJoined) return

    setupFullScreenObserver()

    // Start Video Share Layout
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_VIDEO_SHARE_LAYOUT, element => {
      observeElementHeightChange(element)

      const setupChildObservers = () => {
        const pane1Element = element.querySelector(ZOOM_CONFIG.MEETING_VIDEO_SHARE_LAYOUT_PANE_1) as HTMLElement

        if (pane1Element && !observedElementsRef.current.has(pane1Element)) {
          observedElementsRef.current.add(pane1Element)

          const resizeObserver = new ResizeObserver(() => {
            const isStandardLayout = element.classList.contains(ZOOM_CONFIG.MEETING_VIDEO_SHARE_LAYOUT_STANDARD)
            if (isStandardLayout && isShowHeader) {
              updateMaxHeight(pane1Element)
            } else {
              removeMaxHeight(pane1Element)
            }
          })
          resizeObserver.observe(pane1Element)
          observerRef.current.push(resizeObserver)
        }

        const sharerContainerElement = element.querySelector(
          ZOOM_CONFIG.MEETING_VIDEO_SHARE_LAYOUT_SHARER_CONTAINER
        ) as HTMLElement
        sharerContainerElement && observeElementHeightChange(sharerContainerElement)
      }

      setupChildObservers()

      const classObserver = new MutationObserver(() => {
        setupChildObservers()
      })
      classObserver.observe(element, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true,
      })
      observerRef.current.push(classObserver)
    })
    // Start Speaker Active Container
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_SPEAKER_ACTIVE_CONTAINER, element => {
      const parentElement = element.parentElement
      parentElement && observeElementHeightChange(parentElement)
    })
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_SPEAKER_ACTIVE_CONTAINER_VIDEO_FRAME, element => {
      observeElementHeightChange(element)
    })
    // Start Gallery Video Container
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_GALLERY_VIDEO_CONTAINER, element => {
      const closedChildElement = element.children?.[0] as HTMLElement
      closedChildElement && observeElementHeightChange(closedChildElement)
    })
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_GALLERY_VIDEO_CONTAINER_VIDEO_FRAME, element => {
      observeElementHeightChange(element)
    })
    // Start Multi Speaker Container
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_MULTI_SPEAKER_CONTAINER, element => {
      observeElementHeightChange(element)
    })
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_MULTI_SPEAKER_CONTAINER_MAIN_VIEW, element => {
      const closedChildElement = element.children?.[0] as HTMLElement
      closedChildElement && observeElementHeightChange(closedChildElement)
    })
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_MULTI_SPEAKER_CONTAINER_VIDEO_FRAME, element => {
      observeElementHeightChange(element)
    })
    observeElementWhenAvailable(ZOOM_CONFIG.MEETING_MULTI_SPEAKER_ACTIVE_CONTAINER_MAIN_VIEW, element => {
      const closedChildElement = element.children?.[0] as HTMLElement
      closedChildElement && observeElementHeightChange(closedChildElement)
    })

    return () => {
      observerRef.current.forEach(observer => observer.disconnect())
      observerRef.current = []
      observedElementsRef.current.clear()
    }
  }, [
    isJoined,
    observeElementWhenAvailable,
    observeElementHeightChange,
    setupFullScreenObserver,
    updateMaxHeight,
    removeMaxHeight,
    isShowHeader,
  ])
}
