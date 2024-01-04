import React, { useState } from 'react'
import Link from 'next/link'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { formatTime } from '@components/common/timer'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

interface EntrancePopupContentProps {
  name: string
  score: number
  timeAllow: number
  attemps: string
  status: boolean
}

const EntrancePopupContent = ({
  name,
  score,
  timeAllow,
  attemps,
  status,
}: EntrancePopupContentProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const timeAllowFormatted = timeAllow ? formatTime(timeAllow) : 'Unlimited'

  return (
    <>
      <div className="content">
        <div className="info">
          <div className="flex justify-between text-base text-gray-1 capitalize py-6 border-b border-gray-2">
            <p>Name:</p>
            <p className="text-bw-1 font-medium">{name}</p>
          </div>
          <div className="flex justify-between text-base text-gray-1 capitalize py-6 border-b border-gray-2">
            <p>Score:</p>
            <p className="text-bw-1 font-medium">{score}</p>
          </div>
          <div className="flex justify-between text-base text-gray-1 capitalize py-6 border-b border-gray-2">
            <p>Time Allowed:</p>
            <p className="text-bw-1 font-medium">{timeAllowFormatted}</p>
          </div>
          <div className="flex justify-between text-base text-gray-1 capitalize py-6 border-b border-gray-2">
            <p>No of Attempts:</p>
            <p className="text-bw-1 font-medium">{attemps}</p>
          </div>
          <div className="flex justify-between text-base text-gray-1 capitalize py-6 border-b border-gray-2">
            <p>Status:</p>
            <div
              className={`${
                status ? 'text-state-success' : 'text-danger'
              } font-medium`}
            >
              {status ? 'Finished' : 'Unfinished'}
            </div>
          </div>
        </div>
      </div>
      <ResultRowsModal open={open} setOpen={setOpen} />
    </>
  )
}

export default EntrancePopupContent
