import React from 'react'
import { Popover as AntdPopover, PopoverProps } from 'antd'

interface CustomPopoverProps extends PopoverProps {}

const Popover: React.FC<CustomPopoverProps> = (props) => {
  return <AntdPopover {...props} id="sapp-popover" />
}

export default Popover
