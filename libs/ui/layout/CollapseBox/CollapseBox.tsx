import { CollapseArrowIcon } from '@lms/assets'
import React, { useState } from 'react'

type IProps = {
  title: string
  children: React.ReactNode
}

function CollapseBox({ title, children }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="w-full rounded-lg border border-gray px-7 py-4">
      <div
        className={`flex items-center justify-between ${isOpen && 'mb-4 border-b border-gray pb-3'}`}
      >
        <div className="text-base font-semibold text-gray-600">{title}</div>
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <CollapseArrowIcon selected={isOpen} />
        </div>
      </div>
      {isOpen ? children : null}
    </div>
  )
}

export default CollapseBox
