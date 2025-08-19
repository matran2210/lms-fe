import Image from 'next/image'
import React, { HTMLAttributes } from 'react'

interface IGlobalAverage extends HTMLAttributes<HTMLDivElement> {
  globalAverage: number
}
const GlobalAverage = ({ globalAverage, ...props }: IGlobalAverage) => {
  return (
    <div className={`flex items-center gap-2`} {...props}>
      <Image
        src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
        width={20}
        height={20}
        alt="Globe"
      />
      <div className={`text-sm text-gray-800 md:text-base`}>
        Global Average {globalAverage}%
      </div>
    </div>
  )
}

export default GlobalAverage
