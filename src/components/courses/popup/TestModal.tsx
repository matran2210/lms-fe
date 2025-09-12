import { formatTime } from '@components/common/timer'
import BaseModal from './BaseModal'
import { GRADE_STATUS, GRADING_METHOD } from 'src/constants'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { trackGAEvent } from '@utils/google-analytics'
import { useRouter } from 'next/router'
import { IQuizResultList } from 'src/type'
import { ClassAPI } from '@pages/api/class'
import { capitalizeFirstLetter } from '@utils/index'
import { IAttempt } from 'src/type/courses-3-level'
import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm } from 'react-hook-form'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonSecondary from '@components/base/button/ButtonSecondary'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  data?: {
    id: string
    name: string
    quiz: {
      id: string
      attempt: IAttempt | null
      quiz_timed: number | null
      is_graded: boolean
      required_percent_score: number
      is_limited: boolean
      limit_count: number
      grading_method: string
    }
  }
  class_user_id?: string
}

enum StatusQuizAttempt {
  Passed = 'Passed',
  Failed = 'Failed',
  Unsubmitted = 'Unsubmitted',
  Submitted = 'Submitted',
}

export default function TestModal({
  open,
  setOpen,
  data,
  class_user_id,
  title,
}: IProps) {
  const router = useRouter()
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
    number_of_attempt?: number
  }>()
  const [isFocus, setIsFocus] = useState<boolean>(false)

  const { control } = useForm()

  const fetchResult = async (pageIndex: number, pageSize: number) => {
    if (class_user_id && data?.quiz?.id) {
      const response = await ClassAPI.getAllResultOfQuiz(
        class_user_id,
        data?.quiz?.id,
        { page_index: pageIndex ?? 1, page_size: pageSize ?? 10 },
      )
      if (response?.data?.data && response?.data?.metadata?.total_records > 1) {
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
        })
      }
    }
  }

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
    if (attempt?.status === 'UN_SUBMITTED' || !attempt) {
      return StatusQuizAttempt.Unsubmitted
    }
    if (quiz?.is_graded) {
      const status =
        attempt?.score < quiz?.required_percent_score
          ? StatusQuizAttempt.Failed
          : StatusQuizAttempt.Passed
      return status
    }
    return StatusQuizAttempt.Submitted
  }

  const status = useMemo(() => {
    if (selectedResult?.value) {
      const result = resultList?.data?.find(
        (item) => item.id === selectedResult?.value,
      )
      if (result) {
        return handleCheckStatus(result, result?.quiz)
      }
    } else {
      return handleCheckStatus(
        data?.quiz?.attempt as { status: string; score: number },
        data?.quiz as { is_graded: boolean; required_percent_score: number },
      )
    }
  }, [selectedResult?.value, data?.quiz?.attempt])

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
          <div className="text-yellow-400 pr-0.5 font-medium">
            Awaiting Grading
          </div>
        )
      default:
        return (
          <div className="text-gray-500 pr-0.5 font-medium">Unsubmitted</div>
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

  return (
    <>
      {open ? (
        <div onClick={(e) => e.stopPropagation()}>
          <BaseModal
            title={title}
            closable={false}
            visible={open}
            onClose={(e) => {
              if (e?.stopPropagation) {
                e.stopPropagation()
              }
              setOpen(false)
            }}
            bodyStyle={{
              maxHeight: '80vh',
            }}
            style={{
              overflow: 'visible',
            }}
            wrapClassName="course-test-modal"
            footer={null}
          >
            <div className="flex justify-between gap-2 pb-4 pt-6 text-sm lg:pb-6 lg:pt-8 lg:text-base">
              <div className="w-1/2 text-gray">Name:</div>
              <div className="line-clamp-2 w-1/2 pr-0.5 text-right font-medium text-bw-1">
                {data?.name}
              </div>
            </div>
            <div className="flex justify-between gap-8 pb-4 text-sm lg:pb-6 lg:text-base">
              <div className="text-gray">Pass Point:</div>
              <div className="pr-0.5 font-medium text-bw-1">
                {data?.quiz?.required_percent_score ? (
                  <>{data?.quiz?.required_percent_score ?? '--'}</>
                ) : (
                  <>--</>
                )}
              </div>
            </div>
            <div className="flex justify-between gap-8 pb-4 text-sm lg:pb-6 lg:text-base">
              <div className="text-gray">Time Allowed:</div>
              <div className="pr-0.5 font-medium text-bw-1">
                {data?.quiz?.quiz_timed
                  ? formatTime(data?.quiz?.quiz_timed * 60)
                  : 'Unlimited'}
              </div>
            </div>
            <div className="flex justify-between gap-8 pb-4 text-sm lg:pb-6 lg:text-base">
              <div className="text-gray">Grading Method:</div>
              <div className="pr-0.5 font-medium text-bw-1">
                {capitalizeFirstLetter(selectedResult?.grading_method) ??
                  capitalizeFirstLetter(data?.quiz?.grading_method)}
              </div>
            </div>
            <div className="flex justify-between gap-8 pb-4 text-sm lg:pb-6 lg:text-base">
              <div className="text-gray">No of Attempts:</div>
              <div className="pr-0.5 font-medium text-bw-1">
                {data?.quiz?.attempt?.number_of_attempts || 0}/
                {data?.quiz?.is_limited ? data?.quiz?.limit_count : 'Unlimited'}
              </div>
            </div>
            <div className="flex justify-between gap-8 pb-1 text-sm lg:pb-6 lg:text-base">
              <div className="text-gray">Status:</div>
              {data?.quiz?.is_graded &&
              data?.quiz?.grading_method === GRADING_METHOD.MANUAL ? (
                getGradedStatus(data?.quiz?.attempt?.grading_status)
              ) : (
                <div
                  className={`${status === StatusQuizAttempt.Submitted ? 'bg-green-7 text-green-6' : status === StatusQuizAttempt.Unsubmitted ? 'bg-orange-6 text-orange-5' : 'text-bw-1'} rounded-sm px-2 py-0.5 text-sm font-normal leading-5.5`}
                >
                  {status}
                </div>
              )}
            </div>
            {data?.quiz && (
              <div className="flex justify-between gap-8 pb-3 text-sm lg:pb-8 lg:text-base">
                <div className="flex items-center gap-2 hover:text-primary">
                  <div
                    className={`focus-group:text-primary text-bw-13 ${isFocus ? 'text-bw-13' : ''}`}
                  >
                    Attempt:
                  </div>
                  {resultList.data.length > 1 && (
                    <div className="flex gap-2">
                      <SAPPSelectV2
                        control={control}
                        name="attempt"
                        className="!h-10 min-w-[40px] border-none focus:text-primary"
                        onChange={(selectedOption) => {
                          setSelectedResult(selectedOption)
                          setIsFocus(false)
                        }}
                        options={resultList.data.map((item) => ({
                          value: item.id,
                          label: item.name,
                          status: item.status,
                          ratio_score: item.ratio_score,
                        }))}
                        onMenuScrollToBottom={(
                          e: React.UIEvent<HTMLElement>,
                        ) => {
                          const { target } = e
                          if (
                            (target as HTMLDivElement).scrollTop +
                              (target as HTMLDivElement).offsetHeight ===
                            (target as HTMLDivElement).scrollHeight
                          ) {
                            handleNextPage()
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center">
                  <div className={` pr-0.5 font-medium`}>
                    {getResultOfTest()}
                  </div>
                  {isShowDetail() && (
                    <div
                      className="ml-2 cursor-pointer text-sm font-semibold leading-5.5 text-primary underline"
                      onClick={() => {
                        if (isManualGradingAndNotFinishedGrading) {
                          router.push(
                            `/courses/test/your-answers-detail/${data?.quiz?.attempt?.id}`,
                          )
                        } else {
                          router.push({
                            pathname: `/short-course/test-result/${selectedResult?.value ?? data?.quiz?.attempt?.id}`,
                            query: { attempt: selectedResult?.label },
                          })
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
            <div className="flex flex-col gap-2 lg:gap-3">
              <ButtonPrimary
                title={
                  status === StatusQuizAttempt.Unsubmitted ? 'Start' : 'Retake'
                }
                full={true}
                size="medium"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push({
                    pathname: `/short-course/test/${data?.quiz?.id}`,
                    query: {
                      class_user_id: class_user_id,
                    },
                  })
                }}
                className="h-[38px]"
              />
              <ButtonSecondary
                title={'Cancel'}
                full={true}
                size="medium"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                }}
                className="h-[38px]"
              />
            </div>
          </BaseModal>
        </div>
      ) : null}
    </>
  )
}
