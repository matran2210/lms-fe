import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SappButton from '@components/base/button/SappButton'
import { formatTime } from '@components/common/timer'
import { useCourseContext } from '@contexts/index'
import { trackGAEvent } from '@utils/google-analytics'
import { roundNumber } from '@utils/helpers'
import { convertFractionToPercentage, truncateString } from '@utils/index'
import { isNull, round } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import SappTooltip from 'src/common/SappTooltip'
import { ANIMATION, COURSE_TYPE, TEST_TYPE } from 'src/constants'
import TestModal from 'src/pages/courses/test'
import { IMyCourseDetail } from 'src/type/courses'

const PartFailed = ({
  coursePart,
  class_user_id,
  is_passed_course,
}: {
  coursePart: IMyCourseDetail
  class_user_id?: string
  is_passed_course: boolean
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

  const { courseType } = useCourseContext()

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
    coursePart?.course_section_type === 'FINAL_TEST' &&
    courseType === 'FOUNDATION_COURSE'

  const showTitleFinalTest =
    coursePart?.course_section_type === TEST_TYPE.FINAL_TEST
      ? 'Final Test'
      : 'MidTerm Test'

  const shouldShowResultButton = () => {
    const testTypes = new Set([
      TEST_TYPE.FINAL_TEST,
      TEST_TYPE.MID_TERM_TEST,
      TEST_TYPE.MOCK_TEST,
    ])
    return (
      passFinalTest ||
      (coursePart?.course_section_type === TEST_TYPE.FINAL_TEST &&
        courseType !== COURSE_TYPE.FOUNDATION_COURSE) ||
      testTypes.has(coursePart?.course_section_type as TEST_TYPE)
    )
  }

  return (
    <>
      <div data-aos={ANIMATION.DATA_AOS}>
        <div
          className={`name-part line-clamp-2 h-[60px] cursor-pointer text-2xl font-medium`}
          onClick={() => {
            setOpen(true)
            trackGAEvent(`Click Title ${showTitleFinalTest}`)
          }}
        >
          <SappTooltip
            title={coursePart?.name}
            showTooltip={(coursePart?.name as string)?.length > 40}
          >
            {truncateString(coursePart?.name, 40)}
          </SappTooltip>
        </div>
        <div className="info mt-6">
          {checkFinished && (
            <>
              <div className="time-allow mb-4 flex justify-between border-b border-gray-2 pb-4">
                <p className="text-base text-gray-1">Latest Results:</p>
                <p className="text-base font-medium text-bw-1">
                  {`${countTimeSpent(coursePart?.quiz?.attempt?.ratio_score)}%`}
                </p>
              </div>
              <div className="time-allow mb-4 flex justify-between border-b border-gray-2 pb-4">
                <p className="text-base text-gray-1">Time Spent:</p>
                <p className="text-base font-medium text-bw-1">
                  {`${
                    coursePart?.quiz?.quiz_timed
                      ? formatTime(coursePart?.quiz?.quiz_timed || 0 * 60)
                      : 'Unlimited'
                  }`}
                </p>
              </div>
            </>
          )}
          <div className="time-allow flex justify-between border-b border-gray-2 pb-4">
            <p className="text-base text-gray-1">Time Allowed:</p>
            <p className="text-base font-medium text-bw-1">{formattedTime}</p>
          </div>
          <div className="time-allow flex justify-between pt-4">
            <p className="text-base text-gray-1">Attempt:</p>
            <p className="text-base font-medium text-bw-1">
              {`${quizAttempt?.attempt?.number_of_attempts || 0} / ${
                quizAttempt?.limit_count !== 0
                  ? quizAttempt?.limit_count
                  : 'Unlimited'
              }`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <div className="action jusity-end relative flex items-center">
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
                onClick={() => {
                  setOpen(true)
                  trackGAEvent(`Click Button Start ${showTitleFinalTest}`)
                }}
              />
            ) : (
              <></>
            )
          ) : (
            <div className="flex flex-1 justify-between">
              {shouldShowResultButton() && (
                <SappButton
                  title="Result"
                  isUnderLine
                  color="text"
                  className="!p-0 font-medium underline"
                  onClick={() => {
                    router.push(
                      `/courses/test/test-result/${quizAttempt?.attempt?.id}`,
                    )
                    trackGAEvent(`Click Button Result ${showTitleFinalTest}`)
                  }}
                />
              )}

              {coursePart?.quiz?.is_limited &&
              coursePart?.quiz?.attempt?.number_of_attempts ===
                coursePart?.quiz?.limit_count ? null : (
                <ButtonSecondary
                  title="Retake"
                  full={false}
                  size="small"
                  className={`${
                    coursePart?.quiz?.attempt?.number_of_attempts !==
                      coursePart?.quiz?.limit_count && ''
                  } ml-auto`}
                  onClick={() => {
                    setOpen(true)
                    trackGAEvent(`Click Button Retake ${showTitleFinalTest}`)
                  }}
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
        is_passed_course={is_passed_course}
        activeCourse={() => {}}
      />
    </>
  )
}

export default PartFailed
