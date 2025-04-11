import { Modal } from 'antd'
import { ReactNode } from 'react'
import { IButtonColors } from 'src/type'
import ButtonCancelSubmit from '../button/ButtonCancelSubmit'
import clsx from 'clsx'

interface IProps {
  title?: React.ReactNode
  open: boolean | undefined
  handleCancel: () => void
  showFooter?: boolean
  cancelButtonCaption?: any
  okButtonCaption?: any
  okButtonClass?: string | undefined
  cancelButtonClass?: string | undefined
  buttonSize?: 'small' | 'medium' | 'lager' | 'extra'
  size?: string
  footerButtonClassName?: string
  color?: IButtonColors
  colorCancel?: IButtonColors
  fullWidthBtn?: boolean
  showOkButton?: boolean
  showCancelButton?: boolean
  scrollbale?: boolean
  footerClassName?: string
  externalLoading?: boolean
  revertFunction?: boolean
  loading?: boolean
  disabled?: boolean
  onOk: () => void
  classNameModal?: string | undefined
  width?: number | undefined | string
  handleClose?: () => void
  icon: ReactNode
  header: string
  content?: string | undefined
  children?: ReactNode
  isMaskClosable?: boolean
}

const SappModalV3 = ({
  open,
  title,
  handleCancel,
  showFooter = true,
  footerButtonClassName = 'justify-between flex gap-3 flex flex-col-reverse gap-6',
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
  width = 630,
  handleClose,
  header,
  icon,
  content,
  children,
  isMaskClosable = true,
}: IProps) => {
  return (
    <Modal
      footer={false}
      title={title}
      centered
      open={open}
      closeIcon={false}
      className={classNameModal ?? 'sapp-modal'}
      onCancel={handleClose || handleCancel}
      width={width}
      maskClosable={isMaskClosable}
    >
      {icon && (
        <div className="flex justify-center">
          <div className="w-fit rounded-full bg-secondary p-8">{icon}</div>
        </div>
      )}
      {header && (
        <div
          className={`mt-6 flex justify-center text-3xl font-semibold text-bw-1 ${clsx({ 'mb-4': !content || !children })}`}
        >
          {header}
        </div>
      )}

      {(content || children) && (
        <div className="mb-12 mt-4 text-center text-medium-sm text-gray-1">
          {content ?? children}
        </div>
      )}

      {showFooter && (
        <div className={`relative`}>
          <ButtonCancelSubmit
            revertFunction={revertFunction}
            className={footerButtonClassName}
            color={color}
            colorCancel={colorCancel}
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
            }}
          />
        </div>
      )}
    </Modal>
  )
}

export default SappModalV3
