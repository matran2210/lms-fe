import React, { useEffect, useMemo, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { IMyCourseDetail } from 'src/type/courses'
import TestModal from 'src/pages/courses/test'
import SappButton from '@components/base/button/SappButton'
import { useRouter } from 'next/router'
import { Tooltip } from 'antd'
import { convertFractionToPercentage, truncateString } from '@utils/index'
import { roundNumber } from '@utils/helpers'
import { ANIMATION } from 'src/constants'
import { isNull, round } from 'lodash'

const PartFailed = ({
  coursePart,
  class_user_id,
}: {
  coursePart: IMyCourseDetail
  class_user_id?: string
}) => {
  const formattedTime = coursePart?.quiz?.quiz_timed
    ? formatTime(coursePart?.quiz?.quiz_timed * 60)
    : 'Unlimited'
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const checkFinished = useMemo(() => {
    if (isNull(coursePart?.quiz?.attempt)) {
      return false
    }
    if (coursePart?.quiz?.attempt) {
      return true
    }

    return false
  }, [coursePart?.quiz?.attempt])

  // const handleChapterTest = async () => {
  //   try {
  //     await CoursesAPI.learningOutcomeProgress(
  //       router.query.courseId,
  //       coursePart.id,
  //     )
  //   } catch (err) {
  //     toast.error('Cannot progress Test')
  //     throw err
  //   }
  // }
  const quizAttempt = coursePart?.quiz

  const countTimeSpent = (ratio_score: string) => {
    const parts = ratio_score?.split('/')
    const firstPoint = parseInt(parts?.[0] || '0', 10)
    const secondPoint = parseInt(parts?.[1] || '0', 10)
    return roundNumber((firstPoint / secondPoint) * 100) || 0
  }

  const runOutAttemp =
    Number(
      coursePart?.quiz?.attempt?.number_of_attempts /
        coursePart?.quiz?.limit_count,
    ) || 0

  const [isRunoutAttemp, setIsRunoutAttemp] = useState<boolean>(true)

  useEffect(() => {
    if (runOutAttemp >= 1 && coursePart?.quiz?.is_limited === true) {
      setIsRunoutAttemp(false)
    }
  }, [runOutAttemp])

  /**
   * @description check điều kiện pass Final Test
   */
  const passFinalTest =
    round(
      convertFractionToPercentage(
        coursePart?.quiz?.attempt?.ratio_score || '0/0',
      ),
      2,
    ) > coursePart?.quiz?.required_percent_score &&
    coursePart?.course_section_type === 'FINAL_TEST'

  return (
    <>
      <div data-aos={ANIMATION.DATA_AOS}>
        <div className={`name-part text-2xl font-medium h-[60px] line-clamp-2`}>
          {(coursePart?.name as string)?.length > 50 ? (
            <Tooltip title={coursePart?.name} color="#ffffff" placement="top">
              {truncateString(coursePart?.name, 50)}
            </Tooltip>
          ) : (
            <>{coursePart?.name}</>
          )}
        </div>
        <div className="info mt-6">
          {checkFinished && (
            <>
              <div className="time-allow flex justify-between pb-4 border-b border-gray-2 mb-4">
                <p className="text-base text-gray-1">Latest Result:</p>
                <p className="text-base text-bw-1 font-medium">
                  {`${countTimeSpent(coursePart?.quiz?.attempt?.ratio_score)}%`}
                </p>
              </div>
              <div className="time-allow flex justify-between pb-4 border-b border-gray-2 mb-4">
                <p className="text-base text-gray-1">Time Spent:</p>
                <p className="text-base text-bw-1 font-medium">
                  {`${
                    coursePart?.quiz?.quiz_timed
                      ? formatTime(coursePart?.quiz?.quiz_timed || 0 * 60)
                      : 'Unlimited'
                  }` ?? ''}
                </p>
              </div>
            </>
          )}
          <div className="time-allow flex justify-between pb-4 border-b border-gray-2">
            <p className="text-base text-gray-1">Time Allowed:</p>
            <p className="text-base text-bw-1 font-medium">{formattedTime}</p>
          </div>
          <div className="time-allow flex justify-between pt-4">
            <p className="text-base text-gray-1">Attempt:</p>
            <p className="text-base text-bw-1 font-medium">
              {`${quizAttempt?.attempt?.number_of_attempts || 0} / ${
                quizAttempt?.limit_count !== 0
                  ? quizAttempt?.limit_count
                  : 'Unlimited'
              }` ?? ''}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <div className="action flex items-center jusity-end relative">
          {!checkFinished ? (
            !coursePart?.quiz?.is_limited ||
            (coursePart?.quiz?.attempt?.number_of_attempts !==
              coursePart?.quiz?.limit_count &&
              isRunoutAttemp) ? (
              <ButtonSecondary
                disabled={
                  coursePart?.quiz?.is_limited &&
                  coursePart?.quiz?.attempt?.number_of_attempts ===
                    coursePart?.quiz?.limit_count
                }
                title={`Start`}
                full={false}
                size={'small'}
                className={`${
                  coursePart?.quiz?.attempt?.number_of_attempts !==
                    coursePart?.quiz?.limit_count && ''
                } ml-auto`}
                onClick={() => setOpen(true)}
              />
            ) : (
              <></>
            )
          ) : (
            <div className="flex justify-between flex-1">
              {(passFinalTest ||
                coursePart?.course_section_type === 'MID_TERM_TEST') && (
                <SappButton
                  title="Result"
                  isUnderLine
                  color="text"
                  className="font-medium underline !p-0"
                  onClick={() =>
                    router.push(
                      `/courses/test/test-result/${quizAttempt?.attempt?.id}`,
                    )
                  }
                />
              )}

              {(coursePart?.quiz?.is_limited &&
                coursePart?.quiz?.attempt?.number_of_attempts ===
                  coursePart?.quiz?.limit_count) ||
              passFinalTest ? null : (
                <ButtonSecondary
                  title="Retake"
                  full={false}
                  size="small"
                  className={`${
                    coursePart?.quiz?.attempt?.number_of_attempts !==
                      coursePart?.quiz?.limit_count && ''
                  } ml-auto`}
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <TestModal
        open={open}
        setOpen={setOpen}
        title={coursePart?.name}
        data={coursePart}
        class_user_id={class_user_id}
        activeCourse={() => {}}
      />
    </>
  )
}

export default PartFailed
