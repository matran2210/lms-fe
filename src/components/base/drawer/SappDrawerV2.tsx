import CloseModalIcon from '@assets/icons/CloseModalIcon'
import Icon from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface IProps extends DrawerProps {
  open: boolean
  handleCancel: () => void
  width?: number | string
  title: ReactNode
  children: ReactNode
  classNameHeader?: string
  classNameBody?: string
  className?: string
}

const SappDrawerV2 = ({
  open,
  handleCancel,
  width,
  title,
  children,
  classNameHeader,
  classNameBody,
  className,
  ...props
}: IProps) => {
  return (
    <Drawer
      open={open}
      title={undefined}
      onClose={handleCancel}
      width={width ?? '45%'}
      closeIcon={false}
      {...props}
    >
      <div className={clsx(`w-full bg-white`, className)}>
        <div
          className={clsx(
            'relative bg-[#050505] p-4 text-2xl text-white md:px-8 md:py-6',
            classNameHeader,
          )}
        >
          <div className="pr-0 font-medium md:pr-10">{title}</div>
          <div
            className="absolute right-4 top-1/2 -translate-y-2/4 cursor-pointer md:right-0 lg:right-8"
            onClick={handleCancel}
          >
            <CloseModalIcon />
          </div>
        </div>
        <div className={clsx(`p-4 md:px-8 md:py-6`, classNameBody)}>
          {children}
        </div>
      </div>
    </Drawer>
  )
}

export default SappDrawerV2
