import React from 'react'
import SappIcon from './SappIcon'
import { ANIMATION } from '@lms/core'

const NoData = () => {
  return (
    <div data-aos={ANIMATION.DATA_AOS}>
      <SappIcon icon="nodata" />
      <div className="text-base font-light text-gray">No Data Found</div>
    </div>
  )
}

export default NoData
