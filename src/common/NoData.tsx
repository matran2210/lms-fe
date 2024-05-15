import React from 'react'
import SappIcon from './SappIcon'
import { ANIMATION } from 'src/constants'

const NoData = () => {
  return (
    <div data-aos={ANIMATION.DATA_AOS}>
      <SappIcon icon="nodata" />
      <div className="font-light text-gray-1 text-base">No Data Found</div>
    </div>
  )
}

export default NoData
