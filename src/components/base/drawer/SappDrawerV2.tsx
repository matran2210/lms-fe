import Icon from '@components/icons'
import { Drawer } from 'antd'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  width?: number
  title: string
  children: ReactNode
}

const SappDrawerV2 = ({ open, setOpen, width, title, children }: IProps) => {
  return (
    <Drawer
      open={open}
      title={undefined}
      onClose={() => setOpen(false)}
      width={width ?? '45%'}
      closeIcon={false}
    >
      <div className={`bg-white w-full`}>
        <div className="bg-bw-1 px-8 py-6 relative">
          <div className="text-2xl font-medium text-white pr-10">{title}</div>
          <div
            className="absolute right-8 top-1/2 -translate-y-2/4 cursor-pointer"
            onClick={() => setOpen(false)}
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
