import { CloseIconV2 } from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import React, { ReactNode } from 'react'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import clsx from 'clsx'
import ButtonText from '@components/base/button/ButtonText'
import { CollapseArrowIcon } from '@assets/icons'

interface IProps extends DrawerProps {
  open: boolean
  handleCancel?: () => void
  handleBack?: () => void
  width?: number
  title: string
  isShowBtnClose?: boolean
  isShowFooter?: boolean
  children: ReactNode
  loading?: boolean
  btnSubmitTile?: string
  handleSubmit?: () => void
  sizeTextBtn?: 'small' | 'medium' | 'large' | 'extra'
  submitButtonClassName?: string
  classNameBody?: string
  cancelButtonCaption?: string
  cancelButtonClassName?: string
}

const SappDrawerV3: React.FC<IProps> = ({
  open,
  handleCancel,
  handleBack,
  width = '33%',
  title,
  children,
  isShowBtnClose = true,
  isShowFooter = false,
  loading = false,
  className,
  btnSubmitTile,
  handleSubmit,
  sizeTextBtn = 'medium',
  submitButtonClassName,
  classNameBody,
  cancelButtonCaption,
  cancelButtonClassName,
  ...props
}) => {
  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      width={width}
      title={undefined}
      closeIcon={false}
      {...props}
    >
      <div
        className={clsx('relative h-full w-full bg-white p-8', classNameBody)}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isShowBtnClose && (
              <div
                onClick={handleBack}
                className="cursor-pointer"
                aria-label="Go back"
              >
                <CollapseArrowIcon className="rotate-90" />
              </div>
            )}
            <span className="text-2xl font-semibold leading-loose text-secondary">
              {title}
            </span>
          </div>
          {isShowBtnClose && (
            <button
              onClick={handleCancel}
              className="cursor-pointer"
              aria-label="Close"
            >
              <CloseIconV2 />
            </button>
          )}
        </div>

        {/* Content */}
        <>{children}</>

        {/* Footer */}
        {isShowFooter && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-8 pb-8">
            {cancelButtonCaption && (
              <ButtonText
                title={cancelButtonCaption}
                className={cancelButtonClassName}
                onClick={handleCancel}
                size={sizeTextBtn}
              />
            )}
            <ButtonPrimary
              title={btnSubmitTile}
              className={submitButtonClassName}
              onClick={handleSubmit}
              size={sizeTextBtn}
              loading={loading}
            />
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default SappDrawerV3
