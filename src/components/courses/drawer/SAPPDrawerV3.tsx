import Icon from '@components/icons'
import { Drawer, DrawerProps } from 'antd'
import clsx from 'clsx'
import { ReactNode } from 'react'

interface IProps extends DrawerProps {
  open: boolean
  handleCancel: () => void
  width?: number
  title: string
  children: ReactNode
  customTitle?: ReactNode
  contentClassName?: string
}

const SAPPDrawerV3 = ({
  open,
  handleCancel,
  width,
  title,
  children,
  customTitle,
  contentClassName,
  ...props
}: IProps) => {
  return (
    <Drawer
      {...props}
      open={open}
      title={undefined}
      onClose={handleCancel}
      width={width ?? '45%'}
      closeIcon={false}
    >
      <div className={`w-full bg-white`}>
        {customTitle ? (
          customTitle
        ) : (
          <div className="relative bg-bw-1 px-8 py-6">
            <div className="pr-10 text-2xl font-medium text-white">{title}</div>
            <div
              className="absolute right-8 top-1/2 -translate-y-2/4 cursor-pointer"
              onClick={handleCancel}
            >
              <Icon type="cross" className="text-white" />
            </div>
          </div>
        )}
        <div className={clsx('px-8 py-6', contentClassName)}>{children}</div>
      </div>
    </Drawer>
  )
}

export default SAPPDrawerV3
