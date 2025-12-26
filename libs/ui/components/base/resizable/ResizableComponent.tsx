"use client"
import { ReactNode, useEffect, useRef } from 'react'
import { moveAndResizeElement } from '@lms/utils'

interface IProp {
  children: ReactNode
  getResize?: (data: any, index: number) => void
  index: number
  position?: any
}
export const ResizableComponent = ({
  children,
  getResize,
  index,
  position,
}: IProp) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      moveAndResizeElement(
        elementRef.current,
        ({ top, left, width, height }) => {
          getResize && getResize({ top, left, width, height }, index)
        },
      )
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className="sapp-opacity-bg-border resizable moveable-resizable"
      style={{
        width: position?.width,
        height: position?.height,
        top: position?.top,
        left: position?.left,
      }}
    >
      <div className="resizers">
        <div className="resizer top-left"></div>
        <div className="resizer top-right"></div>
        <div className="resizer bottom-left"></div>
        <div className="resizer bottom-right"></div>
        <div className="resizer right"></div>
        <div className="resizer left"></div>
      </div>
      {children}
    </div>
  )
}
