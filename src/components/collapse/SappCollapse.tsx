import { Collapse, CollapseProps } from 'antd'
import React from 'react'

interface IProps {
  items: CollapseProps['items']
  ghost?: boolean
}
const SappCollapse = ({ items, ghost }: IProps) => {
  return (
    <Collapse
      items={items}
      ghost={ghost}
      defaultActiveKey={[items && items.length ? (items[0].key as string) : '']}
      expandIconPosition="end"
    />
  )
}

export default SappCollapse
