import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'

interface IProps {
  name: string
  timeAllow: string
  attempType: string
  buttonText: string
  pass: boolean
}

const PartFailed = ({
  name,
  timeAllow,
  attempType,
  buttonText,
  pass,
}: IProps) => {
  const formattedTime = formatTime(timeAllow)

  return (
    <>
      <div className={`name-part text-2xl font-semibold`}>
        <h2>{name}</h2>
      </div>
      <div className="info mt-6">
        <div className="time-allow flex justify-between pb-4 border-b border-gray-2">
          <p className="text-base text-gray-1">Time Allowed:</p>
          <p className="text-base text-bw-1 font-semibold">{formattedTime}</p>
        </div>
        <div className="time-allow flex justify-between pt-4">
          <p className="text-base text-gray-1">Attempt:</p>
          <p className="text-base text-bw-1 font-semibold">{attempType}</p>
        </div>
      </div>
      <div className="mt-auto">
        <div className="action flex items-center jusity-end relative">
          {buttonText && (
            <ButtonSecondary
              title={buttonText}
              full={false}
              size={'small'}
              className="hover:bg-primary hover:text-white ml-auto"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default PartFailed
