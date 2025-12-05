import { Collapse, CollapseProps } from 'antd'
import clsx from 'clsx'

interface BaseCollapseProps extends CollapseProps {
  items: CollapseProps['items']
  classNameProp?: string
}

const BaseCollapse = ({
  items,
  bordered = false,
  expandIconPosition = 'right',
  classNameProp,
  ...props
}: BaseCollapseProps) => {
  return (
    <Collapse
      items={items}
      className={clsx(
        classNameProp || 'base-collapse-quiz-result block md:hidden',
      )}
      bordered={bordered}
      expandIconPosition={expandIconPosition}
      {...props}
    />
  )
}

export default BaseCollapse
