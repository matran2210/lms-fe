import React from 'react'
import { ANIMATION } from '@lms/core'
// import { NoDataIconV2 } from '@components/icons'comment monorepo

const NoDataV2 = ({ title = 'No data founded...' }: { title?: string }) => {
  return (
    <div data-aos={ANIMATION.DATA_AOS} className="flex flex-col items-center">
      {/* <NoDataIconV2 /> */}
      <div className="justify-start text-sm font-medium text-gray md:text-lg">
        {title}
      </div>
    </div>
  )
}

export default NoDataV2
