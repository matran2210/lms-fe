import React, { useEffect } from 'react'
import { ANIMATION } from 'src/constants'
import { NoCoursesAvailableIcon } from '@components/icons'

const NoCoursesAvailable = () => {

  useEffect(() => {
    document.body.classList.add('overflow-y-hidden')

    return () =>
      document.body.classList.remove('overflow-y-hidden')
  }, [])

  return (
    <div
      data-aos={ANIMATION.DATA_AOS}
      className="short:mt-[-100px] flex flex-col items-center justify-center"
    >
      <NoCoursesAvailableIcon />
      <div className="text-center text-base font-normal leading-6 text-gray-1">
        No Data Found :(
      </div>
    </div>
  )
}

export default NoCoursesAvailable
