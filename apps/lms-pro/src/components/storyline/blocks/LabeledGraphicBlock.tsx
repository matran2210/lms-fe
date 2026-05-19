'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { AbstractCircleIcon, AltArrowLeftIcon, AltArrowRightIcon, ArrowDownCircleIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowUpCircleIcon, BurgerMenuCircleIcon, ChartPieCircleIcon, CheckCircleIcon, ChevronDownCircleIcon, ChevronLeftCircleIcon, ChevronRightCircleIcon, ChevronUpCircleIcon, CloseModalIcon, CrossCircleIcon, InfomationCircleIcon, MinusCircleIcon, PlusCircleIcon, QuestionCircleIcon, StarMarkerIcon } from '@lms/assets'
import { IBackgroundResource, ILabeledGraphicMarker } from '@lms/core'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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

export default function LabeledGraphicBlock({ markers, backgroundResource, documentTitle, document_id, docIndex }: Props) {
  const {
    visibleDocumentCount,
    storylineDocument,
  } = useStoryline()
  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount]
  const isLearnedBlock = docIndex < visibleDocumentCount
  const [viewedMarkers, setViewedMarkers] = useState<Set<string>>(new Set())
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
  ): PopupPosition => {
    if (!containerRef.current) {
      return { left: 0, top: 0, transformOrigin: 'top left' }
    }

    // Check if mobile (screen width < 768px)
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      // Mobile: fixed bottom popup
      return {
        bottom: 0,
        left: 0,
        right: 0,
        transformOrigin: 'bottom center',
      }
    }

    // Desktop: calculate position relative to marker
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

  const handleMarkerClick = (marker: ILabeledGraphicMarker) => {
    const markerId = marker.id
    if (!marker) return

    if (activeMarkerId === markerId) {
      // Close if clicking the same marker
      setActiveMarkerId(null)
      setPopupPosition(null)
      return
    }

    // Switch to new marker directly (popup will replace)
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
  }, [isLearnedBlock])

  return (
    <div className="w-full">
      {/* Document Title */}
      {documentTitle && (
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          {documentTitle}
        </h3>
      )}

      {/* Image Container with Markers */}
      <div
        ref={containerRef}
        className={clsx("relative w-full overflow-visible rounded-2xl", {
          "mb-12": isShowContinueButton
        })}
      >
        {/* Background Image */}
        <img
          src={backgroundResource.url}
          alt={'Labeled Graphic'}
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

      {/* Popup - Mobile (Portal) */}
      {mounted && typeof window !== 'undefined' && window.innerWidth < 768 && (
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
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <p className="text-base font-semibold text-gray-800">
                      {activeMarker?.title} #{activeMarkerIndex + 1}
                    </p>
                    <div
                      onClick={handleClosePopup}
                      className="cursor-pointer text-gray-800"
                    >
                      <CloseModalIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto">
                    <div
                      className="text-sm font-normal text-gray-800"
                      dangerouslySetInnerHTML={{ __html: activeMarker?.content || '' }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handlePrevious}
                      disabled={activeMarkerIndex === 0}
                      className={`flex h-5 w-5 items-center justify-center transition-colors ${
                        activeMarkerIndex === 0
                          ? 'cursor-not-allowed text-gray-300'
                          : 'text-gray-800'
                      }`}
                    >
                      <AltArrowLeftIcon className="w-5 h-5"/>
                    </button>

                    {/* Progress dots */}
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
                      className={`flex h-5 w-5 items-center justify-center transition-colors ${
                        activeMarkerIndex === markers.length - 1
                          ? 'cursor-not-allowed text-gray-300'
                          : 'text-gray-800'
                      }`}
                    >
                      <AltArrowRightIcon className='w-5 h-5'/>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </>
      )}

      {/* Popup - Desktop */}
      {(typeof window === 'undefined' || window.innerWidth >= 768) && (
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
              className="absolute z-[250] flex w-[287px] flex-col gap-3 rounded-xl bg-white p-3"
              style={{
                top: popupPosition?.top,
                left: popupPosition?.left,
                right: popupPosition?.right,
                bottom: popupPosition?.bottom,
                maxHeight: '400px',
                transformOrigin: popupPosition?.transformOrigin ?? 'top left',
                boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.12)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {activeMarker?.title} #{activeMarkerIndex + 1}
                </p>
                <div
                  onClick={handleClosePopup}
                  className="cursor-pointer text-gray-800"
                >
                  <CloseModalIcon className="w-4 h-4" />
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                <div
                  className="text-sm font-normal text-gray-800"
                  dangerouslySetInnerHTML={{ __html: activeMarker?.content || '' }}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={activeMarkerIndex === 0}
                  className={`flex h-4 w-4 items-center justify-center transition-colors ${
                    activeMarkerIndex === 0
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-800'
                  }`}
                >
                  <AltArrowLeftIcon />
                </button>

                {/* Progress dots */}
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
                  className={`flex h-4 w-4 items-center justify-center transition-colors ${
                    activeMarkerIndex === markers.length - 1
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-800'
                  }`}
                >
                  <AltArrowRightIcon />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
