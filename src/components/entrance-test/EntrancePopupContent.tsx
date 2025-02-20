import React, { useState } from 'react'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { formatTime } from '@components/common/timer'

interface EntrancePopupContentProps {
  name: string
  timeAllow: number
  attemps: string
  limit_count: number
  total_question: number
}

const EntrancePopupContent = ({
  name,
  timeAllow,
  attemps,
  limit_count,
  total_question,
}: EntrancePopupContentProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const timeAllowFormatted = timeAllow
    ? formatTime(timeAllow * 60)
    : 'Unlimited'

  return (
    <>
      <div className="content">
        <div className="info">
          <div className="flex justify-between border-b border-gray-2 py-6 text-base capitalize text-gray-1">
            <p>Name:</p>
            <p className="line-clamp-2 font-medium text-bw-1">{name}</p>
          </div>
          <div className="flex justify-between border-b border-gray-2 py-6 text-base capitalize text-gray-1">
            <p>Number of Questions:</p>
            <p className="font-medium text-bw-1">{total_question || 0}</p>
          </div>
          {/* <div className="flex justify-between border-b border-gray-2 py-6 text-base capitalize text-gray-1">
            <p>Score:</p>
            <p className="font-medium text-bw-1">
              {score && score !== null ? score : '--'}
            </p>
          </div> */}
          <div className="flex justify-between border-b border-gray-2 py-6 text-base capitalize text-gray-1">
            <p>Time Allowed:</p>
            <p className="font-medium text-bw-1">{timeAllowFormatted}</p>
          </div>
          <div className="flex justify-between border-b border-gray-2 py-6 text-base capitalize text-gray-1">
            <p>No of Attempts:</p>
            <p className="font-medium text-bw-1">
              {attemps}/{limit_count}
            </p>
          </div>
          {/* <div className="flex justify-between py-6 text-base capitalize text-gray-1">
            <p>Status:</p>
            <div
              className={`${
                status ? 'text-state-success' : 'text-danger'
              } font-medium`}
            >
              {status ? 'Finished' : 'Unfinished'}
            </div>
          </div> */}
        </div>
      </div>
      <ResultRowsModal open={open} setOpen={setOpen} />
    </>
  )
}

export default EntrancePopupContent
