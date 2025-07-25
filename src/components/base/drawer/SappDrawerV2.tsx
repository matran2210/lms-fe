import Icon from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import React, { ReactNode } from 'react'

interface IProps extends DrawerProps {
  open: boolean
  handleCancel: () => void
  width?: number
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
      <div className={`w-full bg-white`}>
        <div className="relative bg-bw-1 px-8 py-6">
          <div className="pr-10 text-2xl font-medium text-white">{title}</div>
          <div
            className="absolute right-8 top-1/2 -translate-y-2/4 cursor-pointer"
            onClick={handleCancel}
          >
            <Icon type="cross" className="text-white" />
          </div>
        </div>
        <div className={`px-8 py-6`}>{children}</div>
      </div>
    </Drawer>
  )
}

export default SappDrawerV2
