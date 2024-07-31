import { Dispatch, ReactNode, SetStateAction, useRef } from 'react'
import Icon from '@components/icons'
import useClickOutside from '../clickoutside/HookClick'

interface actionCellProps {
  children: ReactNode
  customWidth?: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const ActionCell = ({
  children,
  customWidth,
  open,
  setOpen,
}: actionCellProps) => {
  const handleClick = () => {
    setOpen(!open)
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside({ ref: wrapperRef, callback: () => setOpen(false) })

  return (
    <div className={'containers'} ref={wrapperRef}>
      <div
        className={`cursor-pointer ${open ? 'active' : ''}`}
        onClick={handleClick}
      >
        <Icon type="pencil" />
      </div>
      {open && (
        <div
          className={`${
            customWidth ?? 'w-200px'
          } menu menu-sub menu-sub-dropdown w-36 px-4 right-full absolute top-4 z-50 bg-white shadow-notify`}
          data-kt-menu="true"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default ActionCell
