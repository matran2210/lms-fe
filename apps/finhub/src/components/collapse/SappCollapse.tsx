import { CollapseArrowIcon } from '@lms/assets'
import { Collapse, CollapseProps } from 'antd'

interface IProps {
  items: CollapseProps['items']
  ghost?: boolean
  className?: string
}
const SappCollapse = ({ items, ghost, className }: IProps) => {
  return (
    <Collapse
      className={className}
      items={items}
      ghost={ghost}
      defaultActiveKey={[items && items.length ? (items[0].key as string) : '']}
      expandIconPosition="end"
      expandIcon={({ isActive }) => <CollapseArrowIcon selected={isActive} />}
    />
  )
}

export default SappCollapse
