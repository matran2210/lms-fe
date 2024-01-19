import React, { useState } from 'react'
import Link from 'next/link'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { formatTime } from '@components/common/timer'
import EntrancePopup from './EntrancePopup'
import { useRouter } from 'next/router'

interface EntranceTestProps {
  data: any
}

const EntranceTest = ({ data }: EntranceTestProps) => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const handleOnClick = () => {
    if (data.attempt_times >= 1) {
      router.push(`entrance-test/test-result/${data.quiz_attempt_id}`)
    } else {
      setOpen(true)
    }
  }

  const timeTakenFormatted = data?.total_attempt_time
    ? formatTime(data.total_attempt_time * 60)
    : 0
  const timeAllowFormatted = data?.quiz_timed
    ? formatTime(data?.quiz_timed * 60)
    : 'Unlimited'

  return (
    <>
      <div className="name">
        <h2 className="text-2xl font-semibold mb-4 text-bw-1 line-clamp-2">
          {data?.name}
        </h2>
      </div>
      <div className="mt-auto">
        <div className="info">
          <div className="flex justify-between text-base text-gray-1 capitalize pb-4 border-b border-gray-2">
            {data.is_attempt ? (
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
            {data.is_attempt ? (
              <>
                <p className="text-state-success">
                  {data.total_correct_answer + '/' + data.total_question}
                </p>
              </>
            ) : (
              <span className="text-bw-1">--</span>
            )}
          </div>
        </div>
        <div className="action flex items-center jusity-between relative mt-10">
          {data.is_attempt ? (
            data.attempt_status === 'SUBMITTED' || 'UN_FINISHED' ? (
              <ButtonSecondary
                title="Detail"
                full={false}
                size={'small'}
                onClick={handleOnClick}
                className="hover:bg-primary hover:text-white ml-auto"
              />
            ) : (
              <></>
            )
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
        entrancePopupContent={data}
      />
    </>
  )
}

export default EntranceTest
