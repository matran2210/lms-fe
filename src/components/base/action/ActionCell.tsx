import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import Icon from '@components/icons'

interface actionCellProps {
  children: ReactNode
  customWidth?: string
}

const ActionCell = ({ children, customWidth }: actionCellProps) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  return (
    <>
      <div
        className={`cursor-pointer ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <Icon type="pencil" />
      </div>
      {isActive && (
        <div
          className={`${
            customWidth ?? 'w-200px'
          } menu menu-sub menu-sub-dropdown w-32 px-4 right-full absolute top-4 z-50 bg-white shadow-notify`}
          data-kt-menu="true"
        >
          {children}
        </div>
      )}
    </>
  )
}

export default ActionCell
