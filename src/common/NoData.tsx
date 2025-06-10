import React from 'react'
import SappIcon from './SappIcon'
import { ANIMATION } from 'src/constants'

const NoData = () => {
  return (
    <div data-aos={ANIMATION.DATA_AOS}>
      <SappIcon icon="nodata" />
      <div className="text-base font-light text-[#A1A1A1]">No Data Found</div>
    </div>
  )
}

export default NoData
