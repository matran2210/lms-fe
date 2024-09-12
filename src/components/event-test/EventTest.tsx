import React, { useEffect, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { useRouter } from 'next/router'
import { IEventTest } from 'src/type/event-test'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { AlertIcon, IconCongrats } from '@assets/icons'
import { formatDate } from '@utils/helpers'
import { MY_COURSES } from 'src/constants/lang'
import { compareAsc, format } from 'date-fns'
import Icon from '@components/icons'
import ContentTestCongratution from './ContentTestCongratution'
import { useCourseContext } from '@contexts/index'

const EventTest = ({ data }: { data: IEventTest }) => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const { setSubmitEventTest, submitEventTest } = useCourseContext()

  const handleCancelModalSubmitTest = () => {
    setSubmitEventTest(false)
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

  const renderContentPopup = (type: string) => {
    switch (type) {
      case 'ACCA':
        return (
          <ContentTestCongratution
            text1="Your test results will"
            text2="be emailed to you on October 04, 2024"
            text3="Please check your email regularly to receive the earliest update."
          />
        )
      case 'CMA':
        return (
          <ContentTestCongratution
            text1="Your results for Round 1 will"
            text2="be emailed to you on September 28, 2024"
            text3="Please remember to check your inbox to ensure you don’t miss the update."
          />
        )
      case 'CFA':
        return (
          <ContentTestCongratution
            text1="Your results for Round 1 will"
            text2="be emailed to you on September 27 - 30, 2024"
            text3="Please remember to check your inbox to ensure you don’t miss the update."
          />
        )
      default:
        return (
          <ContentTestCongratution
            text1="Your test results will"
            text2="be emailed to you on October 04, 2024"
            text3="Please check your email regularly to receive the earliest update."
          />
        )
    }
  }

  const resultDate = (category: string) => {
    switch (category) {
      case 'ACCA':
        return '04/10/2024'

      case 'CFA':
        return '27-30/09/2024'

      case 'CMA':
        return '28/09/2024'
      default:
        break
    }
  }

  const getEventTestStatus = (
    textDoneAttempt: string | number | any,
    textNotAttempt: string | number,
    textExpired: string | number,
  ) => {
    if (data?.is_attempt) {
      return textDoneAttempt
    } else if (resultFinishAt === 1 && !data?.is_attempt) {
      return textExpired
    } else if (!data?.is_attempt) {
      return textNotAttempt
    } else {
      return ''
    }
  }

  function getTextColor(colorDefault: string) {
    return resultFinishAt === 1 && !data?.is_attempt
      ? 'text-gray-2'
      : colorDefault
  }

  return (
    <>
      <div className="name">
        <h2
          className={`mb-5 line-clamp-2 text-2xl font-medium ${getTextColor('text-bw-1')}`}
        >
          {data?.name}
        </h2>
      </div>
      <div>
        <div className="info">
          <div
            className={`flex justify-between border-b border-gray-2 pb-4 text-base capitalize ${getTextColor('text-gray-1')}`}
          >
            <p>
              {getEventTestStatus(
                'Time taken:',
                'Time allowed:',
                'Start Date:',
              )}
            </p>
            <p className={`font-medium ${getTextColor('text-bw-1')}`}>
              {getEventTestStatus(
                timeTakenFormatted,
                timeAllowFormatted,
                format(new Date(data?.started_at), 'dd/MM/yyyy'),
              )}
            </p>
          </div>
          <div
            className={`flex justify-between pt-4 text-base capitalize ${getTextColor('text-gray-1')}`}
          >
            <p>
              {getEventTestStatus(
                'Results Release Date:',
                'No of Questions:',
                'End Date:',
              )}
            </p>
            <p className={`font-medium ${getTextColor('text-bw-1')}`}>
              {getEventTestStatus(
                resultDate(data?.course_category?.name),
                data?.quiz_question_instances?.length,
                format(new Date(data?.finished_at), 'dd/MM/yyyy'),
              )}
            </p>
          </div>
        </div>
        <div className="action relative mt-10 flex min-h-[32px] items-center justify-between">
          <div className="text flex items-center">
            <Icon
              type={`${data?.is_attempt ? 'completed' : resultFinishAt === 1 && !data?.is_attempt ? 'expired' : !data?.is_attempt ? 'like' : ''}`}
              className={`relative ${getTextColor('text-bw-1')}`}
            />
            <p
              className={`ml-px pl-2 text-medium-sm font-medium ${getTextColor('text-bw-1')}`}
            >
              {data?.is_attempt
                ? 'Completed'
                : resultFinishAt === 1 && !data?.is_attempt
                  ? 'Expired'
                  : !data?.is_attempt
                    ? 'Take Your Test '
                    : ''}
            </p>
          </div>
          {!data?.is_attempt && resultFinishAt !== 1 && (
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
        okButtonCaption="Back"
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
      >
        <div className="mb-1 mt-4 text-center text-medium-sm text-gray-1 2xl:mb-11">
          This Event Test{' '}
          {checkEventStatus(
            resultStartAt,
            resultFinishAt,
            'will start',
            'has ended',
          )}{' '}
          on{' '}
          <span className="font-semibold text-bw-1">
            {formatDate(
              new Date(
                resultStartAt === -1
                  ? data?.started_at
                  : resultFinishAt === 1
                    ? data?.finished_at
                    : '',
              ).toString(),
            )}
          </span>
          . Please come back later or contact our Support at{' '}
          {MY_COURSES.hotline}.
        </div>
      </SappModalV3>

      <SappModalV3
        open={submitEventTest}
        okButtonCaption="Back To Event Test"
        handleCancel={handleCancelModalSubmitTest}
        onOk={handleCancelModalSubmitTest}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<IconCongrats />}
        header="Congratulations"
      >
        {renderContentPopup(
          JSON.parse(localStorage.getItem('category') as any),
        )}
      </SappModalV3>
    </>
  )
}

export default EventTest
