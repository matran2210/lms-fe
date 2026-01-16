import React from 'react'
import { ANIMATION } from '@lms/core'
import { NoDataIcon } from '@lms/assets'

const NoData = ({ title = 'No data founded...' }: { title?: string }) => {
  return (
    <div data-aos={ANIMATION.DATA_AOS} className="flex flex-col items-center">
      <NoDataIcon className="size-[150px] md:size-[203px]" />
      <div className="justify-start text-sm font-medium text-gray md:text-lg">
        {title}
      </div>
    </div>
  )
}

export default NoData
