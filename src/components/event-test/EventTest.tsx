import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { useRouter } from 'next/router'
import { IEventTest } from 'src/type/event-test'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { AlertIcon, IconCongrats } from '@assets/icons'
import { formatDate } from '@utils/helpers'
import { MY_COURSES } from 'src/constants/lang'
import { compareAsc, format } from 'date-fns'

const EventTest = ({ data }: { data: IEventTest }) => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [openSubmitTest, setOpenSubmitTest] = useState(
    localStorage.getItem('openEventTest') === 'true' ? true : false,
  )
  const handleCancelModalSubmitTest = () => {
    setOpenSubmitTest(localStorage.set('openEventTest', 'false'))
  }

  const timeTakenFormatted = data?.total_attempt_time
    ? formatTime(data?.total_attempt_time)
    : 0
  const timeAllowFormatted = data?.quiz_timed
    ? formatTime(data?.quiz_timed * 60)
    : 'Unlimited'

  const currentTime = Date.now()
  const started_at = new Date(data?.started_at)
  const finished_at = new Date(data?.finished_at)

  const resultStartAt = compareAsc(currentTime, started_at)
  const resultFinishAt = compareAsc(currentTime, finished_at)

  function checkEventStatus(
    resultStartAt: number,
    resultFinishAt: number,
    textStart: string,
    textEnd: string,
  ) {
    return resultStartAt === -1
      ? textStart
      : resultFinishAt === 1
        ? textEnd
        : ''
  }

  return (
    <>
      <div className="name">
        <h2 className="mb-5 line-clamp-2 text-2xl font-medium text-bw-1">
          {data?.name}
        </h2>
      </div>
      <div className="mt-auto">
        <div className="info">
          <div className="flex justify-between border-b border-gray-2 pb-4 text-base capitalize text-gray-1">
            {data?.is_attempt ? (
              <>
                <p>Time taken:</p>
                <p className="font-medium text-bw-1">{timeTakenFormatted}</p>
              </>
            ) : (
              <>
                <p>Time allowed: </p>
                <p className="font-medium text-bw-1">{timeAllowFormatted}</p>
              </>
            )}
          </div>
          <div className="flex justify-between pt-4 text-base capitalize text-gray-1">
            <p>Results:</p>
            {data?.is_attempt ? (
              <>
                <p className="text-state-success">
                  {data?.total_correct_answer + '/' + data?.total_question}
                </p>
              </>
            ) : (
              <span className="">--</span>
            )}
          </div>
        </div>
        <div className="action relative mt-10 flex items-center justify-end">
          {!data?.is_attempt && (
            <ButtonSecondary
              title="Begin"
              size="small"
              full={false}
              onClick={() =>
                resultStartAt === -1 || resultFinishAt === 1
                  ? setOpen(true)
                  : router.push({
                      pathname: `/test/${data?.id}`,
                      query: {
                        type: 'event-test',
                      },
                    })
              }
            />
          )}
        </div>
      </div>

      <SappModalV3
        open={open}
        okButtonCaption="Back To Event Test"
        handleCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<AlertIcon />}
        header={checkEventStatus(
          resultStartAt,
          resultFinishAt,
          'Unstarted Event Test',
          'Ended Event Test',
        )}
        content={`This Event Test ${checkEventStatus(resultStartAt, resultFinishAt, 'will start', 'has ended')} on ${formatDate(new Date(resultStartAt === -1 ? data?.started_at : resultFinishAt === 1 ? data?.finished_at : '').toString())}. Please come back later or contact our Support at ${MY_COURSES.hotline}.`}
      />

      <SappModalV3
        open={openSubmitTest}
        okButtonCaption="Back To Event Test"
        handleCancel={handleCancelModalSubmitTest}
        onOk={handleCancelModalSubmitTest}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<IconCongrats />}
        header="Congratulations"
      >
        <div className="mb-1 mt-4 px-1 text-center text-medium-sm xl:mb-7">
          <span className="text-gray-1">Your test results will</span>{' '}
          <span className="text-bw-1">
            be emailed to you on{' '}
            {format(new Date(data.finished_at), 'MMMM dd, yyyy')}
          </span>
          .
          <div className="text-gray-1">
            Please check your email regularly to receive the earliest update.
          </div>
        </div>
      </SappModalV3>
    </>
  )
}

export default EventTest
