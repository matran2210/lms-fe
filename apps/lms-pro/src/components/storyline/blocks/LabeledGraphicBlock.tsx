'use client'

import { useStoryline } from '@contexts/StorylineContext'
import { AbstractCircleIcon, AltArrowLeftIcon, AltArrowRightIcon, ArrowDownCircleIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowUpCircleIcon, BurgerMenuCircleIcon, ChartPieCircleIcon, CheckCircleIcon, ChevronDownCircleIcon, ChevronLeftCircleIcon, ChevronRightCircleIcon, ChevronUpCircleIcon, CloseModalIcon, CrossCircleIcon, InfomationCircleIcon, MinusCircleIcon, PlusCircleIcon, QuestionCircleIcon, StarMarkerIcon } from '@lms/assets'
import { IBackgroundResource, ILabeledGraphicMarker } from '@lms/core'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ContinueButton from '../ContinueButton'

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
    continueAction,
    visibleDocumentCount,
    updateProgress,
    storylineDocument,
  } = useStoryline()
  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount]
  const isLearnedBlock = docIndex < visibleDocumentCount
  const isLastVisibleDocument = docIndex === storylineDocument?.length
  const [viewedMarkers, setViewedMarkers] = useState<Set<string>>(new Set())
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)
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

    // Popup top căn giữa theo marker, clamp trong container
    const centeredTop = markerY - POPUP_HEIGHT / 2

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
        return <PlusCircleIcon />
      case "MINUS":
        return <MinusCircleIcon />
      case "CROSS":
        return <CrossCircleIcon />
      case "CHECK":
        return <CheckCircleIcon />
      case "ABSTRACT":
        return <AbstractCircleIcon />
      case "BURGER_MENU":
        return <BurgerMenuCircleIcon />
      case "CHART_PIE":
        return <ChartPieCircleIcon />
      case "INFOMATION":
        return <InfomationCircleIcon />
      case "QUESTION":
        return <QuestionCircleIcon />
      case "ARROW_LEFT":
        return <ArrowLeftCircleIcon />
      case "ARROW_RIGHT":
        return <ArrowRightCircleIcon />
      case "ARROW_UP":
        return <ArrowUpCircleIcon />
      case "ARROW_DOWN":
        return <ArrowDownCircleIcon />
      case "CHEVRON_LEFT":
        return <ChevronLeftCircleIcon />
      case "CHEVRON_RIGHT":
        return <ChevronRightCircleIcon />
      case "CHEVRON_UP":
        return <ChevronUpCircleIcon />
      case "CHEVRON_DOWN":
        return <ChevronDownCircleIcon />
      default:
        return <PlusCircleIcon />
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
          className={`${baseClasses} ${sizeClasses} rounded-full bg-white/70 backdrop-blur-sm`}
          style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' }}
        >
          <StarMarkerIcon />
        </div>
      )
    }

    return (
      <div className={`${baseClasses} ${sizeClasses} rounded-full bg-white/70 text-gray-800 backdrop-blur-sm`}>
        {getMarkerText(style)}
      </div>
    )
  }

  useEffect(() => {
    if(isLearnedBlock) {
      const allMarkerIds = markers.map(m => m.id)
      setViewedMarkers(new Set(allMarkerIds))
    } else {
      setViewedMarkers(new Set())
    }
  }, [isLearnedBlock])

  // Nếu là document cuối cùng thì sau khi xem hết marker thì tự động call api update progress mà không cần bấm continue
  useEffect(() => {
    if (isLastVisibleDocument && isAllMarkersViewed) {

      updateProgress(
        document_id,
        true
      )
    }
  }, [isLastVisibleDocument, isAllMarkersViewed])

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

        {/* Popup on Image */}
        <AnimatePresence>
          {activeMarker && popupPosition && (
            <motion.div
              variants={{
                open: { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
                close: { opacity: 0, scale: 0, scaleX: 0, scaleY: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
              }}
              initial="close"
              animate="open"
              exit="close"
              className="absolute z-50 flex w-[287px] flex-col rounded-xl bg-white shadow-large p-3 gap-3"
              style={{
                top: popupPosition.top,
                left: popupPosition.left,
                right: popupPosition.right,
                bottom: popupPosition.bottom,
                maxHeight: '400px',
                transformOrigin: popupPosition.transformOrigin ?? 'top left',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {activeMarker.title} #{activeMarkerIndex + 1}
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
                  className="text-sm text-gray-800 font-normal"
                  dangerouslySetInnerHTML={{ __html: activeMarker.content }}
                />
              </div>

              {/* Footer */}
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

                {/* Progress dots */}
                <div className="flex items-center gap-1">
                  {markers.map((marker, index) => {
                    const isViewed = viewedMarkers.has(marker.id)
                    const isActive = activeMarkerId === marker.id

                    return (
                      <div
                        key={marker.id}
                        className={clsx(`w-2 h-2 rounded-full transition-all `, {
                          'bg-primary': isActive,
                          'bg-gray-300': !isActive && !isViewed,
                          'bg-success': isViewed && !isActive
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {
        isShowContinueButton && <ContinueButton
          onClick={() =>
            continueAction(
              currentVisibleDocument && !["QUIZ", "INTERACTION"].includes(currentVisibleDocument?.type)
        ? currentVisibleDocument?.id
        : document_id,
            )
          }
        />
      }

    </div>
  )
}
