"use client"
import { useClickOutside } from '@lms/ui'
import { Icon } from '@lms/assets'
import clsx from 'clsx'
import React, { ReactNode, useRef, useState } from 'react'

interface actionCellProps {
  children: ReactNode
}
const ExamInfoActionCell = ({ children }: actionCellProps) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside({ ref: wrapperRef, callback: () => setOpen(false) })

  return (
    <div className={'containers'} ref={wrapperRef}>
      <div
        className={`cursor-pointer ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <Icon type="pencil" />
      </div>
      {open && (
        <div
          className={clsx(
            `menu menu-sub menu-sub-dropdown absolute right-full top-0 z-50 w-36 rounded-md bg-white p-2 shadow-notify`,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default ExamInfoActionCell
