import { Modal } from 'antd'
import { ReactNode } from 'react'
import { IButtonColors } from 'src/type'
import ButtonCancelSubmit from '../button/ButtonCancelSubmit'
import clsx from 'clsx'

interface IProps {
  showFooter?: boolean
  cancelButtonCaption?: any
  okButtonCaption?: any
  okButtonClass?: string
  cancelButtonClass?: string
  buttonSize?: 'small' | 'medium' | 'large' | 'extra'
  footerButtonClassName?: string
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
  handleCancel: () => void
  handleClose?: () => void
  icon?: ReactNode
  header?: ReactNode
  content?: string | undefined | ReactNode
  children?: ReactNode
  headerClassName?: string
  isClosable?: boolean
  isUnderLine?: boolean
  customFooter?: ReactNode
  className?: string
  // Các props còn lại sẽ được gom vào otherProps
  [key: string]: any
}

const SappModalV3 = ({
  showFooter = true,
  footerButtonClassName = 'flex flex-col gap-3 items-center justify-between',
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
  handleCancel,
  handleClose,
  icon,
  header,
  content,
  children,
  headerClassName,
  isClosable = false,
  isUnderLine = false,
  className,
  customFooter,
  ...otherProps
}: IProps) => {
  const onCancel = isClosable && handleClose ? handleClose : handleCancel
  return (
    <Modal
      className={clsx('sapp-modal', className)}
      footer={false}
      centered
      closeIcon={false}
      onCancel={onCancel}
      maskClosable={true}
      closable={isClosable}
      {...otherProps}
    >
      {icon && (
        <div className="flex justify-center">
          <div className="w-fit">{icon}</div>
        </div>
      )}
      <div className={clsx('flex flex-col gap-10', { 'pb-10': showFooter })}>
        {header && (
          <div
            className={clsx(
              'flex justify-center text-3xl font-semibold text-gray-800',
              { 'mb-4': !content && !children },
              headerClassName,
            )}
          >
            {header}
          </div>
        )}
        {(content || children) && (
          <div className="text-center text-base text-gray-800">
            {content ?? children}
          </div>
        )}
      </div>
      {showFooter && (
        <div className="relative">
          <ButtonCancelSubmit
            revertFunction={revertFunction}
            className={footerButtonClassName}
            showOkButton={showOkButton}
            showCancelButton={showCancelButton}
            submit={{
              title: okButtonCaption,
              size: buttonSize,
              loading: externalLoading ?? loading,
              disabled,
              onClick: onOk,
              full: fullWidthBtn,
              className: okButtonClass,
            }}
            cancel={{
              title: cancelButtonCaption,
              size: buttonSize,
              onClick: handleCancel,
              loading: externalLoading ?? loading,
              full: fullWidthBtn,
              className: cancelButtonClass,
            }}
          />
        </div>
      )}
      {!showFooter && customFooter && (
        <div className={'relative flex justify-center'}>{customFooter}</div>
      )}
    </Modal>
  )
}

export default SappModalV3
