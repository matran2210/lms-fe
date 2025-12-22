import { Divider as AntdDivider } from 'antd'
import clsx from 'clsx'

interface IDividerProps {
  className?: string
}

const SappDivider = ({ className }: IDividerProps) => {
  return <AntdDivider className={clsx('my-8 bg-gray-300', className)} />
}

export default SappDivider
