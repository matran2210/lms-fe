import { ArrowLeftIcon, CloseIconV2 } from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import React, { ReactNode } from 'react'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

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
      <div className="relative h-full w-full bg-white p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isShowBtnClose && handleBack && (
              <button
                onClick={handleBack}
                className="cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeftIcon />
              </button>
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
        <div>{children}</div>

        {/* Footer */}
        {isShowFooter && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-end px-8 pb-8">
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
