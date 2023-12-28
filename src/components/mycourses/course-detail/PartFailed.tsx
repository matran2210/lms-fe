import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { ICourseSection } from 'src/type/courses'
import TestModal from 'src/pages/courses/test'

const PartFailed = ({ coursePart }: { coursePart: ICourseSection }) => {
  const formattedTime = formatTime(coursePart?.quiz?.limit_count || 0)
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={`name-part text-2xl font-semibold`}>
        <div>{coursePart?.name}</div>
      </div>
      <div className="info mt-6">
        <div className="time-allow flex justify-between pb-4 border-b border-gray-2">
          <p className="text-base text-gray-1">Time Allowed:</p>
          <p className="text-base text-bw-1 font-semibold">{formattedTime}</p>
        </div>
        <div className="time-allow flex justify-between pt-4">
          <p className="text-base text-gray-1">Attempt:</p>
          <p className="text-base text-bw-1 font-semibold">
            {coursePart?.quiz?.quiz_timed
              ? coursePart?.quiz?.quiz_timed
              : 'Unlimited'}
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <div className="action flex items-center jusity-end relative">
          <ButtonSecondary
            title={'Retake'}
            full={false}
            size={'small'}
            className="hover:bg-primary hover:text-white ml-auto"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <TestModal
        open={open}
        setOpen={setOpen}
        title={coursePart?.name}
        data={coursePart}
      />
    </>
  )
}

export default PartFailed
