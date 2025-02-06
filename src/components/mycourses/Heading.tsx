import React from 'react'
import { Tooltip } from 'antd'
import { truncateString } from '@utils/index'
import SappTooltip from 'src/common/SappTooltip'

interface IProps {
  greeting: string
  title: string
  des?: string | React.ReactNode
}

const Heading = ({ greeting, title, des }: IProps) => {
  return (
    <div className="grid w-full grid-cols-2 px-7.5 py-7.5 shadow-sidebar">
      <div className="col-span-2 lg:col-span-1">
        <h1 className="line-clamp-1 text-2xl font-light text-bw-1">
          {greeting}
          <span className="ml-1.5 font-medium">
            <SappTooltip
              title={title}
              showTooltip={(title as string)?.length > 50}
            >
              {truncateString(title, 80)}
            </SappTooltip>
          </span>
        </h1>
      </div>
      <div className="col-span-2 mt-3 flex w-full filter lg:col-span-1 lg:mt-0">
        <div className="w-full text-left text-medium-sm text-bw-1 lg:text-right 2xl-min:text-right">
          {des}
        </div>
      </div>
    </div>
  )
}

export default Heading
