import { ArrowLeftIcon, CloseIconV2 } from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import React, { ReactNode } from 'react'

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
}

const SappDrawerV3 = ({
  open,
  handleBack,
  handleCancel,
  width,
  title,
  children,
  isShowBtnClose = true,
  isShowFooter = false,
  loading = false,
  className,
  ...props
}: IProps) => {
  return (
    <Drawer
      open={open}
      title={undefined}
      onClose={handleCancel}
      width={width ?? '30%'}
      closeIcon={false}
      loading={loading}
      {...props}
    >
      <div className="h-full w-full bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-gray-14 flex items-center gap-2 text-2xl font-semibold leading-loose">
            {!isShowBtnClose && (
              <div onClick={handleBack} className="cursor-pointer">
                <ArrowLeftIcon />
              </div>
            )}
            <div>{title}</div>
          </div>
          {isShowBtnClose && (
            <div className="cursor-pointer" onClick={handleCancel}>
              <CloseIconV2 />
            </div>
          )}
        </div>
        <div>{children}</div>
      </div>
    </Drawer>
  )
}

export default SappDrawerV3
