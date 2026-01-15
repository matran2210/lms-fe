import React from 'react'
import Tooltip from '@components/common/Tooltip'
import { truncateString } from '@lms/utils'

interface IProps {
  greeting: string
  title: string
  des?: string | React.ReactNode
}

const Heading = ({ greeting, title, des }: IProps) => {
  return (
    <div className="w-full px-7.5 py-7.5 shadow-sidebar">
      <div>
        <h1 className="line-clamp-1 text-2xl font-light text-gray-800">
          {greeting}
          <span className="ml-1.5 font-medium">
            <Tooltip title={title}>{truncateString(title, 80)}</Tooltip>
          </span>
        </h1>
      </div>
      {des && (
        <div className="mt-4 flex w-full">
          <div className="w-full text-sm text-gray-800">{des}</div>
        </div>
      )}
    </div>
  )
}

export default Heading
