import { CollapseArrowIcon } from '@lms/assets'
import React, { useState } from 'react'

type IProps = {
  title: string
  children: React.ReactNode
}

function CollapseBox({ title, children }: IProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="border-gray px-7 w-full rounded-lg border py-4">
      <div
        className={`flex items-center justify-between ${isOpen && 'border-graypb-3 mb-4 border-b'}`}
      >
        <div className="text-heading text-base font-semibold">{title}</div>
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <CollapseArrowIcon selected={isOpen} />
        </div>
      </div>
      {isOpen ? children : null}
    </div>
  )
}

export default CollapseBox
