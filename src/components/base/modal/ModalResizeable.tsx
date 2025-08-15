import { CloseIcon } from '@assets/icons'
import styles from '@styles/components/ModalResizeable.module.scss'
import clsx from 'clsx'
import React, { ReactNode, useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'

interface ModalResizeableProps {
  title?: string | ReactNode
  children: ReactNode
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  dragHandleClassName?: string
  header?: ReactNode
  handleCloseScratchPad?: (pad: any) => void
  position?:
    | 'top left'
    | 'top middle'
    | 'top right'
    | 'bottom left'
    | 'bottom middle'
    | 'bottom right'
    | 'center left'
    | 'center right'
    | 'center'
  rootClassName?: string
  bodyClassName?: string
  contentClassName?: string
}

const ModalResizeable: React.FC<ModalResizeableProps> = ({
  title = 'Title',
  children,
  width = 600,
  height = 400,
  minWidth = 200,
  minHeight = 200,
  header,
  dragHandleClassName, //Determine the drag handle class name
  handleCloseScratchPad,
  position = 'center',
  rootClassName,
  bodyClassName,
  contentClassName,
}) => {
  const [size, setSize] = useState({ width, height })

  //Hàm tính vị trí của Modal
  const calculatePosition = (
    pos: string,
    modalWidth: number,
    modalHeight: number,
  ) => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const positions = {
      'top left': { x: 0, y: 0 },
      'top middle': { x: (windowWidth - modalWidth) / 2, y: 0 },
      'bottom left': { x: 0, y: windowHeight - modalHeight },
      'bottom middle': {
        x: (windowWidth - modalWidth) / 2,
        y: windowHeight - modalHeight,
      },
      'bottom right': {
        x: windowWidth - modalWidth,
        y: windowHeight - modalHeight,
      },
      'top right': { x: windowWidth - modalWidth, y: 0 },
      'center left': { x: 0, y: (windowHeight - modalHeight) / 2 },
      'center right': {
        x: windowWidth - modalWidth,
        y: (windowHeight - modalHeight) / 2,
      },
      center: {
        x: (windowWidth - modalWidth) / 2,
        y: (windowHeight - modalHeight) / 2,
      },
    }

    return positions[pos as keyof typeof positions] || positions.center
  }

  const [modalPosition, setModalPosition] = useState(() =>
    calculatePosition(position, width, height),
  )

  useEffect(() => {
    setModalPosition(calculatePosition(position, size.width, size.height))
  }, [])

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={modalPosition}
      onDragStop={(e, d) => setModalPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, newPos) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        })
        setModalPosition(newPos)
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="window"
      style={{
        background: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        border: '1px solid #DCDDDD',
      }}
      dragHandleClassName={
        dragHandleClassName ? dragHandleClassName : 'modal-header'
      }
      className={clsx(styles.modalResizeable, rootClassName)}
    >
      <div
        className={clsx('absolute left-0 top-0 h-full w-full', bodyClassName)}
      >
        {header ? (
          header
        ) : (
          <div className={styles.modalHeader}>
            <div className="modal-header flex h-10 w-full cursor-move items-center justify-between px-5">
              <div className="truncate">{title}</div>
            </div>
            <button
              className="absolute right-3 top-2"
              onClick={handleCloseScratchPad}
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className={clsx(styles.modalContent, contentClassName)}>
          {children}
        </div>
      </div>
    </Rnd>
  )
}

export default ModalResizeable
