import React, { useState, useEffect, ReactNode } from 'react'
import { Rnd } from 'react-rnd'
import { Modal } from 'antd'
import styles from '@styles/components/ModalResizeable.module.scss'
import { CloseIcon } from '@assets/icons'

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
}) => {
  const [size, setSize] = useState({ width, height })
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const calculatePosition = () => {
      let x = 0
      let y = 0

      // Get window width and height
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // Calculate position based on input
      switch (position) {
        case 'top left':
          x = 0
          y = 0
          break
        case 'top middle':
          x = (windowWidth - size.width) / 2
          y = 0
          break
        case 'bottom left':
          x = 0
          y = windowHeight - size.height
          break
        case 'bottom middle':
          x = (windowWidth - size.width) / 2
          y = windowHeight - size.height
          break
        case 'bottom right':
          x = windowWidth - size.width
          y = windowHeight - size.height
          break
        case 'top right':
          x = windowWidth - size.width
          y = 0
          break
        case 'center left':
          x = 0
          y = (windowHeight - size.height) / 2
          break
        case 'center right':
          x = windowWidth - size.width
          y = (windowHeight - size.height) / 2
          break
        default: //center
          x = (windowWidth - size.width) / 2
          y = (windowHeight - size.height) / 2
          break
      }

      setModalPosition({ x, y })
    }

    calculatePosition()
  }, [])

  return (
    <Modal
      open={true}
      footer={null}
      maskClosable={true}
      closable={false}
      mask={false}
      style={{ padding: 0 }}
      className={styles.modalResizeable}
      width={'100%'}
      height={'100%'}
      centered
      onCancel={handleCloseScratchPad}
    >
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
      >
        <div className="absolute left-0 top-0  h-full w-full">
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
          <div className={styles.modalContent}>{children}</div>
        </div>
      </Rnd>
    </Modal>
  )
}

export default ModalResizeable
