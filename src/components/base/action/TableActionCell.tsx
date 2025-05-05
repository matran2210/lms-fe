import { ActionIcon } from '@assets/icons'
import { Dropdown, Tooltip } from 'antd'
import { ReactNode } from 'react'
interface TableActionCellProps {
  children: ReactNode
  customWidth?: string
}

const TableActionCell: React.FC<TableActionCellProps> = ({
  children,
  customWidth,
}) => {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="custom-dropdown"
      dropdownRender={() => (
        <div
          className={`${
            customWidth ?? 'w-45'
          } flex flex-col rounded-lg bg-white text-sm font-semibold text-white shadow-lg`}
        >
          {children}
        </div>
      )}
    >
      <Tooltip title="Action" classNames={{ root: 'tooltip-action' }}>
        <span className="h-[${height}] flex w-9 cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-500">
          <ActionIcon />
        </span>
      </Tooltip>
    </Dropdown>
  )
}

export default TableActionCell
