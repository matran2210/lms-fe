import React from 'react'
import { ANIMATION } from 'src/constants'
import { NoDataIconV2 } from '@components/icons'

const NoDataV2 = ({ title = 'No data founded...' }: { title?: string }) => {
  return (
    <div data-aos={ANIMATION.DATA_AOS} className="flex flex-col items-center">
      <NoDataIconV2 />
      <div className="justify-start text-lg font-medium leading-[27px] text-gray">
        {title}
      </div>
    </div>
  )
}

export default NoDataV2
