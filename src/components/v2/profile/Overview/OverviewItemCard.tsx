import { CollapseArrowIcon } from '@assets/icons'
import Link from 'next/link'
import React from 'react'

interface IProps {
  title: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  onClick?: () => void
  linkTo?: string
}
const OverviewItemCard = ({
  title,
  startIcon,
  endIcon,
  onClick,
  linkTo,
}: IProps) => {
  const content = (
    <div className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-card hover:shadow-card">
      <div className="flex items-center justify-center gap-3">
        {startIcon && (
          <div className="relative h-6 w-6">
            <div className="absolute left-0 top-0 h-6 w-6 overflow-hidden">
              {startIcon}
            </div>
          </div>
        )}
        <div className="justify-center font-['Roboto'] text-base font-normal leading-normal text-gray-v2-800">
          {title}
        </div>
      </div>
      <div className="relative h-6 w-6">
        {endIcon ?? <CollapseArrowIcon className="-rotate-90" />}
      </div>
    </div>
  )
  if (linkTo) return <Link href={linkTo || ''}>{content}</Link>

  return <div onClick={onClick}>{content}</div>
}

export default OverviewItemCard
