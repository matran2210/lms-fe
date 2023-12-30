import React, { useMemo, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { ICourseSection } from 'src/type/courses'
import TestModal from 'src/pages/courses/test'

const PartFailed = ({ coursePart }: { coursePart: ICourseSection }) => {
  const formattedTime = formatTime(coursePart?.quiz?.quiz_timed * 60 || 0)
  const [open, setOpen] = useState(false)
  const checkFinished = useMemo(() => {
    if (coursePart?.quiz?.attempts?.length === 0) {
      return true
    }
    for (let i in coursePart?.quiz?.attempts) {
      if (coursePart?.quiz?.attempts[i].status === 'SUBMITTED') {
        return true
      }
    }
    return false
  }, [coursePart?.quiz?.attempts])
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
            {coursePart?.quiz?.is_limited
              ? coursePart?.quiz?.limit_count
              : 'Unlimited'}
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <div className="action flex items-center jusity-end relative">
          {coursePart?.quiz?.attempts?.length !==
            coursePart?.quiz?.limit_count && (
            <ButtonSecondary
              disabled={
                coursePart?.quiz?.attempts?.length ===
                coursePart?.quiz?.limit_count
              }
              title={`${checkFinished ? 'Retake' : 'Start'}`}
              full={false}
              size={'small'}
              className={`${
                coursePart?.quiz?.attempts?.length !==
                  coursePart?.quiz?.limit_count &&
                'hover:bg-primary hover:text-white'
              } ml-auto`}
              onClick={() => setOpen(true)}
            />
          )}
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
