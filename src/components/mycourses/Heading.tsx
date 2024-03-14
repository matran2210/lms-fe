import React, { useState } from 'react'
import { Tooltip } from 'antd'
import { truncateString } from '@utils/index'
import { ANIMATION } from 'src/constants'

interface IProps {
  greeting: string
  title: string
  des?: string
}

const Heading = ({ greeting, title, des }: IProps) => {
  return (
    <div className="2xl-min:flex justify-between 2xl-min:py-4.5 py-7.5 px-7.5 w-full shadow-md">
      <h1 className="text-2xl font-light text-bw-1 line-clamp-1">
        {greeting}
        <span className="font-medium ml-1.5">
          {(title as string)?.length > 50 ? (
            <Tooltip title={title} color="#ffffff" placement="bottom">
              {truncateString(title, 80)}
            </Tooltip>
          ) : (
            <>{title}</>
          )}
        </span>
      </h1>
      <div className="filter flex 2xl-min:mt-0 mt-2">
        <p className="text-bw-1 text-medium-sm 2xl-min:text-right max-w-[553px]">
          {des}
        </p>
      </div>
    </div>
  )
}

export default Heading
