import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { trackGAEvent } from '@utils/google-analytics'
import { roundNumber } from '@utils/helpers'
import { truncateString } from '@utils/index'
import { useEffect, useMemo, useState } from 'react'
import Tooltip from 'src/common/Tooltip'
import {
  ANIMATION,
  GRADE_STATUS,
  GRADING_METHOD,
  TEST_TYPE,
} from 'src/constants'
import TestModal from 'src/pages/courses/test'
import { IMyCourseDetail } from 'src/type/courses'
import ResultCourse from './CourseResult'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { ConfirmIcon, LockClosedIcon } from '@assets/icons'
import { useCourseContext } from '@contexts/index'

const PartFailed = ({
  coursePart,
  class_user_id,
  is_passed_course,
  isTeacher,
}: {
  coursePart: IMyCourseDetail
  class_user_id?: string
  is_passed_course: boolean
  isTeacher: boolean
}) => {
  const isSubmitted =
    coursePart?.quiz?.attempt &&
    coursePart?.quiz?.attempt?.status === 'SUBMITTED'
  const isUnsubmitted =
    coursePart?.quiz?.attempt &&
    coursePart?.quiz?.attempt?.status === 'UN_SUBMITTED'
  const isContinue =
    !coursePart?.quiz?.attempt ||
    (coursePart?.quiz?.attempt &&
      coursePart?.quiz?.attempt?.status === 'IN_PROGRESS')
  const quizAttempt = coursePart?.quiz
  const [open, setOpen] = useState(false)
  const [isRunoutAttemp, setIsRunoutAttemp] = useState<boolean>(true)
  const [openReport, setOpenReport] = useState<boolean>(false)

  const isManualGradingAndAwaitGrading =
    quizAttempt?.grading_method === GRADING_METHOD.MANUAL &&
    quizAttempt?.attempt?.grading_status === GRADE_STATUS.AWAITING_GRADING
  const formattedTime = coursePart?.quiz?.quiz_timed
    ? formatTime(coursePart?.quiz?.quiz_timed * 60)
    : 'Unlimited'

  const checkFinished = useMemo(() => {
    if (coursePart?.quiz?.attempt) {
      return true
    }
    return false
  }, [coursePart?.quiz?.attempt])

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

  const showTitleFinalTest =
    coursePart?.course_section_type === TEST_TYPE.FINAL_TEST
      ? 'Final Test'
      : 'MidTerm Test'

  useEffect(() => {
    if (runOutAttemp >= 1 && coursePart?.quiz?.is_limited === true) {
      setIsRunoutAttemp(false)
    }
  }, [runOutAttemp])

  const { setOpenPopupCTA } = useCourseContext()

  const isShowButtonAction = () => {
    // Case:  Unlimited time attempt
    if (!coursePart?.quiz?.is_limited) return true

    // Case: Limited time attempt
    if (coursePart?.quiz?.is_limited && !!coursePart?.quiz?.limit_count) {
      // & Case: Not Attempt
      if (!coursePart?.quiz?.attempt) return true

      // & Case: Last attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts ===
          coursePart?.quiz?.limit_count &&
        !isSubmitted
      )
        return true

      // & Case: has more than 1 attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts <
        coursePart?.quiz?.limit_count
      )
        return true
    }
    return false
  }
  const renderOkButtonCaption = () => {
    // // Case: Unlimited time attempt and submitted
    if (!coursePart?.quiz?.is_limited && (isSubmitted || isUnsubmitted))
      return 'Retake'
    // Case: Unlimited time attempt and continue
    if (!coursePart?.quiz?.is_limited && isContinue) return 'Continue'
    // Case: Limited time attempt
    if (coursePart?.quiz?.is_limited && !!coursePart?.quiz?.limit_count) {
      // & Case: Not Attempt
      if (!coursePart?.quiz?.attempt) return 'Retake'

      // & Case: Last attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts ===
        coursePart?.quiz?.limit_count
      )
        return 'Continue'
      // & Case: has more than 1 attempt
      if (
        coursePart?.quiz?.attempt?.number_of_attempts <
        coursePart?.quiz?.limit_count
      )
        return 'Retake'
    }
    return ''
  }
  return (
    <>
      <div data-aos={ANIMATION.DATA_AOS}>
        {coursePart?.course_section_link_parents?.[0]?.is_preview_locked ? (
          <div className="flex justify-between">
            <div
              className={`name-part line-clamp-2 h-[60px] cursor-pointer text-2xl font-medium`}
              onClick={() => {
                // setOpen(true)
                // trackGAEvent(`Click Title ${showTitleFinalTest}`)
              }}
            >
              <Tooltip
                title={coursePart?.name}
                showTooltip={(coursePart?.name as string)?.length > 40}
              >
                {truncateString(coursePart?.name, 40)}
              </Tooltip>
            </div>
            <div>
              <LockClosedIcon />
            </div>
          </div>
        ) : (
          <div
            className={`name-part line-clamp-2 h-[60px] cursor-pointer text-2xl font-medium`}
            onClick={() => {
              if (
                coursePart?.course_section_link_parents?.[0]?.is_preview_locked
              ) {
                setOpenPopupCTA({
                  lockSection: true,
                  ctaUpgrade: false,
                  thankYou: false,
                  thankYouLater: false,
                })
              } else {
                setOpen(true)
              }
              trackGAEvent(`Click Title ${showTitleFinalTest}`)
            }}
          >
            <Tooltip
              title={coursePart?.name}
              showTooltip={(coursePart?.name as string)?.length > 40}
            >
              {truncateString(coursePart?.name, 40)}
            </Tooltip>
          </div>
        )}

        <div className="info mt-6">
          {checkFinished && (
            <>
              <div className="time-allow mb-4 flex justify-between border-b border-gray-2 pb-4">
                <p className="text-base text-gray-1">Latest Results:</p>
                <p className="text-base font-medium text-bw-1">
                  {isManualGradingAndAwaitGrading
                    ? '--'
                    : coursePart?.quiz?.attempt?.score !== undefined &&
                        coursePart?.quiz?.attempt?.score !== null
                      ? `${coursePart?.quiz?.attempt?.score}%`
                      : '--'}
                </p>
              </div>
              <div className="time-allow mb-4 flex justify-between border-b border-gray-2 pb-4">
                <p className="text-base text-gray-1">Time Spent:</p>
                <p className="text-base font-medium text-bw-1">
                  {!!coursePart?.quiz?.attempt?.total_attempt_time
                    ? formatTime(coursePart?.quiz?.attempt?.total_attempt_time)
                    : '--'}
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
                  if (
                    coursePart?.course_section_link_parents?.[0]
                      ?.is_preview_locked
                  ) {
                    setOpenPopupCTA({
                      lockSection: true,
                      ctaUpgrade: false,
                      thankYou: false,
                      thankYouLater: false,
                    })
                  } else {
                    setOpen(true)
                  }
                  trackGAEvent(`Click Button Start ${showTitleFinalTest}`)
                }}
              />
            ) : (
              <></>
            )
          ) : (
            <div className="flex flex-1 justify-between">
              {quizAttempt.id && (
                <ResultCourse
                  class_user_id={class_user_id}
                  coursePart={coursePart}
                  quizAttempt={quizAttempt}
                  setOpenReport={setOpenReport}
                  trackGA={() => {
                    trackGAEvent(`Click Button Result ${showTitleFinalTest}`)
                  }}
                  isTeacher={isTeacher}
                />
              )}

              {isShowButtonAction() && (
                <ButtonSecondary
                  title={renderOkButtonCaption()}
                  full={false}
                  size="small"
                  color="quizActivity"
                  className="ml-auto max-h-8"
                  onClick={() => {
                    if (
                      coursePart?.course_section_link_parents?.[0]
                        ?.is_preview_locked
                    ) {
                      setOpenPopupCTA({
                        lockSection: true,
                        ctaUpgrade: false,
                        thankYou: false,
                        thankYouLater: false,
                      })
                    } else {
                      setOpen(true)
                    }
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
      <SappModalV3
        open={openReport}
        okButtonCaption="Back"
        handleCancel={() => {}}
        onOk={() => {
          setOpenReport(false)
        }}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<ConfirmIcon />}
        header="Awating Grading"
        content={`Your test is currently being graded. The result will be sent to you via email as soon as the grading is complete.`}
      />
    </>
  )
}

export default PartFailed
