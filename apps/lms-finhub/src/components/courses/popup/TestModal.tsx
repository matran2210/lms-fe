import { ArrowDownIcon } from '@lms/assets'
import {
  GRADE_STATUS,
  GRADING_METHOD,
  IQuizResultList,
  STATUS_QUIZ_TEST,
  TEST_TYPE_LABELS,
} from '@lms/core'
import {
  PopupCanNotRetakeTest,
  StatusTestQuizBadge,
  TestAnnouncementModal,
  TestPopup,
} from '@lms/feature-courses'
import { ButtonPrimary, ButtonSecondary, ButtonText } from '@lms/ui'
import { capitalizeFirstLetter, formatTimer, isQuizExpired, trackGAEvent } from '@lms/utils'
import { Select } from 'antd'
import dayjs from 'dayjs'
import { isNull } from 'lodash'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ClassAPI } from 'src/api/class'
import { TestServiceAPI } from 'src/api/test-api'

enum StatusQuizAttempt {
  Passed = 'PASSED',
  Failed = 'FAILED',
  Unsubmitted = 'UN_SUBMITTED',
  Submitted = 'SUBMITTED',
}

type QuizResult = {
  label: string
  value: string
  ratio_score?: string
  status: string
  grading_method?: string
  created_at?: Date
  number_of_attempt?: number
}

const defaultQuizResult: QuizResult = {
  label: '',
  value: '',
  status: '',
  ratio_score: undefined,
  grading_method: undefined,
  created_at: undefined,
  number_of_attempt: undefined,
}

const defaultResultList = {
  metadata: {
    page_index: 1,
    page_size: 10,
    total_pages: 0,
    total_records: 0,
  },
  data: [],
}
interface IProps {
  open: boolean
  setOpen: any
  title?: string
  data?: any
  class_user_id?: string
  activeCourse?: any
  is_passed_course?: boolean
}

const TestModal = ({
  open,
  setOpen,
  data,
  class_user_id,
  activeCourse,
  is_passed_course,
}: IProps) => {
  console.log('class_user_id',class_user_id)
  const router = useRouter()
  const isSubmitted =
    data?.quiz?.attempt && data?.quiz?.attempt?.status === 'SUBMITTED'
  const isUnsubmitted =
    data?.quiz?.attempt && data?.quiz?.attempt?.status === 'UN_SUBMITTED'
  const isContinue =
    // !data?.quiz?.attempt ||
    data?.quiz?.attempt && data?.quiz?.attempt?.status === 'IN_PROGRESS'

  const [resultList, setResultList] =
    useState<IQuizResultList>(defaultResultList)
  const [selectedResult, setSelectedResult] =
    useState<QuizResult>(defaultQuizResult)
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const [openResource, setOpenPopup] = useState(false)
  const [remainingTime, setRemainingTime] = useState<number>()
  const remainingTimeLastAttempt = useRef<number | null>(null)
  const [isExpiredLastAttempt, setIsExpiredLastAttempt] = useState(false)

  const quiz = data?.quiz
  const isLimited = !!quiz?.is_limited
  const attempt = quiz?.attempt
  const limitCount = quiz?.limit_count
  const currentAttemptNum = attempt?.number_of_attempts
  const isNoAttempt = !data?.quiz?.attempt

  const isNoAttemptOrLimitReached =
    isSubmitted ||
    isUnsubmitted ||
    isNoAttempt ||
    currentAttemptNum === limitCount // Hiển thị bài chưa làm hoặc đã làm hết số lần cho phép

  const displayTime =
    !!data?.quiz?.quiz_timed &&
    remainingTimeLastAttempt.current !== null &&
    remainingTime !== undefined &&
    remainingTime >= 0
      ? dayjs()
          .startOf('day')
          .add(
            remainingTimeLastAttempt.current >= 0
              ? remainingTimeLastAttempt.current
              : 0,
            'second',
          )
      : ''

  const onCancel = () => {
    setTimeout(() => {
      setOpen(false)
    })
  }

  const fetchResult = async (pageIndex: number, pageSize: number) => {
    if (class_user_id && data?.quiz?.id) {
      const response = await ClassAPI.getAllResultOfQuiz(
        class_user_id,
        data?.quiz?.id,
        { page_index: pageIndex ?? 1, page_size: pageSize ?? 10 },
      )
      if (
        response?.data?.data &&
        response?.data?.metadata?.total_records >= 1
      ) {
        const results = response.data.data
        setResultList((prev: IQuizResultList) => {
          return {
            metadata: response.data.metadata,
            data: [...prev.data, ...results]?.filter(
              (item, index, self) =>
                index === self?.findIndex((t) => t.id === item.id),
            ),
          }
        })

        setSelectedResult({
          label: results?.[0]?.name,
          value: results?.[0]?.id,
          ratio_score: results?.[0]?.ratio_score,
          status: results?.[0]?.status,
          grading_method: results?.[0]?.quiz?.grading_method,
          created_at: new Date(results?.[0]?.created_at),
          number_of_attempt: Number(
            (results?.[0]?.name ?? '').split('/').at(0) ?? 0,
          ),
        })
        //check điều kiện xem có được tiếp tục làm bài hay không
        let isExpired = false
        if (data?.quiz?.quiz_timed) {
          isExpired = isQuizExpired(
            new Date(results?.[0]?.created_at),
            data?.quiz?.quiz_timed,
          )
        }

        setIsExpiredLastAttempt(isExpired)
        const isContinueAttempt = results?.[0]?.status === 'IN_PROGRESS'
        if (isContinueAttempt && !isExpired) {
          localStorage.setItem(
            'quizAttempt',
            JSON.stringify({
              id: results?.[0]?.id,
              number_of_attempts:
                data?.attempt?.number_of_attempts ||
                data?.quiz?.attempt?.number_of_attempts,
              is_limited: data?.is_limited,
              quiz_timed: data?.quiz?.quiz_timed,
              created_at: results?.[0]?.created_at,
            }),
          )
        } else {
          localStorage.removeItem('quizAttempt')
        }
      } else {
        localStorage.removeItem('quizAttempt')
      }
    }
  }

  useEffect(() => {
    if (open && selectedResult) {
      if (data?.quiz?.quiz_timed && selectedResult?.status === 'IN_PROGRESS') {
        const calcTime = dayjs(
          dayjs(selectedResult.created_at).add(
            data?.quiz?.quiz_timed,
            'minutes',
          ),
        ).diff(dayjs(), 'seconds')

        if (remainingTimeLastAttempt.current === null) {
          remainingTimeLastAttempt.current = calcTime >= 0 ? calcTime : 0
        }

        const remainingTimeInterval = setInterval(() => {
          if (remainingTimeLastAttempt.current !== null) {
            // Kiểm tra null
            const currentTime = remainingTimeLastAttempt.current
            setRemainingTime(currentTime >= 0 ? currentTime : 0)
            remainingTimeLastAttempt.current -= 1
            if (remainingTimeLastAttempt.current <= 0) {
              clearInterval(remainingTimeInterval)
            }
          }
        }, 1000)

        return () => {
          clearInterval(remainingTimeInterval)
        }
      }
    }
  }, [selectedResult])

  useEffect(() => {
    if (open) {
      fetchResult(1, 10)
    }
  }, [open])

  const isFinalAttemptTimeout =
    remainingTimeLastAttempt?.current != null &&
    remainingTimeLastAttempt.current <= 0 &&
    currentAttemptNum === limitCount

  const isTimeOut =
    remainingTimeLastAttempt?.current != null &&
    remainingTimeLastAttempt.current <= 0

  const handleSubmitNow = async () => {
    await TestServiceAPI.submitAllQuestion(data?.quiz?.attempt?.id as string)
    handleRedirectResult()
  }

  useEffect(() => {
    if (isTimeOut) {
      handleSubmitNow()
    }
  }, [isTimeOut])

  useEffect(() => {
    if (!open) {
      setResultList(defaultResultList)
      setSelectedResult(defaultQuizResult)
    }
  }, [data, open])

  const handleNextPage = () => {
    const pageIndex = resultList.metadata.page_index
    const totalPage = resultList.metadata.total_pages
    if (pageIndex < totalPage) {
      fetchResult(pageIndex + 1, 10)
    }
  }

  const handleCheckStatus = (
    attempt: { status: string; score: number },
    quiz: { is_graded: boolean; required_percent_score: number },
  ) => {
    if (!attempt) return StatusQuizAttempt.Unsubmitted
    if (attempt?.status === 'SUBMITTED') {
      return StatusQuizAttempt.Submitted
    }
    if (quiz?.is_graded) {
      const status =
        attempt?.score < quiz?.required_percent_score
          ? StatusQuizAttempt.Failed
          : StatusQuizAttempt.Passed
      return status
    }
    return StatusQuizAttempt.Unsubmitted
  }

  const can_retake = useMemo(() => {
    if (!data?.quiz?.attempt) {
      return true
    }
    if (data.quiz.is_graded && is_passed_course) {
      return false
    }
    return true
  }, [data?.quiz?.attempt])

  const status = useMemo(() => {
    if (selectedResult?.value) {
      const result = resultList?.data?.find(
        (item) => item.id === selectedResult?.value,
      )
      if (result) {
        return handleCheckStatus(result, result?.quiz)
      }
    } else {
      return handleCheckStatus(data?.quiz?.attempt, data?.quiz)
    }
  }, [selectedResult?.value, data?.quiz?.attempt])

  const handleStartANewAttempt = async () => {
    if(!class_user_id) return
    try {
      activeCourse && (await activeCourse())
      router.push(`/short-course/test/${data?.quiz?.id}?class_user_id=${class_user_id}`)
      status
        ? () => trackGAEvent('Click Button Retake Modal Test')
        : () => trackGAEvent('Click Button Start Modal Test')
    } catch (err) {}
  }

  const handleFinishTest = async () => {
    localStorage.setItem(
      'quizAttempt',
      JSON.stringify({
        id: selectedResult?.value,
        number_of_attempts: data?.quiz?.attempt?.number_of_attempts,
        is_limited: data?.is_limited,
        quiz_timed: data?.quiz?.quiz_timed,
        created_at: selectedResult?.created_at,
      }),
    )
    handleStartANewAttempt()
  }

  const startTime = data?.quiz?.quiz_setting?.start_time
  // Test Unopend or Expired
  if (
    !isNull(data?.quiz?.quiz_setting) &&
    !data?.quiz?.quiz_setting?.allow_attempt
  ) {
    return (
      <TestAnnouncementModal
        open={open}
        handleCancel={() => {
          setOpen(false)
          trackGAEvent('Click Button Cancel Modal Test')
        }}
        type={data?.quiz?.quiz_setting?.reason_for_reject}
        start_time={startTime}
      />
    )
  }

  const getResultOfTest = () => {
    if (
      data?.quiz?.is_graded &&
      data?.quiz?.grading_method === GRADING_METHOD.MANUAL
    ) {
      if (
        data?.quiz?.attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING
      ) {
        return data?.quiz?.required_percent_score > data?.quiz?.attempt?.score
          ? StatusQuizAttempt.Failed
          : StatusQuizAttempt.Passed
      }
      return '_ _'
    }
    return (
      selectedResult?.ratio_score ?? data?.quiz?.attempt?.ratio_score ?? '_ _'
    )
  }

  const isManualGradingAndNotFinishedGrading =
    data?.quiz?.grading_method === GRADING_METHOD.MANUAL &&
    data?.quiz?.attempt?.grading_status !== GRADE_STATUS.FINISHED_GRADING &&
    data?.quiz?.attempt &&
    data?.quiz?.attempt?.status === 'SUBMITTED'

  const isShowDetail = () => {
    if (isManualGradingAndNotFinishedGrading) {
      return true
    }
    if (data?.quiz?.grading_method == GRADING_METHOD.MANUAL) {
      return (
        data?.quiz?.attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING
      )
    } else {
      return status !== StatusQuizAttempt.Unsubmitted
    }
  }

  const renderBackButton = () => (
    <ButtonText
      title="Cancel"
      // icon={<BackIcon />}
      size="medium"
      onClick={() => {
        setOpen(false)
        trackGAEvent('Click Button Back to My Course')
      }}
    />
  )

  const renderCustomFooter = () => {
    if (!quiz) return null

    // ✅ Trường hợp: có thể hiển thị nút Start hoặc Retake
    const shouldShowButtonStartOrRetake =
      !(
        selectedResult &&
        selectedResult?.number_of_attempt &&
        currentAttemptNum &&
        selectedResult?.number_of_attempt !== currentAttemptNum
      ) &&
      (!isLimited ||
        (isLimited &&
          !!limitCount &&
          (isNoAttempt ||
            currentAttemptNum < limitCount ||
            (currentAttemptNum === limitCount && !isSubmitted))))

    // 🟡 Trường hợp: chưa từng làm hoặc đã làm đủ số lượt cho phép

    if (isNoAttemptOrLimitReached) {
      if (!isLimited) {
        // 🔵 Quiz KHÔNG giới hạn số lượt làm
        if (isNoAttempt) {
          // ✅ Chưa từng làm → bắt đầu mới
          return (
            <>
              {shouldShowButtonStartOrRetake && (
                <ButtonPrimary
                  size="medium"
                  title="Start"
                  full
                  onClick={handleStartANewAttempt}
                />
              )}
              {renderBackButton()}
            </>
          )
        }

        if (isContinue) {
          // ✅ Có bài đang làm dở → tiếp tục hoặc làm mới
          return (
            <>
              <ButtonPrimary
                size="medium"
                title="Continue"
                full
                onClick={handleFinishTest}
              />
              <ButtonSecondary
                title="Start a new attempt"
                size="medium"
                full
                onClick={handleStartANewAttempt}
              />
              {renderBackButton()}
            </>
          )
        }

        // ✅ Đã làm xong → được làm lại
        return (
          <>
            {shouldShowButtonStartOrRetake && (
              <ButtonPrimary
                size="medium"
                title="Retake"
                full
                onClick={handleRetakeNewAttempt}
              />
            )}
            {renderBackButton()}
          </>
        )
      } else {
        // 🔴 Quiz CÓ giới hạn số lượt làm
        if (isFinalAttemptTimeout) {
          // ✅ Lần làm cuối cùng bị hết thời gian → chỉ xem kết quả
          return (
            <ButtonPrimary
              size="medium"
              title="View Result"
              full
              onClick={handleRedirectResult}
            />
          )
        }

        if (isNoAttempt || isSubmitted || isUnsubmitted) {
          // ✅ Chưa làm hoặc đã nộp → được làm bài mới
          return (
            <>
              {shouldShowButtonStartOrRetake && (
                <ButtonPrimary
                  size="medium"
                  title="Start"
                  full
                  onClick={handleStartANewAttempt}
                />
              )}
              {renderBackButton()}
            </>
          )
        }

        if (attempt.number_of_attempts === limitCount) {
          if (isContinue) {
            // ✅ Là lần cuối và bài đang làm → tiếp tục bài đó
            return (
              <>
                <ButtonPrimary
                  size="medium"
                  title="Continue"
                  full
                  onClick={handleFinishTest}
                />
                <ButtonSecondary
                  title="Submit now"
                  size="medium"
                  full
                  onClick={handleSubmitNow}
                />
              </>
            )
          } else {
            // ✅ Là lần cuối và đã nộp → chỉ xem kết quả
            return (
              <ButtonPrimary
                size="medium"
                title="View Result"
                full
                onClick={handleRedirectResult}
              />
            )
          }
        }

        // ✅ Còn lượt làm → tiếp tục bài cũ, nộp luôn hoặc làm mới
        return (
          <div className="flex flex-col items-center gap-3">
            <ButtonPrimary
              size="medium"
              title="Continue the previous attempt"
              full
              onClick={handleContinueLastAttempt}
            />
            <ButtonSecondary
              title="Submit now"
              size="medium"
              full
              onClick={handleSubmitNow}
            />
            <ButtonText
              title="Start a new attempt"
              full
              size="medium"
              onClick={async () => {
                await handleSubmitNow()
                handleRetakeNewAttempt()
              }}
            />
          </div>
        )
      }
    }

    // 🟢 Trường hợp khác: đã làm nhưng chưa hết lượt
    if (isContinue) {
      if (isTimeOut) {
        // ✅ Hết thời gian làm bài → chỉ xem kết quả hoặc bắt đầu lại
        return (
          <>
            <ButtonPrimary
              size="medium"
              title="View result"
              full
              onClick={handleRedirectResult}
            />
            <ButtonText
              title="Start a new attempt"
              size="medium"
              full
              onClick={handleRetakeNewAttempt}
            />
          </>
        )
      }

      // ✅ Còn thời gian → tiếp tục bài cũ, nộp hoặc bắt đầu mới
      return (
        <>
          <ButtonPrimary
            size="medium"
            title="Continue the previous attempt"
            full
            onClick={handleContinueLastAttempt}
          />
          <ButtonSecondary
            title="Submit now"
            size="medium"
            full
            onClick={handleSubmitNow}
          />
          <ButtonText
            title="Start a new attempt"
            size="medium"
            full
            onClick={handleRetakeNewAttempt}
          />
        </>
      )
    }

    // ⚪ Trường hợp không xác định → không hiển thị footer
    return null
  }

  const handleContinueLastAttempt = async () => {
    if (
      remainingTimeLastAttempt.current === null &&
      quiz.is_limited &&
      quiz.quiz_timed > 0
    )
      return
    if (
      remainingTimeLastAttempt.current !== null &&
      remainingTimeLastAttempt?.current <= 0
    ) {
      handleFinishTest()
    } else {
      handleStartANewAttempt()
    }
  }

  const handleRetakeNewAttempt = async () => {
    if (!can_retake) {
      setOpenPopup(true)
      return
    }
    localStorage.removeItem('quizAttempt')
    handleStartANewAttempt()
  }

  const handleRedirectResult = () => {
    if (isManualGradingAndNotFinishedGrading) {
      router.push(
        `/short-course/test/your-answers-detail?attempt=${selectedResult?.label}`
      )
    } else {
      router.push(
        `/short-course/test-result/${selectedResult?.value ?? data?.quiz?.attempt?.id}`
      )
    }
  }

  return (
    <TestPopup
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center justify-center">
          {
            TEST_TYPE_LABELS[
              data?.course_section_type as keyof typeof TEST_TYPE_LABELS
            ]
          }
        </div>
      }
      time={displayTime}
      otherContent={
        !isContinue && (
          <>
            <div className="flex flex-col gap-6">
              <TestInfoItem label="Name:" value={data?.name} />
              <TestInfoItem
                label="Pass Point:"
                value={
                  data?.quiz?.is_graded ? (
                    <>{data?.quiz?.required_percent_score ?? '_ _'}</>
                  ) : (
                    <>_ _</>
                  )
                }
              />
              <TestInfoItem
                label="Time Allowed:"
                value={
                  data?.quiz?.quiz_timed
                    ? formatTimer(data?.quiz?.quiz_timed * 60)
                    : 'Unlimited'
                }
              />
              <TestInfoItem
                label="Grading Method:"
                value={
                  capitalizeFirstLetter(selectedResult?.grading_method) ??
                  capitalizeFirstLetter(data?.quiz?.grading_method)
                }
              />
              <TestInfoItem
                label="No of Attempts:"
                value={`${data?.quiz?.attempt?.number_of_attempts || 0}/${
                  data?.quiz?.is_limited ? data?.quiz?.limit_count : 'Unlimited'
                }`}
              />

              {data?.quiz && (
                <div className="flex justify-between gap-8 text-base">
                  <div className="flex items-center gap-2 hover:text-primary">
                    <div
                      className={`forcus-group:text-primary text-gray ${isFocus ? 'text-primary' : ''}`}
                    >
                      Result:
                    </div>
                    {resultList?.data?.length >= 1 && (
                      <Select
                        // classNames={{
                        //   root: 'select-result-attempt',
                        //   popup: { root: 'select-result-attempt-option' },
                        // }}
                        className="custom-select-v2 h-8 pr-2"
                        popupClassName="select-card-course"
                        variant="borderless"
                        value={selectedResult?.value}
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            const tempSelectedResult = resultList?.data?.find(
                              (item) => item?.id === selectedOption,
                            )
                            if (tempSelectedResult) {
                              setSelectedResult({
                                label: tempSelectedResult?.name,
                                value: tempSelectedResult?.id,
                                ratio_score: tempSelectedResult?.ratio_score,
                                status: tempSelectedResult?.status,
                                grading_method:
                                  tempSelectedResult?.quiz?.grading_method,
                              })
                            }
                          }
                        }}
                        options={resultList?.data?.map((item, index) => ({
                          name: item?.name,
                          value: item?.id,
                          label: item?.name,
                          status: item?.status,
                          ratio_score: item?.ratio_score,
                          number_of_attempt: 3 - index,
                        }))}
                        onPopupScroll={(e) => {
                          const target = e.target as HTMLDivElement
                          if (
                            target.scrollTop + target.offsetHeight >=
                            target.scrollHeight
                          ) {
                            handleNextPage()
                          }
                        }}
                        suffixIcon={<ArrowDownIcon />}
                      />
                    )}
                  </div>
                  <div className="flex flex-row items-center">
                    <div className={`pr-0.5 font-medium`}>
                      {getResultOfTest()}
                    </div>
                    {isShowDetail() && (
                      <div
                        className="ml-2 cursor-pointer font-semibold text-primary underline"
                        onClick={() => {
                          if (isManualGradingAndNotFinishedGrading) {
                            router.push(
                              `/short-course/test/your-answers-detail?attempt=${selectedResult?.label}`
                            )
                          } else {
                            router.push(
                              `/short-course/test-result?attempt=${selectedResult?.label}?attempt=${selectedResult?.label}`
                            )
                          }

                          trackGAEvent('Click Button View Modal Result')
                        }}
                      >
                        {isManualGradingAndNotFinishedGrading
                          ? 'Your Answers'
                          : 'Detail'}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-between gap-8 text-base">
                <div className="text-gray">Status:</div>
                {data?.quiz?.is_graded &&
                data?.quiz?.grading_method === GRADING_METHOD.MANUAL ? (
                  <StatusTestQuizBadge
                    status={data?.quiz?.attempt?.grading_status}
                  />
                ) : (
                  <StatusTestQuizBadge
                    status={
                      status?.toUpperCase() as keyof typeof STATUS_QUIZ_TEST
                    }
                  />
                )}
              </div>
            </div>
            <PopupCanNotRetakeTest
              open={openResource}
              setOpen={setOpenPopup}
              onCancel={() => onCancel()}
            />
          </>
        )
      }
      customFooter={
        <div className="flex w-full flex-col items-center justify-center gap-3">
          {renderCustomFooter()}
        </div>
      }
      isClosable={
        isNoAttemptOrLimitReached &&
        (!isLimited ||
          (isLimited && (isNoAttempt || isSubmitted || isUnsubmitted)))
          ? false
          : true
      }
    />
  )
}

const TestInfoItem = ({
  label,
  value,
}: {
  label: React.ReactNode
  value: React.ReactNode
}) => {
  return (
    <div className="flex justify-between gap-8 text-base">
      <div className="text-gray">{label}</div>
      <div className="pr-0.5 text-start font-medium text-gray-800">{value}</div>
    </div>
  )
}
export default TestModal
