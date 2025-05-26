import { formatTime } from '@components/common/timer'
import TestAnnouncementModal from '@components/mycourses/course-detail/TestAnnoucementModal'
import PopupCanNotRetakeTest from '@components/mycourses/PogupCannotRetakeTest'
import { TEST_TYPE } from '@utils/constants'
import { trackGAEvent } from '@utils/google-analytics'
import dayjs from 'dayjs'
import { isNull } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ClassAPI } from 'src/pages/api/class'
import { IQuizResultList } from 'src/type/quiz'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { GRADING_METHOD, GRADE_STATUS } from 'src/constants'
import { capitalizeFirstLetter } from '@utils/index'
import { useDispatch } from 'react-redux'
import PopupSelectRetakeOrContinueAttempt from '@components/mycourses/PopupSelectRetakeOrContinueAttempt'
import { ClockIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'

enum StatusQuizAttempt {
  Passed = 'Passed',
  Failed = 'Failed',
  Unsubmitted = 'Unsubmitted',
  Submitted = 'Submitted',
}
interface IProps {
  open: boolean
  setOpen: any
  title?: string
  data?: any
  class_user_id?: string
  activeCourse?: any
  is_passed_course: boolean
}

const calculateEndTime = (createdAt: Date, quizTimed: number): Date => {
  return dayjs(createdAt).add(quizTimed, 'minutes').toDate()
}

export const isQuizExpired = (createdAt: Date, quizTimed: number): boolean => {
  const endTime = calculateEndTime(createdAt, quizTimed)
  return dayjs().isAfter(endTime)
}

const TestModal = ({
  open,
  setOpen,
  data,
  class_user_id,
  activeCourse,
  is_passed_course,
}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const isSubmitted =
    data?.quiz?.attempt && data?.quiz?.attempt?.status === 'SUBMITTED'
  const isUnsubmitted =
    data?.quiz?.attempt && data?.quiz?.attempt?.status === 'UN_SUBMITTED'
  const isContinue =
    !data?.quiz?.attempt ||
    (data?.quiz?.attempt && data?.quiz?.attempt?.status === 'IN_PROGRESS')
  const [resultList, setResultList] = useState<IQuizResultList>({
    metadata: {
      page_index: 1,
      page_size: 10,
      total_pages: 0,
      total_records: 0,
    },
    data: [],
  })
  const [selectedResult, setSelectedResult] = useState<{
    label: string
    value: string
    ratio_score?: string
    status: string
    grading_method?: string
    created_at?: Date
    number_of_attempt?: number
  }>()
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const [openResource, setOpenPopup] = useState(false)
  const [openLastAttempt, setOpenLastAttempt] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  let remainingTimeLastAttempt = useRef<number>(0)
  const [isExpiredLastAttempt, setIsExpiredLastAttempt] = useState(false)

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
        remainingTimeLastAttempt.current = dayjs(
          dayjs(selectedResult.created_at).add(
            data?.quiz?.quiz_timed,
            'minutes',
          ),
        ).diff(dayjs(), 'seconds')
        const remainingTimeInterval = setInterval(() => {
          setRemainingTime(remainingTimeLastAttempt.current)
          remainingTimeLastAttempt.current -= 1
          if (remainingTimeLastAttempt.current < 0) {
            clearInterval(remainingTimeInterval)
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

  const handleSubmit = async () => {
    //to do: start test
    try {
      activeCourse && (await activeCourse())
      router.push({
        pathname: `/test/${data.quiz.id}`,
        query: {
          class_user_id: class_user_id,
        },
      })
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
    handleSubmit()
  }

  // const startTime = dayjs().add(1, 'day')
  const startTime = data?.quiz?.quiz_setting?.start_time
  // const endTime = dayjs().subtract(1, 'year')
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

  // Default case
  const getGradedStatus = (status?: string) => {
    switch (status) {
      case GRADE_STATUS.FINISHED_GRADING:
        return (
          <div className="pr-0.5 font-medium text-state-success">
            Finished Grading
          </div>
        )
      case GRADE_STATUS.AWAITING_GRADING:
        return (
          <div className="pr-0.5 font-medium text-yellow-400">
            Awaiting Grading
          </div>
        )
      default:
        return (
          <div className="pr-0.5 font-medium text-gray-500">Unsubmitted</div>
        )
    }
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
      return '--'
    }
    return (
      selectedResult?.ratio_score ?? data?.quiz?.attempt?.ratio_score ?? '--'
    )
  }

  const isShowDetail = () => {
    if (data?.quiz?.grading_method == GRADING_METHOD.MANUAL) {
      return (
        data?.quiz?.attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING
      )
    } else {
      return status !== StatusQuizAttempt.Unsubmitted
    }
  }

  const renderShowOkButton = () => {
    // Case: selected attempt is not now attempt
    if (
      selectedResult &&
      selectedResult?.number_of_attempt &&
      selectedResult?.number_of_attempt !==
        data?.quiz?.attempt?.number_of_attempts
    ) {
      return false
    }

    // Case: Unlimited time attempt
    if (!data?.quiz?.is_limited) return true

    // Case: Limited time attempt
    if (data?.quiz?.is_limited && !!data?.quiz?.limit_count) {
      // & Case: Not Attempt
      if (!data?.quiz?.attempt) return true

      // & Case: Last attempt
      if (
        data?.quiz?.attempt?.number_of_attempts === data?.quiz?.limit_count &&
        !isSubmitted
      )
        return true
      // & Case: has more than 1 attempt
      if (data?.quiz?.attempt?.number_of_attempts < data?.quiz?.limit_count)
        return true
    }
    return false
  }
  const renderOkButtonCaption = () => {
    // Case: Unlimited time attempt and submitted
    if (!data?.quiz?.is_limited && (isSubmitted || isUnsubmitted))
      return 'Start'
    // Case: Unlimited time attempt and continue
    if (!data?.quiz?.is_limited && isContinue) return 'Continue'
    // Case: Limited time attempt
    if (data?.quiz?.is_limited && !!data?.quiz?.limit_count) {
      // & Case: Not Attempt
      if (!data?.quiz?.attempt) return 'Start'

      // & Case: Last attempt
      if (data?.quiz?.attempt?.number_of_attempts === data?.quiz?.limit_count)
        return 'Continue'
      // & Case: has more than 1 attempt
      if (data?.quiz?.attempt?.number_of_attempts < data?.quiz?.limit_count)
        return 'Retake'
    }
  }
  const handleContinueLastAttempt = async () => {
    handleSubmit()
  }
  const handleRetakeNewAttempt = async () => {
    localStorage.removeItem('quizAttempt')
    handleSubmit()
  }

  const onSubmit = async () => {
    if (
      renderOkButtonCaption() === 'Continue' &&
      remainingTimeLastAttempt.current <= 0 &&
      isContinue
    ) {
      // Call api finish test
      handleFinishTest()
    }
    if (
      renderOkButtonCaption() === 'Retake' &&
      !isExpiredLastAttempt &&
      selectedResult?.status === 'IN_PROGRESS' &&
      remainingTimeLastAttempt.current > 0
    ) {
      setOpenLastAttempt(true)
    } else {
      if (!can_retake) {
        setOpenPopup(true)
        return
      }
      handleSubmit()
    }
  }
  return (
    <SappModalV3
      title={
        <div className="flex items-center justify-between gap-2">
          <div>{TEST_TYPE[data?.course_section_type]}</div>
          {remainingTimeLastAttempt.current > 0 &&
            renderShowOkButton() &&
            renderOkButtonCaption() === 'Continue' && (
              <div className="item-center flex gap-2 font-normal text-[#3964EA]">
                <div className="m-auto">
                  <ClockIcon color={'#3964EA'} size={24} />
                </div>
                <div className="text-[20px]">
                  {formatTime(remainingTimeLastAttempt.current)}
                </div>
              </div>
            )}
        </div>
      }
      open={open}
      handleCancel={() => {
        setOpen(false)
        trackGAEvent('Click Button Cancel Modal Test')
      }}
      showOkButton={renderShowOkButton()}
      onOk={onSubmit}
      okButtonCaption={renderOkButtonCaption()}
      footerButtonClassName="flex justify-between item-center"
      cancelButtonCaption={'Cancel'}
      buttonSize="medium"
      icon={undefined}
      header={''}
    >
      <div className="flex justify-between gap-8 border-b border-slate-100 py-6 text-base">
        <div className="text-gray-1">Name:</div>
        <div className="line-clamp-2 pr-0.5 font-medium text-bw-1">
          {data?.name}
        </div>
      </div>
      <div className="flex justify-between gap-8 border-b border-slate-100 py-6 text-base">
        <div className="text-gray-1">Pass Point:</div>
        <div className="pr-0.5 font-medium text-bw-1">
          {data?.quiz?.is_graded ? (
            <>{data?.quiz?.required_percent_score ?? '- -'}</>
          ) : (
            <>--</>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-8 border-b border-slate-100 py-6 text-base">
        <div className="text-gray-1">Time Allowed:</div>
        <div className="pr-0.5 font-medium text-bw-1">
          {data?.quiz?.quiz_timed
            ? formatTime(data?.quiz?.quiz_timed * 60)
            : 'Unlimited'}
        </div>
      </div>
      <div className="flex justify-between gap-8 border-b border-slate-100 py-6 text-base">
        <div className="text-gray-1">Grading Method:</div>
        <div className="pr-0.5 font-medium text-bw-1">
          {capitalizeFirstLetter(selectedResult?.grading_method) ??
            capitalizeFirstLetter(data?.quiz?.grading_method)}
        </div>
      </div>
      <div className="flex justify-between gap-8 border-b border-slate-100 py-6 text-base">
        <div className="text-gray-1">No of Attempts:</div>
        <div className="pr-0.5 font-medium text-bw-1">
          {data?.quiz?.attempt?.number_of_attempts || 0}/
          {data?.quiz?.is_limited ? data?.quiz?.limit_count : 'Unlimited'}
        </div>
      </div>
      {data?.quiz && (
        <div className="flex justify-between gap-8 border-b border-slate-100 py-6 text-base">
          <div className="flex items-center gap-2 hover:text-primary">
            <div
              className={`forcus-group:text-primary text-gray-1 ${isFocus ? 'text-primary' : ''}`}
            >
              Result:
            </div>
            {resultList.data.length > 1 && (
              <div className="flex gap-2">
                <HookFormSelect
                  classParent="w-full md:max-w-full border-none h-[50px] forcus:text-primary"
                  placeholder=""
                  value={selectedResult}
                  onChange={(selectedOption) => {
                    setSelectedResult({
                      ...selectedOption,
                      number_of_attempt: Number(
                        (selectedOption?.name ?? '').split('/').at(0) ?? 0,
                      ),
                    })
                    setIsFocus(false)
                  }}
                  options={resultList.data.map((item, index) => ({
                    name: item.name,
                    value: item.id,
                    label: item.name,
                    status: item.status,
                    ratio_score: item.ratio_score,
                    number_of_attempt: 3 - index,
                  }))}
                  onMenuScrollToBottom={(e: React.UIEvent<HTMLDivElement>) => {
                    const { target } = e
                    if (
                      (target as HTMLDivElement).scrollTop +
                        (target as HTMLDivElement).offsetHeight ===
                      (target as HTMLDivElement).scrollHeight
                    ) {
                      handleNextPage()
                    }
                  }}
                  isResultSelect
                  maxMenuHeight={130}
                  onFocus={(e) => {
                    setIsFocus(true)
                  }}
                  onBlur={(e) => {
                    setIsFocus(false)
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-row items-center">
            <div className={` pr-0.5 font-medium`}>{getResultOfTest()}</div>
            {isShowDetail() && (
              <div
                className="ml-2 cursor-pointer text-state-info underline"
                onClick={() => {
                  router.push({
                    pathname: `/courses/test/test-result/${selectedResult?.value ?? data?.quiz?.attempt?.id}`,
                    query: { attempt: selectedResult?.label },
                  })
                  trackGAEvent('Click Button View Modal Result')
                }}
              >
                Detail
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-between gap-8 py-6 text-base">
        <div className="text-gray-1">Status:</div>
        {data?.quiz?.is_graded &&
        data?.quiz?.grading_method === GRADING_METHOD.MANUAL ? (
          getGradedStatus(data?.quiz?.attempt?.grading_status)
        ) : (
          <div
            className={`${status === StatusQuizAttempt.Passed ? 'text-state-success' : status === StatusQuizAttempt.Failed ? 'text-state-error' : 'text-bw-1'} pr-0.5 font-medium`}
          >
            {status}
          </div>
        )}
      </div>
      <PopupCanNotRetakeTest
        open={openResource}
        setOpen={setOpenPopup}
        onCancel={() => onCancel()}
      />
      {openLastAttempt && remainingTimeLastAttempt.current > 0 && (
        <PopupSelectRetakeOrContinueAttempt
          open={openLastAttempt}
          handleContinue={handleContinueLastAttempt}
          handleRetake={handleRetakeNewAttempt}
          setOpen={setOpenLastAttempt}
          title={
            <div className="flex items-center justify-between gap-2">
              <div>{TEST_TYPE[data?.course_section_type]}</div>
              {remainingTimeLastAttempt.current > 0 && (
                <div className="item-center flex gap-2 font-normal text-[#3964EA]">
                  <div className="m-auto">
                    <ClockIcon color={'#3964EA'} size={24} />
                  </div>
                  <div className="text-[20px]">
                    {formatTime(remainingTimeLastAttempt.current)}
                  </div>
                </div>
              )}
            </div>
          }
        />
      )}
    </SappModalV3>
  )
}

export default TestModal
