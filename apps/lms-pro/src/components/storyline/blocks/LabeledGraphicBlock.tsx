'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { AbstractCircleIcon, AltArrowLeftIcon, AltArrowRightIcon, ArrowDownCircleIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowUpCircleIcon, BurgerMenuCircleIcon, ChartPieCircleIcon, CheckCircleIcon, ChevronDownCircleIcon, ChevronLeftCircleIcon, ChevronRightCircleIcon, ChevronUpCircleIcon, CloseModalIcon, CrossCircleIcon, InfomationCircleIcon, MinusCircleIcon, PlusCircleIcon, QuestionCircleIcon, StarMarkerIcon, Triangle } from '@lms/assets'
import { IBackgroundResource, ILabeledGraphicMarker } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { EditorReader } from '@lms/ui'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  markers: ILabeledGraphicMarker[]
  backgroundResource: IBackgroundResource
  documentTitle?: string
  document_id: string
  docIndex: number
}

type PopupPosition = {
  top?: number
  left?: number
  right?: number
  bottom?: number
  transformOrigin?: string
}

type PopupSize = {
  width: number
  height: number
}

const DEFAULT_POPUP_SIZE: PopupSize = {
  width: 287,
  height: 280,
}

const DESKTOP_POPUP_GAP = 12
const DESKTOP_POPUP_MIN_WIDTH = 240
const DESKTOP_POPUP_MIN_HEIGHT = 220
const DESKTOP_POPUP_MAX_WIDTH = 600
const DESKTOP_POPUP_MAX_HEIGHT = 400
const MARKER_PULSE_START_SIZE = 40
const MARKER_PULSE_END_SIZE = 56

const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

export default function LabeledGraphicBlock({ markers, backgroundResource, documentTitle, document_id, docIndex }: Props) {
  const {
    visibleDocumentCount,
    storylineDocument,
  } = useStoryline()
  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount]
  const { isMobileView } = useTailwindBreakpoint()
  const isLearnedBlock = docIndex < visibleDocumentCount
  const [viewedMarkers, setViewedMarkers] = useState<Set<string>>(new Set())
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)
  const [mounted, setMounted] = useState(false)
  const [popupSize, setPopupSize] = useState<PopupSize>(DEFAULT_POPUP_SIZE)
  const [isDesktopResizing, setIsDesktopResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const resizeStateRef = useRef<{
    startX: number
    startY: number
    startWidth: number
    startHeight: number
    startLeft: number
    startTop: number
    transformOrigin?: string
  } | null>(null)

  const activeMarker = markers.find((m) => m.id === activeMarkerId)
  const activeMarkerIndex = activeMarker
    ? markers.findIndex((m) => m.id === activeMarkerId)
    : -1
  const isAllMarkersViewed = viewedMarkers.size === markers.length
  const isShowContinueButton = isAllMarkersViewed && !isLearnedBlock &&
    visibleDocumentCount < (storylineDocument?.length ?? 0) &&
    !!currentVisibleDocument

  const calculatePopupPosition = (
    marker: ILabeledGraphicMarker,
    size: PopupSize = popupSize,
  ): PopupPosition => {
    if (!containerRef.current) {
      return { left: 0, top: 0, transformOrigin: 'top left' }
    }
    if (isMobileView) {
      return {
        bottom: 0,
        left: 0,
        right: 0,
        transformOrigin: 'bottom center',
      }
    }

    const containerRect = containerRef.current.getBoundingClientRect()
    const MARKER_SIZE = 24
    const GAP = DESKTOP_POPUP_GAP

    const markerX = (marker.x_percent / 100) * containerRect.width
    const markerY = (marker.y_percent / 100) * containerRect.height

    const spaceRight = containerRect.width - (markerX + MARKER_SIZE / 2)
    const spaceLeft = markerX - MARKER_SIZE / 2
    const spaceBottom = containerRect.height - (markerY + MARKER_SIZE / 2)

    const centeredLeft = markerX - size.width / 2
    const maxLeft = Math.max(GAP, containerRect.width - size.width - GAP)
    const clampedLeft = Math.max(GAP, Math.min(centeredLeft, maxLeft))

    if (spaceRight >= size.width + GAP) {
      return {
        left: markerX + MARKER_SIZE / 2 + GAP,
        top: markerY - MARKER_SIZE / 2,
        transformOrigin: 'top left',
      }
    }

    if (spaceLeft >= size.width + GAP) {
      return {
        left: markerX - MARKER_SIZE / 2 - GAP - size.width,
        top: markerY - MARKER_SIZE / 2,
        transformOrigin: 'top right',
      }
    }

    if (spaceBottom >= size.height + GAP) {
      return {
        left: clampedLeft,
        top: markerY + MARKER_SIZE / 2 + GAP,
        transformOrigin: 'top center',
      }
    }

    return {
      left: clampedLeft,
      top: Math.max(GAP, markerY - MARKER_SIZE / 2 - GAP - size.height),
      transformOrigin: 'bottom center',
    }
  }

  const scrollToMarker = (markerId: string) => {
    const markerElement = markerRefs.current[markerId]
    if (!markerElement) return

    markerElement.scrollIntoView({
      behavior: 'smooth',
      block: isMobileView ? 'center' : 'center',
      inline: 'nearest',
    })
  }

  const handleMarkerClick = (marker: ILabeledGraphicMarker) => {
    const markerId = marker.id
    if (!marker) return

    if (activeMarkerId === markerId) {
      setActiveMarkerId(null)
      setPopupPosition(null)
      return
    }

    setActiveMarkerId(markerId)
    setViewedMarkers((prev) => new Set([...prev, markerId]))
    setPopupSize(DEFAULT_POPUP_SIZE)

    setTimeout(() => {
      const position = calculatePopupPosition(marker, DEFAULT_POPUP_SIZE)
      setPopupPosition(position)
    }, 0)
  }

  const handlePrevious = () => {
    if (activeMarkerIndex > 0) {
      const prevMarker = markers[activeMarkerIndex - 1]
      setActiveMarkerId(prevMarker.id)
      setViewedMarkers((prev) => new Set([...prev, prevMarker.id]))
      setPopupSize(DEFAULT_POPUP_SIZE)

      const position = calculatePopupPosition(prevMarker, DEFAULT_POPUP_SIZE)
      setPopupPosition(position)
    }
  }

  const handleNext = () => {
    if (activeMarkerIndex < markers.length - 1) {
      const nextMarker = markers[activeMarkerIndex + 1]
      setActiveMarkerId(nextMarker.id)
      setViewedMarkers((prev) => new Set([...prev, nextMarker.id]))
      setPopupSize(DEFAULT_POPUP_SIZE)

      const position = calculatePopupPosition(nextMarker, DEFAULT_POPUP_SIZE)
      setPopupPosition(position)
    }
  }

  const handleClosePopup = () => {
    setActiveMarkerId(null)
    setPopupPosition(null)
  }

  const handleResizeMouseDown = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (isMobileView || !popupPosition) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: popupSize.width,
      startHeight: popupSize.height,
      startLeft: popupPosition.left ?? DESKTOP_POPUP_GAP,
      startTop: popupPosition.top ?? DESKTOP_POPUP_GAP,
      transformOrigin: popupPosition.transformOrigin,
    }
    setIsDesktopResizing(true)
  }

  const getMarkerText = (style?: string) => {
    switch (style) {
      case "PLUS":
        return <PlusCircleIcon className="w-8 h-8" />
      case "MINUS":
        return <MinusCircleIcon className="w-8 h-8" />
      case "CROSS":
        return <CrossCircleIcon className="w-8 h-8" />
      case "CHECK":
        return <CheckCircleIcon className="w-8 h-8" />
      case "ABSTRACT":
        return <AbstractCircleIcon className="w-8 h-8" />
      case "BURGER_MENU":
        return <BurgerMenuCircleIcon className="w-8 h-8" />
      case "CHART_PIE":
        return <ChartPieCircleIcon className="w-8 h-8" />
      case "INFOMATION":
        return <InfomationCircleIcon className="w-8 h-8" />
      case "QUESTION":
        return <QuestionCircleIcon className="w-8 h-8" />
      case "ARROW_LEFT":
        return <ArrowLeftCircleIcon className="w-8 h-8" />
      case "ARROW_RIGHT":
        return <ArrowRightCircleIcon className="w-8 h-8" />
      case "ARROW_UP":
        return <ArrowUpCircleIcon className="w-8 h-8" />
      case "ARROW_DOWN":
        return <ArrowDownCircleIcon className="w-8 h-8" />
      case "CHEVRON_LEFT":
        return <ChevronLeftCircleIcon className="w-8 h-8" />
      case "CHEVRON_RIGHT":
        return <ChevronRightCircleIcon className="w-8 h-8" />
      case "CHEVRON_UP":
        return <ChevronUpCircleIcon className="w-8 h-8" />
      case "CHEVRON_DOWN":
        return <ChevronDownCircleIcon className="w-8 h-8" />
      default:
        return <PlusCircleIcon className="w-8 h-8" />
    }
  }

  const getMarkerIcon = (
    style?: string,
    isViewed?: boolean,
    isActive?: boolean,
  ) => {
    const baseClasses = `flex items-center justify-center transition-all duration-300 z-10 rounded-full backdrop-blur-sm`
    const sizeClasses = 'w-10 h-10'

    if (isViewed || isActive) {
      return (
        <div
          className={`${baseClasses} ${sizeClasses} bg-white`}
          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' }}
        >
          <StarMarkerIcon className='w-8 h-8' />
        </div>
      )
    }

    return (
      <div className={`${baseClasses} ${sizeClasses} text-gray-800 bg-white/70  hover:bg-white`}>
        {getMarkerText(style)}
      </div>
    )
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLearnedBlock) {
      const allMarkerIds = markers.map(m => m.id)
      setViewedMarkers(new Set(allMarkerIds))
    } else {
      setViewedMarkers(new Set())
    }
  }, [isLearnedBlock, markers])

  useEffect(() => {
    if (!activeMarkerId || !imageLoaded) return

    requestAnimationFrame(() => {
      scrollToMarker(activeMarkerId)
    })
  }, [activeMarkerId, imageLoaded])

  useEffect(() => {
    if (!activeMarker || !mounted || isMobileView) return

    const position = calculatePopupPosition(activeMarker)
    setPopupPosition((prev) => {
      if (
        prev?.top === position.top &&
        prev?.left === position.left &&
        prev?.right === position.right &&
        prev?.bottom === position.bottom &&
        prev?.transformOrigin === position.transformOrigin
      ) {
        return prev
      }

      return position
    })
  }, [activeMarker, mounted])

  useEffect(() => {
    if (!activeMarker) {
      setPopupSize(DEFAULT_POPUP_SIZE)
      setIsDesktopResizing(false)
      resizeStateRef.current = null
      return
    }
  }, [activeMarker])

  useEffect(() => {
    if (!isDesktopResizing) return

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !resizeStateRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const {
        startX,
        startY,
        startWidth,
        startHeight,
        startLeft,
        startTop,
        transformOrigin,
      } = resizeStateRef.current

      const nextWidth = clampValue(
        startWidth + (event.clientX - startX),
        DESKTOP_POPUP_MIN_WIDTH,
        Math.max(
          DESKTOP_POPUP_MIN_WIDTH,
          Math.min(
            DESKTOP_POPUP_MAX_WIDTH,
            containerRect.width - DESKTOP_POPUP_GAP * 2,
          ),
        ),
      )
      const nextHeight = clampValue(
        startHeight + (event.clientY - startY),
        DESKTOP_POPUP_MIN_HEIGHT,
        Math.max(
          DESKTOP_POPUP_MIN_HEIGHT,
          Math.min(
            DESKTOP_POPUP_MAX_HEIGHT,
            containerRect.height - DESKTOP_POPUP_GAP * 2,
          ),
        ),
      )
      const nextLeft = clampValue(
        startLeft,
        DESKTOP_POPUP_GAP,
        Math.max(DESKTOP_POPUP_GAP, containerRect.width - nextWidth - DESKTOP_POPUP_GAP),
      )
      const nextTop = clampValue(
        startTop,
        DESKTOP_POPUP_GAP,
        Math.max(DESKTOP_POPUP_GAP, containerRect.height - nextHeight - DESKTOP_POPUP_GAP),
      )

      setPopupSize((prev) => (
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight }
      ))
      setPopupPosition((prev) => ({
        ...prev,
        left: nextLeft,
        top: nextTop,
        right: undefined,
        bottom: undefined,
        transformOrigin: transformOrigin ?? prev?.transformOrigin ?? 'top left',
      }))
    }

    const handleMouseUp = () => {
      setIsDesktopResizing(false)
      resizeStateRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'nwse-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDesktopResizing])

  return (
    <div className="w-full">
      {documentTitle && (
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          {documentTitle}
        </h3>
      )}

      <div
        ref={containerRef}
        className={clsx("relative w-full overflow-visible rounded-2xl", {
          "mb-12": isShowContinueButton
        })}
      >
        <img
          src={backgroundResource.url}
          alt={'Labeled Graphic'}
          className="h-auto w-full rounded-2xl"
          onLoad={() => setImageLoaded(true)}
        />

        {imageLoaded &&
          markers.map((marker) => {
            const isViewed = viewedMarkers.has(marker.id)
            const isActive = activeMarkerId === marker.id
            const shouldPulse = !isViewed && !isActive

            return (
              <div
                key={marker.id}
                className="absolute"
                ref={(element) => {
                  markerRefs.current[marker.id] = element
                }}
                style={{
                  left: `${marker.x_percent}%`,
                  top: `${marker.y_percent}%`,
                }}
              >
                <div className="relative flex items-center justify-center" style={{ width: 0, height: 0 }}>
                  {shouldPulse && (
                    <>
                      <motion.div
                        className="absolute rounded-full bg-white/60"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                        animate={{
                          width: [MARKER_PULSE_START_SIZE, MARKER_PULSE_END_SIZE, MARKER_PULSE_END_SIZE],
                          height: [MARKER_PULSE_START_SIZE, MARKER_PULSE_END_SIZE, MARKER_PULSE_END_SIZE],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                          times: [0, 0.5, 1],
                        }}
                      />
                      <motion.div
                        className="absolute rounded-full bg-white/50"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                        animate={{
                          width: [MARKER_PULSE_START_SIZE, MARKER_PULSE_END_SIZE, MARKER_PULSE_END_SIZE],
                          height: [MARKER_PULSE_START_SIZE, MARKER_PULSE_END_SIZE, MARKER_PULSE_END_SIZE],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                          delay: 0.4,
                          times: [0, 0.5, 1],
                        }}
                      />
                      <motion.div
                        className="absolute rounded-full bg-white/40"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                        animate={{
                          width: [MARKER_PULSE_START_SIZE, MARKER_PULSE_END_SIZE, MARKER_PULSE_END_SIZE],
                          height: [MARKER_PULSE_START_SIZE, MARKER_PULSE_END_SIZE, MARKER_PULSE_END_SIZE],
                          opacity: [0, 0.4, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeOut',
                          delay: 0.8,
                          times: [0, 0.5, 1],
                        }}
                      />
                    </>
                  )}

                  <motion.div
                    className="cursor-pointer shadow-large rounded-full"
                    onClick={() => handleMarkerClick(marker)}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getMarkerIcon(marker.style, isViewed, isActive)}
                  </motion.div>
                </div>
              </div>
            )
          })}
      </div>

      {mounted && isMobileView && (
        <>
          {createPortal(
            <AnimatePresence mode="wait">
              {activeMarker && popupPosition && (
                <motion.div
                  key={`popup-mobile-${document_id}`}
                  variants={{
                    open: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
                    close: { opacity: 0, y: 100, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
                  }}
                  initial="close"
                  animate="open"
                  exit="close"
                  className="fixed bottom-0 left-0 right-0 z-[9999] flex w-full flex-col gap-3 rounded-t-2xl bg-white p-4"
                  style={{
                    maxHeight: '400px',
                    boxShadow: '0 -5px 24px 0 rgba(0, 0, 0, 0.16)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-base font-semibold text-gray-800">
                      {activeMarker?.title}
                    </p>
                    <div
                      onClick={handleClosePopup}
                      className="cursor-pointer text-gray-800"
                    >
                      <CloseModalIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <EditorReader
                      className="text-sm font-normal text-gray-800 [&_img]:h-auto [&_img]:max-w-full [&_img]:w-full"
                      text_editor_content={activeMarker?.content || ''}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handlePrevious}
                      disabled={activeMarkerIndex === 0}
                      className={`flex h-5 w-5 items-center justify-center transition-colors ${activeMarkerIndex === 0
                          ? 'cursor-not-allowed text-gray-300'
                          : 'text-gray-800'
                        }`}
                    >
                      <AltArrowLeftIcon className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {markers.map((marker) => {
                        const isViewed = viewedMarkers.has(marker.id)
                        const isActive = activeMarkerId === marker.id

                        return (
                          <div
                            key={marker.id}
                            className={clsx(`h-2 w-2 rounded-full transition-all`, {
                              'bg-primary': isActive,
                              'bg-gray-300': !isActive && !isViewed,
                              'bg-success': isViewed && !isActive,
                            })}
                          />
                        )
                      })}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={activeMarkerIndex === markers.length - 1}
                      className={`flex h-5 w-5 items-center justify-center transition-colors ${activeMarkerIndex === markers.length - 1
                          ? 'cursor-not-allowed text-gray-300'
                          : 'text-gray-800'
                        }`}
                    >
                      <AltArrowRightIcon className='w-5 h-5' />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </>
      )}

      {(!isMobileView) && (
        <AnimatePresence mode="wait">
          {activeMarker && popupPosition && (
            <motion.div
              key="popup-desktop"
              variants={{
                open: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
                close: { opacity: 0, scale: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
              }}
              initial="close"
              animate="open"
              exit="close"
              className="absolute z-[250] flex min-h-[220px] min-w-[240px] flex-col gap-3 overflow-hidden rounded-xl bg-white p-3"
              style={{
                top: popupPosition?.top,
                left: popupPosition?.left,
                right: popupPosition?.right,
                bottom: popupPosition?.bottom,
                width: popupSize.width,
                height: popupSize.height,
                maxHeight: 'min(400px, calc(100% - 24px))',
                maxWidth: 'min(600px, calc(100% - 24px))',
                transformOrigin: popupPosition?.transformOrigin ?? 'top left',
                boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.12)',
              }}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {activeMarker?.title}
                </p>
                <div
                  onClick={handleClosePopup}
                  className="cursor-pointer text-gray-800"
                >
                  <CloseModalIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <EditorReader
                  className="text-sm font-normal text-gray-800 [&_img]:h-auto [&_img]:max-w-full [&_img]:w-full"
                  text_editor_content={activeMarker?.content || ''}
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={activeMarkerIndex === 0}
                  className={`flex h-4 w-4 items-center justify-center transition-colors ${activeMarkerIndex === 0
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-800'
                    }`}
                >
                  <AltArrowLeftIcon />
                </button>

                <div className="flex items-center gap-1">
                  {markers.map((marker) => {
                    const isViewed = viewedMarkers.has(marker.id)
                    const isActive = activeMarkerId === marker.id

                    return (
                      <div
                        key={marker.id}
                        className={clsx(`h-2 w-2 rounded-full transition-all`, {
                          'bg-primary': isActive,
                          'bg-gray-300': !isActive && !isViewed,
                          'bg-success': isViewed && !isActive,
                        })}
                      />
                    )
                  })}
                </div>

                <button
                  onClick={handleNext}
                  disabled={activeMarkerIndex === markers.length - 1}
                  className={`flex h-4 w-4 items-center justify-center transition-colors ${activeMarkerIndex === markers.length - 1
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-800'
                    }`}
                >
                  <AltArrowRightIcon />
                </button>
              </div>
              <Triangle
                className={clsx("absolute bottom-2 right-2 text-gray-300", {
                  "cursor-nwse-resize": !isDesktopResizing,
                })}
                onMouseDown={handleResizeMouseDown}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
