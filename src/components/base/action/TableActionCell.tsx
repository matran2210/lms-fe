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
            customWidth ?? 'w-[180px]'
          } flex flex-col rounded-lg bg-white py-3 text-sm font-semibold text-white shadow-lg`}
        >
          {children}
        </div>
      )}
    >
      <Tooltip title="Action" placement="top">
        <span className="h-[${height}] flex w-[35px] cursor-pointer items-center justify-center rounded-full bg-transparent text-gray-500">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            height="1.05em"
            viewBox="0 0 128 512"
          >
            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
          </svg>
        </span>
      </Tooltip>
    </Dropdown>
  )
}

export default TableActionCell
