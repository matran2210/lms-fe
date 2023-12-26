import React, { useState } from 'react'
import Link from 'next/link'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { formatTime } from '@components/common/timer'
import EntrancePopup from './EntrancePopup'

interface EntranceTestProps {
  name: string
  startStatus: boolean
  timeTaken: number
  timeAllow: number
  result: string
  id: string
}

const EntranceTest = ({
  name,
  startStatus,
  timeTaken,
  timeAllow,
  result,
  id,
}: EntranceTestProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const handleOnClick = () => {
    setOpen(true)
  }

  const timeTakenFormatted = formatTime(timeTaken)
  const timeAllowFormatted = timeAllow ? formatTime(timeAllow) : 'Unlimited'

  return (
    <>
      <div className="name">
        <h2 className="text-2xl font-semibold mb-4 text-bw-1">{name}</h2>
      </div>
      <div className="mt-auto">
        <div className="info">
          <div className="flex justify-between text-base text-gray-1 capitalize pb-4 border-b border-gray-2">
            {startStatus ? (
              <>
                <p>Time taken:</p>
                <p className="text-bw-1">{timeTakenFormatted}</p>
              </>
            ) : (
              <>
                <p>Time allowed: </p>
                <p className="text-bw-1">{timeAllowFormatted}</p>
              </>
            )}
          </div>
          <div className="flex justify-between text-base text-gray-1 capitalize pt-4">
            <p>Results:</p>
            {startStatus ? (
              <>
                <p className="text-state-success">{result}</p>
              </>
            ) : (
              <span className="text-bw-1">--</span>
            )}
          </div>
        </div>
        <div className="action flex items-center jusity-between relative mt-10">
          {startStatus ? (
            <ButtonSecondary
              title="Detail"
              full={false}
              size={'small'}
              onClick={handleOnClick}
              className="hover:bg-primary hover:text-white ml-auto"
            />
          ) : (
            <ButtonSecondary
              title="Begin"
              full={false}
              size={'small'}
              className="hover:bg-primary hover:text-white ml-auto"
              onClick={handleOnClick}
            />
          )}
        </div>
      </div>
      <EntrancePopup
        open={open}
        setOpen={setOpen}
        entrancePopupContent={{ id }}
      />
    </>
  )
}

export default EntranceTest
