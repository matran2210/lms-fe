import { PepIconsPencil } from '@lms/assets'
import { Dropdown } from 'antd'
import React from 'react'
import { Placement } from '@lms/core'

interface SAPPDropdownProps {
  children: React.ReactNode | React.ReactNode[]
  icon?: React.ReactNode
  trigger?: ('click' | 'hover' | 'contextMenu')[]
  placement?: Placement
}

const SAPPDropdown = ({
  children,
  icon,
  trigger = ['click'],
  placement = 'bottomLeft',
}: SAPPDropdownProps) => {
  const flattenedChildren = React.Children.toArray(children) // Flatten children
  const items = flattenedChildren.map((child, index) => ({
    key: index,
    label: child,
  }))

  return (
    <Dropdown
      menu={{ items }}
      trigger={trigger}
      placement={placement}
      overlayClassName="w-[150px]"
    >
      <div className="cursor-pointer">{icon ?? <PepIconsPencil />}</div>
    </Dropdown>
  )
}

export default SAPPDropdown
