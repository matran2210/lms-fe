import { truncateString } from '@utils/index'
import clsx from 'clsx'
import React from 'react'
import Tooltip from 'src/common/Tooltip'

interface IProps {
  greeting: string
  title: string
  des?: string | React.ReactNode
  showShadow?: boolean
}

const Heading = ({ greeting, title, des, showShadow = true }: IProps) => {
  return (
    <div
      className={clsx('w-full rounded-md px-8 py-6', {
        'shadow-sidebar': showShadow === true,
      })}
    >
      <div className="font-medium">
        <h1 className="text-[32px] leading-11 text-[#050505]">
          {greeting}
          <span className="ml-1.5 text-primary">
            <Tooltip title={title}>{truncateString(title, 80)}</Tooltip>
          </span>
        </h1>
      </div>
      {des && (
        <div className="flex w-full">
          <div className="text-medium-sm w-full text-[#050505]">{des}</div>
        </div>
      )}
    </div>
  )
}

export default Heading
