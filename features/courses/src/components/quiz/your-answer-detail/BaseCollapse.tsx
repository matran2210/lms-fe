import { Collapse, CollapseProps } from 'antd'
import React from 'react'

interface BaseCollapseProps extends CollapseProps {
  items: CollapseProps['items']
}

const BaseCollapse = ({
  items,
  bordered = false,
  expandIconPosition = 'right',
  ...props
}: BaseCollapseProps) => {
  return (
    <Collapse
      items={items}
      className="base-collapse-quiz-result block md:hidden"
      bordered={bordered}
      expandIconPosition={expandIconPosition}
      {...props}
    />
  )
}

export default BaseCollapse
