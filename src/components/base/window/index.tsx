import { moveAndResizeElement } from '@utils/dragandresize'
import { useEffect, useRef } from 'react'

interface IProps {
  children?: any
  getResize?: (data: any) => void
  position?: any
  onClick?: any
  zIndex?: number
  className?: string
}
const MovableWindow = ({
  children,
  getResize,
  position,
  onClick,
  zIndex,
  className,
}: IProps) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      moveAndResizeElement(
        elementRef.current,
        ({ top, left, width, height }) => {
          getResize && getResize({ top, left, width, height })
        },
      )
    }
  }, [])
  return (
    <div
      ref={elementRef}
      className={`sapp-opacity-bg-border resizable moveable-resizable min-w-fit shadow-preview ${className}`}
      style={{
        width: position?.width,
        height: position?.height,
        top: position?.top,
        left: position?.left,
        zIndex: zIndex,
      }}
      //   onClick={onClick}
      onMouseDown={onClick}
      onTouchStart={onClick}
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
export default MovableWindow
