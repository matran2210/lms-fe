import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { useRouter } from 'next/router'
import { IEventTest } from 'src/type/event-test'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { AlertTriagle } from '@assets/icons'

enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
}

const EventTest = ({ data }: { data: IEventTest }) => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)

  const timeTakenFormatted = data?.total_attempt_time
    ? formatTime(data?.total_attempt_time)
    : 0
  const timeAllowFormatted = data?.quiz_timed
    ? formatTime(data?.quiz_timed * 60)
    : 'Unlimited'

  /**
   * @description Kiểm tra điều kiện có hiệu lực
   */
  // const isAttemptValid =
  //   data.is_attempt &&
  //   [
  //     EAttemptStatus.SUBMITTED,
  //     EAttemptStatus.UN_FINISHED,
  //     EAttemptStatus.UN_SUBMITTED,
  //   ].includes(data?.attempt_status)

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
                data.is_opened
                  ? router.push({
                      pathname: `/test/${data?.id}`,
                      query: {
                        type: 'event-test',
                      },
                    })
                  : setOpen(true)
              }
            />
          )}
        </div>
      </div>
      <SappModalV3
        open={open}
        okButtonCaption="Quit"
        handleCancel={() => {}}
        onOk={() => {}}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<AlertTriagle />}
        header="Are you sure?"
        content="chuwa dden han"
      />
    </>
  )
}

export default EventTest
