import { Modal } from 'antd'
import React, { ReactNode } from 'react'
import ButtonCancelSubmit from '../button/ButtonCancelSubmit'
import { IButtonColors } from 'src/type'

interface IProps {
  children: ReactNode
  title: ReactNode
  open: boolean
  handleCancel: () => void
  showFooter?: boolean
  cancelButtonCaption?: any
  okButtonCaption?: any
  okButtonClass?: string | undefined
  cancelButtonClass?: string | undefined
  buttonSize?: 'small' | 'medium' | 'large' | 'extra'
  customTitle?: ReactNode
  showHeader?: boolean
  customHeader?: ReactNode
  customFooter?: ReactNode
  confirmOnclose?: boolean | string[]
  size?: string
  modelClassname?: string
  refClass?: string
  childClass?: string
  parentChildClass?: string
  footerButtonClassName?: string
  overlayClass?: string
  color?: IButtonColors
  colorCancel?: IButtonColors
  position?: 'center' | 'start' | 'end'
  fullWidthBtn?: boolean
  isFullScreen?: boolean
  isContentFull?: boolean
  isInner?: boolean
  isBordered?: boolean
  closeAfterSubmit?: boolean
  showOkButton?: boolean
  showCancelButton?: boolean
  zIndex?: string
  scrollbale?: boolean
  footerClassName?: string
  externalLoading?: boolean
  revertFunction?: boolean
  showCloseIcon?: boolean
  disableClickOutSide?: boolean
  loading?: boolean
  disabled?: boolean
  onOk: () => void
  classNameModal?: string | undefined
  width?: number | string
  handleClose?: () => void
  footer?: ReactNode
  isCancelUnderLine?: boolean
}

const SappModalV2 = ({
  children,
  open,
  title,
  handleCancel,
  showFooter = true,
  footerButtonClassName = 'justify-between flex gap-3',
  color,
  colorCancel,
  showOkButton,
  showCancelButton,
  revertFunction,
  okButtonCaption,
  buttonSize = 'small',
  externalLoading,
  loading,
  disabled,
  onOk,
  fullWidthBtn,
  okButtonClass,
  cancelButtonCaption,
  cancelButtonClass,
  classNameModal,
  width = 560,
  handleClose,
  footer,
  isCancelUnderLine,
}: IProps) => {
  return (
    <Modal
      footer={footer}
      title={title}
      centered
      open={open}
      closeIcon={false}
      className={classNameModal ?? 'sapp-modal'}
      onCancel={handleClose || handleCancel}
      width={width}
    >
      {children}
      {showFooter && (
        <div className={`relative pt-6 md:pt-10`}>
          <ButtonCancelSubmit
            revertFunction={revertFunction}
            className={footerButtonClassName}
            showOkButton={showOkButton}
            showCancelButton={showCancelButton}
            submit={{
              title: okButtonCaption,
              size: buttonSize,
              loading: externalLoading != undefined ? externalLoading : loading,
              disabled: disabled,
              onClick: onOk,
              full: fullWidthBtn,
              className: okButtonClass,
            }}
            cancel={{
              title: cancelButtonCaption,
              size: buttonSize,
              onClick: handleCancel,
              loading: externalLoading != undefined ? externalLoading : loading,
              full: fullWidthBtn,
              className: cancelButtonClass,
              isUnderLine: isCancelUnderLine,
            }}
          ></ButtonCancelSubmit>
        </div>
      )}
    </Modal>
  )
}

export default SappModalV2
