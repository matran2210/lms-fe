import { ActionIcon } from '@lms/assets'
import { Dropdown, Tooltip } from 'antd'
import { ReactNode, useState } from 'react'
interface TableActionCellProps {
  children: (closeDropdown: () => void) => ReactNode
  customWidth?: string
}

const TableActionCell: React.FC<TableActionCellProps> = ({
  children,
  customWidth,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false)
  const closeDropdown = () => setOpenDropdown(false)

  return (
    <Dropdown
      open={openDropdown}
      onOpenChange={setOpenDropdown}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="custom-dropdown"
      dropdownRender={() => (
        <div
          className={`${
            customWidth ?? 'w-[180px]'
          } flex flex-col rounded-lg bg-white text-sm font-semibold text-white shadow-lg`}
        >
          {children(closeDropdown)}
        </div>
      )}
    >
      <Tooltip title="Action" classNames={{ root: 'tooltip-action' }}>
        <span
          className="h-[${height}] flex w-9 cursor-pointer items-center justify-center rounded-full bg-transparent text-[#6b7280]"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <ActionIcon />
        </span>
      </Tooltip>
    </Dropdown>
  )
}

export default TableActionCell
