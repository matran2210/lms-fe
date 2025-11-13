import React from 'react'
import { truncateString } from '@utils/index'
import Tooltip from '@components/common/Tooltip'

interface IProps {
  greeting: string
  title: string
  des?: string | React.ReactNode
}

const Heading = ({ greeting, title, des }: IProps) => {
  return (
    <div className="w-full px-7.5 py-7.5 shadow-sidebar">
      <div>
        <h1 className="line-clamp-1 text-2xl font-light text-bw-1">
          {greeting}
          <span className="ml-1.5 font-medium">
            <Tooltip title={title}>{truncateString(title, 80)}</Tooltip>
          </span>
        </h1>
      </div>
      {des && (
        <div className="mt-4 flex w-full">
          <div className="w-full text-medium-sm text-bw-1">{des}</div>
        </div>
      )}
    </div>
  )
}

export default Heading
