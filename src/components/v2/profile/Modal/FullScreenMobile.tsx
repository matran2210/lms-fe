import SappDrawerV3 from '@components/v2/base/drawer/SappDrawerV3'
import Footer from '@components/layout/Footer'
import React, { PropsWithChildren } from 'react'

interface IProps {
  open: boolean
  onClose: () => void
  title?: string
  className?: string
}
const FullScreenMobile = ({
  open,
  onClose,
  title = '',
  children,
  className,
}: PropsWithChildren<IProps>) => {
  return (
    <SappDrawerV3
      width={'100%'}
      open={open}
      onClose={onClose}
      handleBack={onClose}
      title={title}
      isShowBtnClose={false}
      classNameHeader="pt-2 px-4 !mb-0 pb-6 bg-gray-canvas"
      classNameBody="!p-0 !bg-gray-canvas"
      rootClassName="full-screen-mobile"
      push={{ distance: 0 }}
    >
      <div className={className}>{children}</div>
    </SappDrawerV3>
  )
}

export default FullScreenMobile
