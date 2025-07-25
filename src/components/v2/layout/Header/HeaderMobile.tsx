import { CollapseArrowIcon } from '@assets/icons'
import { truncateString } from '@utils/index'
import clsx from 'clsx'
import React from 'react'
import Tooltip from 'src/common/Tooltip'

interface IProps {
  extraActions?: React.ReactNode
  title: string
  icon?: React.ReactNode
  showIcon?: boolean
  className?: string
  isHidden?: boolean
  onBack?: () => void
}
const HeaderMobile = ({
  title,
  icon,
  extraActions,
  showIcon = true,
  isHidden = false,
  onBack,
  className,
}: IProps) => {
  return (
    <div
      className={clsx(
        `flex w-full select-none flex-wrap items-center justify-between gap-4`,
        className,
        { hidden: isHidden },
      )}
    >
      <div className="flex items-center gap-2 text-xl font-medium text-gray-v2-800 md:text-2xl lg:text-3xl lg:font-semibold">
        {showIcon && (
          <div className="cursor-pointer lg:hidden" onClick={onBack}>
            {icon ?? <CollapseArrowIcon className="rotate-90" />}
          </div>
        )}
        <Tooltip title={title?.length > 95 && title}>
          {truncateString(title, 91)}
        </Tooltip>
      </div>
      <div>{extraActions}</div>
    </div>
  )
}

export default HeaderMobile
