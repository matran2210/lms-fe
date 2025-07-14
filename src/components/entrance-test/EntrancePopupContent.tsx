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
        <div className="info flex flex-col gap-2 pt-6 md:gap-4 md:pt-10">
          <div className="flex justify-between text-base capitalize text-gray">
            <p>Name:</p>
            <p className="line-clamp-2 font-medium text-gray-800">{name}</p>
          </div>
          <div className="flex justify-between text-base capitalize text-gray">
            <p>Number of Questions:</p>
            <p className="font-medium text-gray-800">{total_question || 0}</p>
          </div>
          {/* <div className="flex justify-between text-base capitalize text-gray">
            <p>Score:</p>
            <p className="font-medium text-gray-800">
              {score && score !== null ? score : '--'}
            </p>
          </div> */}
          <div className="flex justify-between text-base capitalize text-gray">
            <p>Time Allowed:</p>
            <p className="font-medium text-gray-800">{timeAllowFormatted}</p>
          </div>
          {/* <div className="flex justify-between text-base capitalize text-gray">
            <p>No of Attempts:</p>
            <p className="font-medium text-gray-800">
              {attemps}/{limit_count}
            </p>
          </div> */}
          {/* <div className="flex justify-between text-base capitalize text-gray">
            <p>Status:</p>
            <div
              className={`${
                status ? 'text-success-600' : 'text-[#d35563]'
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
