import React from 'react'
import { ANIMATION } from 'src/constants'
import { NoDataIconV2 } from '@components/icons'

const NoDataV2 = () => {
  return (
    <div data-aos={ANIMATION.DATA_AOS} className="flex flex-col items-center">
      <NoDataIconV2 />
      <div className="justify-start text-lg font-medium leading-[27px] text-gray">
        No data founded...
      </div>
    </div>
  )
}

export default NoDataV2
