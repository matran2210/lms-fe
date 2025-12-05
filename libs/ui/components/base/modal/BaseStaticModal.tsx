import { Modal } from 'antd'
import clsx from 'clsx'
import React from 'react'

export interface BaseStaticModalProps {
  visible: boolean
  title?: string
  closable?: boolean
  maskClosable?: boolean
  closeIcon?: React.ReactNode
  footer?: React.ReactNode | null
  children: React.ReactNode
  contentClassName?: string
  width?: number
  onClose?: () => void
  className?: string
}

const DEFAULT_WIDTH = 459

const BaseStaticModal: React.FC<BaseStaticModalProps> = ({
  visible = false,
  title,
  closable = false,
  maskClosable = false,
  closeIcon = null,
  footer = null,
  children,
  contentClassName = '',
  width = DEFAULT_WIDTH,
  onClose,
  className,
}) => {
  return (
    <Modal
      open={visible}
      closable={closable}
      maskClosable={maskClosable}
      footer={footer}
      title={
        <div className="text-center text-xl font-bold md:text-3xl">{title}</div>
      }
      className={clsx('px-2', className)}
      closeIcon={closeIcon}
      onCancel={onClose}
      width={width}
      centered
      modalRender={(modal) => (
        <div
          className={clsx(
            '[&>.ant-modal-content]:rounded-lg [&>.ant-modal-content]:p-4 md:[&>.ant-modal-content]:p-8',
            contentClassName,
          )}
        >
          {modal}
        </div>
      )}
    >
      {children}
    </Modal>
  )
}

export default BaseStaticModal
