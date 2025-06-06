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
  buttonSize?: 'small' | 'medium' | 'lager' | 'extra'
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
  handleCancel: () => void
  handleClose?: () => void
  icon: ReactNode
  header?: ReactNode
  content?: string
  children?: ReactNode
  headerClassName?: string
  isClosable?: boolean

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
  ...otherProps
}: IProps) => {
  return (
    <Modal
      footer={false}
      centered
      closeIcon={false}
      onCancel={isClosable ? handleClose : handleClose || handleCancel}
      {...otherProps}
      closable={isClosable}
    >
      {icon && (
        <div className="flex justify-center pb-10">
          <div className="w-fit">{icon}</div>
        </div>
      )}
      <div className="flex flex-col gap-10 pb-10">
        {header && (
          <div
            className={clsx(
              `text-bw-1 flex justify-center text-3xl font-semibold ${clsx({ 'mb-4': !content && !children })}`,
              headerClassName,
            )}
          >
            {header}
          </div>
        )}
        {(content || children) && (
          <div className="text-bw-13 text-center text-base">
            {content ?? children}
          </div>
        )}
      </div>

      {showFooter && (
        <div className="relative">
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
              isUnderLine: false,
            }}
          />
        </div>
      )}
    </Modal>
  )
}

export default SappModalV3
