import { MutableRefObject, ReactNode, useEffect, useRef } from 'react'
import { moveAndResizeElement } from 'src/utils/dragandresize'

interface IProp {
  children: ReactNode
  getResize?: (data: any, index: number) => void
  index: number
  position?: any
  parentContentRef: MutableRefObject<HTMLElement | any>
}
export const ResizableComponent = ({
  children,
  getResize,
  index,
  position,
  parentContentRef,
}: IProp) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current && parentContentRef.current) {
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
      className="absolute cursor-move resize-none border-none bg-transparent opacity-90 transition-opacity duration-200 hover:opacity-100 [&_.not-resizer]:cursor-default"
      style={{
        width: position?.width,
        height: position?.height,
        top: position?.top,
        left: position?.left,
      }}
    >
      <div className="hidden">
        <div className="absolute -left-1 -top-1 h-2 w-2 cursor-nw-resize bg-blue-500"></div>
        <div className="absolute -right-1 -top-1 h-2 w-2 cursor-ne-resize bg-blue-500"></div>
        <div className="absolute -bottom-1 -left-1 h-2 w-2 cursor-sw-resize bg-blue-500"></div>
        <div className="absolute -bottom-1 -right-1 h-2 w-2 cursor-se-resize bg-blue-500"></div>
        <div className="absolute -right-1 top-1/2 h-8 w-2 -translate-y-1/2 cursor-e-resize bg-blue-500"></div>
        <div className="absolute -left-1 top-1/2 h-8 w-2 -translate-y-1/2 cursor-w-resize bg-blue-500"></div>
      </div>
      {children}
    </div>
  )
}
