import React from 'react'
import { Drawer } from 'antd'
import { BaseDrawerProps } from 'src/type/courses-3-level'

export default function BaseDrawer({
  title = '',
  open,
  onClose,
  children,
  height = 'auto',
  className = '',
}: BaseDrawerProps) {
  return (
    <Drawer
      title={title}
      placement="bottom"
      closable={true}
      onClose={onClose}
      open={open}
      height={height}
      rootClassName={className}
      bodyStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
    >
      {children}
    </Drawer>
  )
}
