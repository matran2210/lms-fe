import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import Icon from '@components/icons'
import useClickOutside from '../clickoutside/HookClick'

interface actionCellProps {
  children: ReactNode
  customWidth?: string
}

const ActionCell = ({ children, customWidth }: actionCellProps) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside({ ref: wrapperRef, callback: () => setIsActive(false) })

  return (
    <div className={'container'} ref={wrapperRef}>
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
