import Icon from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import React, { ReactNode } from 'react'
import SappFilterButton from '@components/base/button/SAPPFIlterButton'
interface IProps extends DrawerProps {
  open: boolean
  handleCancel: () => void
  width?: number
  title: string
  children: ReactNode
}

const SappDrawer = ({
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
      <div className="relative h-screen w-full bg-white">
        <div className="relative border-b-1.5 px-8 py-5">
          <div className="justify-start font-['Roboto'] text-xl font-semibold leading-[30px] text-gray-700">
            {title}
          </div>
          <div
            className="absolute right-8 top-1/2 -translate-y-2/4 cursor-pointer"
            onClick={handleCancel}
          >
            <Icon type="cross" />
          </div>
        </div>
        <div className="px-8 py-6">{children}</div>

        <div className="absolute bottom-0 left-0 flex w-full justify-end border-t-1.5 px-8 py-5">
          <SappFilterButton
            titleReset="Cancel"
            titleSubmit="Save"
            okClick={() => {}}
            resetClick={() => {}}
            disabled={false}
            loading={false}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default SappDrawer
