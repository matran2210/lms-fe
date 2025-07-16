import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import { trackGAEvent } from '@utils/google-analytics'
import { roundNumber } from '@utils/helpers'
import { useEffect, useMemo, useState } from 'react'
import router from 'next/router'
import { GRADE_STATUS, GRADING_METHOD, TEST_TYPE } from 'src/constants'
import TestModal from 'src/pages/courses/test'
import { IMyCourseDetail } from 'src/type/courses'
import ResultCourse from './CourseResult'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { ConfirmIcon } from '@assets/icons'
import { useCourseContext } from '@contexts/index'
import ButtonText from '@components/base/button/ButtonText'
import CardCourse from '@components/common/CardCourse/CardCourse'
import { EAttemptStatus } from 'src/constants/attempt'

const PartFailed = ({
  coursePart,
  class_user_id,
  is_passed_course,
  isLock = false,
  lastElementRef,
}: {
  coursePart: IMyCourseDetail
  class_user_id?: string
  is_passed_course: boolean
  isLock?: boolean
  lastElementRef: (node: HTMLDivElement) => void
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
  const [selectedResult, setSelectedResult] = useState<{
    label: string
    value: string
    ratio_score?: string
    status: string
    score: number
  }>()

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

  const isManualGradingAndNotFinishedGrading =
    coursePart?.quiz?.grading_method === GRADING_METHOD.MANUAL &&
    coursePart?.quiz?.attempt?.grading_status !== GRADE_STATUS.FINISHED_GRADING

  const handleRedirectResult = () => {
    if (
      isManualGradingAndNotFinishedGrading &&
      coursePart?.quiz?.attempt?.grading_status ===
        GRADE_STATUS.AWAITING_GRADING
    ) {
      router.push(
        `/courses/test/your-answers-detail/${quizAttempt?.attempt?.id}`,
      )
    } else if (
      isManualGradingAndNotFinishedGrading &&
      coursePart?.quiz?.attempt?.grading_status !==
        GRADE_STATUS.AWAITING_GRADING
    ) {
      if (quizAttempt?.attempt && quizAttempt?.attempt?.id) {
        router.push(`/courses/test/test-result/${quizAttempt?.attempt?.id}`)
      }
    } else {
      router.push({
        pathname: `/courses/test/test-result/${selectedResult?.value}`,
        query: { attempt: selectedResult?.label },
      })
    }
    trackGAEvent(`Click Button Result ${showTitleFinalTest}`)
  }

  const titleButtonViewResult = () => {
    return coursePart?.quiz?.attempt?.grading_status ===
      GRADE_STATUS.AWAITING_GRADING
      ? 'Your Answers'
      : 'Result'
  }

  // const handleClickTitle = () => {
  //   if (coursePart?.course_section_link_parents?.[0]?.is_preview_locked) {
  //     setOpenPopupCTA({
  //       lockSection: true,
  //       ctaUpgrade: false,
  //       thankYou: false,
  //       thankYouLater: false,
  //     })
  //   } else {
  //     setOpen(true)
  //   }
  //   trackGAEvent(`Click Title ${showTitleFinalTest}`)
  // }

  return (
    <>
      <CardCourse
        attemptStatus={
          (coursePart?.quiz?.attempt?.status ||
            'UN_SUBMITTED') as EAttemptStatus
        }
        title={coursePart?.name}
        key={coursePart?.id}
        ref={lastElementRef}
        classNameTitle={`h-12 md:h-16 font-medium`}
        classNameCard="lg:min-h-[444px] md:min-h-[428px] min-h-[250px]"
        isLock={isLock}
      >
        <div className="flex h-full flex-1 flex-col justify-between">
          <div className="info border-gray-2 mb-6 mt-4 border-l pl-4 md:mt-6">
            {checkFinished && (
              <>
                <div className="time-allow mb-2 flex justify-between md:mb-4">
                  <p className="text-sm text-gray md:text-base">Time Spent:</p>
                  <p className="text-sm font-medium text-gray-800 md:text-base">
                    {!!coursePart?.quiz?.attempt?.total_attempt_time
                      ? formatTime(
                          coursePart?.quiz?.attempt?.total_attempt_time,
                        )
                      : '--'}
                  </p>
                </div>
                <div className="time-allow mb-4 flex justify-between">
                  <p className="text-sm text-gray md:text-base">
                    Latest Results:
                  </p>
                  <p className="text-sm font-medium text-gray-800 md:text-base">
                    {isManualGradingAndAwaitGrading
                      ? '--'
                      : coursePart?.quiz?.attempt?.score !== undefined &&
                          coursePart?.quiz?.attempt?.score !== null
                        ? `${coursePart?.quiz?.attempt?.score}%`
                        : '--'}
                  </p>
                </div>
              </>
            )}
            <div className="time-allow mb-2 flex justify-between md:mb-4">
              <p className="text-sm text-gray md:text-base">Time Allowed:</p>
              <p className="text-sm font-medium text-gray-800 md:text-base">
                {formattedTime}
              </p>
            </div>
            <div className="time-allow flex items-center justify-between">
              <p className="text-sm text-gray-800 md:text-base">
                <ResultCourse
                  class_user_id={class_user_id}
                  coursePart={coursePart}
                  setOpenReport={setOpenReport}
                  selectedResult={selectedResult}
                  setSelectedResult={setSelectedResult}
                />
              </p>
              {
                <p className="text-sm font-medium text-gray-800 md:text-base">
                  {selectedResult?.score || 0}%
                </p>
              }
            </div>
          </div>

          <div className="action flex items-center justify-end">
            {!checkFinished ? (
              !coursePart?.quiz?.is_limited ||
              (coursePart?.quiz?.attempt?.number_of_attempts !==
                coursePart?.quiz?.limit_count &&
                isRunoutAttemp) ? (
                <ButtonSecondary
                  size="medium"
                  disabled={
                    coursePart?.quiz?.is_limited &&
                    coursePart?.quiz?.attempt?.number_of_attempts ===
                      coursePart?.quiz?.limit_count
                  }
                  title={`Start`}
                  className={`${
                    coursePart?.quiz?.attempt?.number_of_attempts !==
                      coursePart?.quiz?.limit_count && ''
                  } ml-auto w-full md:w-auto`}
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
              <div className="flex flex-1 items-center justify-end gap-4">
                {quizAttempt.id && (
                  <ButtonText
                    size="medium"
                    title={titleButtonViewResult()}
                    onClick={handleRedirectResult}
                  />
                )}

                {isShowButtonAction() && (
                  <ButtonSecondary
                    size="medium"
                    title={renderOkButtonCaption()}
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
      </CardCourse>
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
