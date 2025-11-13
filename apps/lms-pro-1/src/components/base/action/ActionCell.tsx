import { Dispatch, ReactNode, SetStateAction, useRef } from 'react'
import Icon from '@components/icons'
import useClickOutside from '../clickoutside/HookClick'
import clsx from 'clsx'

interface actionCellProps {
  children: ReactNode
  customWidth?: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
}

const ActionCell = ({
  children,
  customWidth,
  open,
  setOpen,
  className,
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
          className={clsx(
            customWidth ?? 'w-200px',
            className ? className : '',
            `menu menu-sub menu-sub-dropdown absolute right-full z-50 w-36 rounded-md bg-white px-3 shadow-notify`,
          )}
          data-kt-menu="true"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default ActionCell
