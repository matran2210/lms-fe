import React from 'react'
import { ANIMATION } from '@lms/core'
import { NoCoursesAvailableIcon } from '@lms/assets/icons'

const NoCoursesAvailable = () => {
  return (
    <div
      data-aos={ANIMATION.DATA_AOS}
      className="flex flex-col items-center justify-center"
    >
      <NoCoursesAvailableIcon />
      <div className="text-center text-base font-normal leading-6 text-gray-1">
        No Data Found :(
      </div>
    </div>
  )
}

export default NoCoursesAvailable
