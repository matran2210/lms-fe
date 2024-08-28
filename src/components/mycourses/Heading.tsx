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
    <div className="w-full justify-between px-7.5 py-7.5 shadow-sidebar 2xl-min:flex 2xl-min:py-4.5">
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
      <div className="mt-2 flex filter 2xl-min:mt-0">
        <p className="max-w-[553px] text-medium-sm text-bw-1 2xl-min:text-right">
          {des}
        </p>
      </div>
    </div>
  )
}

export default Heading
