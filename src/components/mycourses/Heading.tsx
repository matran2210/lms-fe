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
      className={clsx('w-full px-7.5 py-7.5', {
        'shadow-sidebar': showShadow === true,
      })}
    >
      <div className="font-medium">
        <h1 className="line-clamp-1 text-2xl text-bw-1">
          {greeting}
          <span className="ml-1.5 text-primary">
            <Tooltip title={title}>{truncateString(title, 80)}</Tooltip>
          </span>
        </h1>
      </div>
      {des && (
        <div className="font- mt-4 flex w-full">
          <div className="w-full text-medium-sm text-bw-1">{des}</div>
        </div>
      )}
    </div>
  )
}

export default Heading
