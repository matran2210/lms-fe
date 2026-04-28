'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloseIcon, CloseIconNote } from '@lms/assets'

export interface ILabeledGraphicBackground {
  resource_id: string
  url?: string
  alt?: string
}

export interface ILabeledGraphicMarker {
  id: string
  x_percent: number
  y_percent: number
  title: string
  content: string
  style?:
    | 'PLUS'
    | 'INFO'
    | 'QUESTION'
    | 'CHECK'
    | 'EXCLAMATION'
    | 'ARROW_RIGHT'
    | 'ARROW_UP'
    | 'DOT'
    | 'ONE'
    | 'TWO'
}

export interface ILabeledGraphicPayload {
  background: ILabeledGraphicBackground
  markers: ILabeledGraphicMarker[]
}

interface Props {
  payload: ILabeledGraphicPayload
  documentTitle?: string
}

type PopupPosition = {
  top?: number
  left?: number
  right?: number
  bottom?: number
  transformOrigin?: string
}

export default function LabeledGraphicBlock({ payload, documentTitle }: Props) {
  const [viewedMarkers, setViewedMarkers] = useState<Set<string>>(new Set())
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { background, markers } = payload
  const activeMarker = markers.find((m) => m.id === activeMarkerId)
  const activeMarkerIndex = activeMarker
    ? markers.findIndex((m) => m.id === activeMarkerId)
    : -1

  const calculatePopupPosition = (
    marker: ILabeledGraphicMarker,
  ): PopupPosition => {
    if (!containerRef.current) {
      return { left: 0, top: 0, transformOrigin: 'top left' }
    }

    const containerRect = containerRef.current.getBoundingClientRect()
    const POPUP_WIDTH = 287
    const POPUP_HEIGHT = 280 // chiều cao ước tính
    const MARKER_SIZE = 24
    const GAP = 12 // khoảng cách giữa marker và popup

    const markerX = (marker.x_percent / 100) * containerRect.width
    const markerY = (marker.y_percent / 100) * containerRect.height

    const spaceRight = containerRect.width - (markerX + MARKER_SIZE / 2)
    const spaceLeft = markerX - MARKER_SIZE / 2
    const spaceBottom = containerRect.height - (markerY + MARKER_SIZE / 2)
    const spaceTop = markerY - MARKER_SIZE / 2

    // Popup top căn giữa theo marker, clamp trong container
    const centeredTop = markerY - POPUP_HEIGHT / 2
    const clampedTop = Math.max(GAP, Math.min(centeredTop, containerRect.height - POPUP_HEIGHT - GAP))

    // Popup left căn giữa theo marker, clamp trong container
    const centeredLeft = markerX - POPUP_WIDTH / 2
    const clampedLeft = Math.max(GAP, Math.min(centeredLeft, containerRect.width - POPUP_WIDTH - GAP))

    // Ưu tiên: phải → trái → dưới → trên
    if (spaceRight >= POPUP_WIDTH + GAP) {
      return {
        left: markerX + MARKER_SIZE / 2 + GAP,
        top: markerY - MARKER_SIZE / 2,
        transformOrigin: 'top left',
      }
    }

    if (spaceLeft >= POPUP_WIDTH + GAP) {
      return {
        left: markerX - MARKER_SIZE / 2 - GAP - POPUP_WIDTH,
        top: markerY - MARKER_SIZE / 2,
        transformOrigin: 'top right',
      }
    }

    if (spaceBottom >= POPUP_HEIGHT + GAP) {
      return {
        left: clampedLeft,
        top: markerY + MARKER_SIZE / 2 + GAP,
        transformOrigin: 'top center',
      }
    }

    return {
      left: clampedLeft,
      top: Math.max(GAP, markerY - MARKER_SIZE / 2 - GAP - POPUP_HEIGHT),
      transformOrigin: 'bottom center',
    }
  }

  const handleMarkerClick = (markerId: string) => {
    const marker = markers.find((m) => m.id === markerId)
    if (!marker) return

    if (activeMarkerId === markerId) {
      // Close if clicking the same marker
      setActiveMarkerId(null)
      setPopupPosition(null)
      return
    }

    setActiveMarkerId(markerId)
    setViewedMarkers((prev) => new Set([...prev, markerId]))

    // Calculate position after state update
    setTimeout(() => {
      const position = calculatePopupPosition(marker)
      setPopupPosition(position)
    }, 0)
  }

  const handlePrevious = () => {
    if (activeMarkerIndex > 0) {
      const prevMarker = markers[activeMarkerIndex - 1]
      setActiveMarkerId(prevMarker.id)
      setViewedMarkers((prev) => new Set([...prev, prevMarker.id]))

      const position = calculatePopupPosition(prevMarker)
      setPopupPosition(position)
    }
  }

  const handleNext = () => {
    if (activeMarkerIndex < markers.length - 1) {
      const nextMarker = markers[activeMarkerIndex + 1]
      setActiveMarkerId(nextMarker.id)
      setViewedMarkers((prev) => new Set([...prev, nextMarker.id]))

      const position = calculatePopupPosition(nextMarker)
      setPopupPosition(position)
    }
  }

  const handleClosePopup = () => {
    setActiveMarkerId(null)
    setPopupPosition(null)
  }

  const StarMarkerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.10471 3.60558C6.94915 2.09075 7.37136 1.33333 8.0026 1.33333C8.63385 1.33333 9.05606 2.09074 9.90049 3.60558L10.119 3.99748C10.3589 4.42795 10.4789 4.64319 10.666 4.7852C10.853 4.92721 11.086 4.97993 11.552 5.08536L11.9762 5.18135C13.616 5.55236 14.4359 5.73787 14.631 6.36515C14.8261 6.99242 14.2671 7.64604 13.1492 8.95328L12.86 9.29148C12.5423 9.66295 12.3835 9.84869 12.312 10.0785C12.2406 10.3083 12.2646 10.5561 12.3126 11.0517L12.3563 11.5029C12.5254 13.2471 12.6099 14.1191 12.0992 14.5068C11.5885 14.8945 10.8208 14.541 9.28549 13.8341L8.88828 13.6512C8.45199 13.4503 8.23384 13.3499 8.0026 13.3499C7.77137 13.3499 7.55322 13.4503 7.11693 13.6512L6.71972 13.8341C5.18439 14.541 4.41672 14.8945 3.90604 14.5068C3.39535 14.1191 3.47986 13.2471 3.64887 11.5029L3.69259 11.0517C3.74062 10.5561 3.76464 10.3083 3.69318 10.0785C3.62172 9.84869 3.46289 9.66295 3.14522 9.29148L2.856 8.95328C1.7381 7.64604 1.17915 6.99242 1.37422 6.36515C1.56928 5.73787 2.38918 5.55236 4.02896 5.18135L4.4532 5.08536C4.91917 4.97993 5.15216 4.92721 5.33923 4.7852C5.52631 4.64319 5.64629 4.42795 5.88625 3.99748L6.10471 3.60558Z" fill="#FFB700"/>
    </svg>
  )

  const getMarkerText = (style?: string) => {
    switch (style) {
      case 'PLUS':
        return '+'
      case 'INFO':
        return 'i'
      case 'QUESTION':
        return '?'
      case 'CHECK':
        return '✓'
      case 'EXCLAMATION':
        return '!'
      case 'ARROW_RIGHT':
        return '>'
      case 'ARROW_UP':
        return '^'
      case 'DOT':
        return '•'
      case 'ONE':
        return '1'
      case 'TWO':
        return '2'
      default:
        return '+'
    }
  }

  const getMarkerIcon = (
    style?: string,
    isViewed?: boolean,
    isActive?: boolean,
  ) => {
    const baseClasses = `flex items-center justify-center transition-all duration-300 z-10`
    const sizeClasses = 'w-6 h-6'

    if (isViewed || isActive) {
      return (
        <div
          className={`${baseClasses} ${sizeClasses} rounded-full bg-white backdrop-blur-sm`}
          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' }}
        >
          <StarMarkerIcon />
        </div>
      )
    }

    return (
      <div
        className={`${baseClasses} ${sizeClasses} rounded-full bg-white/70 font-semibold text-base text-gray-900 backdrop-blur-sm`}
        style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        {getMarkerText(style)}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Document Title */}
      {/* {documentTitle && (
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          {documentTitle}
        </h3>
      )} */}

      {/* Image Container with Markers */}
      <div
        ref={containerRef}
        className="relative w-full overflow-visible rounded-2xl"
      >
        {/* Background Image */}
        <img
          src={background.url}
          alt={background.alt || 'Labeled Graphic'}
          className="h-auto w-full rounded-2xl"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Markers */}
        {imageLoaded &&
          markers.map((marker) => {
            const isViewed = viewedMarkers.has(marker.id)
            const isActive = activeMarkerId === marker.id
            const shouldPulse = !isViewed && !isActive

            return (
              <div
                key={marker.id}
                className="absolute"
                style={{
                  left: `${marker.x_percent}%`,
                  top: `${marker.y_percent}%`,
                }}
              >
                {/* Container căn giữa cho ripple và marker */}
                <div className="relative flex items-center justify-center" style={{ width: 0, height: 0 }}>
                  {/* Ripple effect - sóng lan tỏa với fill trắng */}
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
                          width: [24, 44, 44],
                          height: [24, 44, 44],
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
                          width: [24, 44, 44],
                          height: [24, 44, 44],
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
                          width: [24, 44, 44],
                          height: [24, 44, 44],
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

                  {/* Marker icon - hover scale */}
                  <motion.div
                    className="cursor-pointer"
                    onClick={() => handleMarkerClick(marker.id)}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getMarkerIcon(marker.style, isViewed, isActive)}
                  </motion.div>
                </div>
              </div>
            )
          })}

        {/* Popup on Image */}
        <AnimatePresence>
          {activeMarker && popupPosition && (
            <motion.div
              variants={{
                open:  { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
                close: { opacity: 0, scale: 0, scaleX: 0, scaleY: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
              }}
              initial="close"
              animate="open"
              exit="close"
              className="absolute z-50 flex w-[287px] flex-col rounded-xl bg-white"
              style={{
                top: popupPosition.top,
                left: popupPosition.left,
                right: popupPosition.right,
                bottom: popupPosition.bottom,
                maxHeight: '400px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
                transformOrigin: popupPosition.transformOrigin ?? 'top left',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-3">
                <p className="text-sm font-semibold leading-[22px] text-gray-900">
                  {activeMarker.title}
                </p>
                <button
                  onClick={handleClosePopup}
                  className="ml-2 flex h-4 w-4 flex-shrink-0 items-center justify-center text-gray-600"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-3">
                <div
                  className="text-sm leading-[22px] text-gray-900"
                  dangerouslySetInnerHTML={{ __html: activeMarker.content }}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 p-3">
                <button
                  onClick={handlePrevious}
                  disabled={activeMarkerIndex === 0}
                  className={`flex h-4 w-4 items-center justify-center transition-colors ${
                    activeMarkerIndex === 0
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Progress dots */}
                <div className="flex items-center gap-1">
                  {markers.map((marker, index) => (
                    <div
                      key={marker.id}
                      className={`h-2 rounded-full transition-all ${
                        index === activeMarkerIndex
                          ? 'w-6 bg-blue-500'
                          : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={activeMarkerIndex === markers.length - 1}
                  className={`flex h-4 w-4 items-center justify-center transition-colors ${
                    activeMarkerIndex === markers.length - 1
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
