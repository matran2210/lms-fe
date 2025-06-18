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
      className={clsx('w-full rounded-md md:p-6 lg:px-8 lg:py-6', {
        'shadow-sidebar': showShadow === true,
      })}
    >
      <div className="mb-1 font-medium md:text-[28px] lg:text-3xl">
        <h1 className="text-gray-800">
          {greeting}
          <span className="ml-1.5 text-primary">
            <Tooltip title={title}>{truncateString(title, 80)}</Tooltip>
          </span>
        </h1>
      </div>
      {des && (
        <div className="flex w-full">
          <div className="w-full text-sm text-gray-800">{des}</div>
        </div>
      )}
    </div>
  )
}

export default Heading
