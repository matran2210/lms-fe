import React, { useState, useEffect, ReactNode } from 'react'
import { Rnd } from 'react-rnd'
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import styles from '@styles/components/ModalResizeable.module.scss'

interface MoveableResizableModalProps {
  title?: string
  children: ReactNode
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  dragHandleClassName?: string
  handleCloseScratchPad?: (pad: any) => void
}

const MoveableResizableModal: React.FC<MoveableResizableModalProps> = ({
  title = 'Modal Title',
  children,
  width = 400,
  height = 300,
  minWidth = 200,
  minHeight = 200,
  dragHandleClassName, //prop determine which class to use for the drag handle
  handleCloseScratchPad,
}) => {
  const [size, setSize] = useState({ width, height })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const x = (window.innerWidth - size.width) / 2
    const y = (window.innerHeight - size.height) / 2
    setPosition({ x, y })
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
        position={{ x: position.x, y: position.y }}
        onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, newPos) => {
          setSize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          })
          setPosition(newPos)
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        bounds="window"
        style={{
          background: 'white',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          border: '1px solid #DCDDDD',
        }}
        dragHandleClassName={dragHandleClassName ? dragHandleClassName : ''}
      >
        <div className={styles.modalHeader}>
          <span>{title}</span>
          <CloseOutlined style={{ cursor: 'pointer' }} />
        </div>
        <div className={styles.modalContent}>{children}</div>
      </Rnd>
    </Modal>
  )
}

export default MoveableResizableModal
