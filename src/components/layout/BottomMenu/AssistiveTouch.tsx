import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'
import { AssistiveIcon } from '@assets/icons'

interface AssistiveTouchProps {
  menuItems: {
    label: React.ReactNode
    onClick: () => void
  }[]
  className?: string
}

export default function AssistiveTouch({
  menuItems,
  className,
}: AssistiveTouchProps) {
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 50 })
  const [dragStartTime, setDragStartTime] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleStart = () => {
    setDragStartTime(Date.now())
    setIsDragging(false)
  }

  const handleDrag = () => {
    setIsDragging(true)
  }

  const handleStop = (_: any, data: any) => {
    const dragDuration = Date.now() - dragStartTime

    // Nếu kéo quá ngắn (< 100ms) thì coi như click
    if (dragDuration < 100) {
      setIsDragging(false)
    } else {
      // Delay để tránh trigger onClick ngay sau khi kéo
      setTimeout(() => setIsDragging(false), 150)
    }

    if (!wrapperRef.current) return

    // Luôn hút về bên phải
    const targetY = data.y
    setPosition({ x: 0, y: targetY })
  }

  const handleButtonClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    // Chỉ mở menu nếu không đang kéo
    if (!isDragging) {
      setOpen((prev) => !prev)
    }
  }

  // Detect click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <Draggable
      bounds="body"
      position={position}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      defaultClassName={className}
      nodeRef={wrapperRef}
    >
      <div
        ref={wrapperRef}
        className="fixed bottom-[50%] right-5 z-50"
        style={{ touchAction: 'none' }}
      >
        {/* Main Button */}
        {!open && (
          <button
            type="button"
            onClick={handleButtonClick}
            onTouchEnd={handleButtonClick}
            className="flex items-center justify-center rounded-full bg-icon p-2 text-white shadow-lg backdrop-blur-sm transition-transform active:scale-95"
            style={{
              cursor: isDragging ? 'grabbing' : 'pointer',
              pointerEvents: 'auto',
            }}
          >
            <AssistiveIcon />
          </button>
        )}

        {/* Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 right-0 inline-flex flex-col items-center justify-center gap-[20px] rounded-[20px] bg-gray-800/80 px-6 py-5 backdrop-blur-[2px]"
            >
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    item.onClick()
                    setOpen(false)
                  }}
                  className="text-xs text-white transition-colors hover:text-primary"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Draggable>
  )
}
