import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ClassAPI } from 'src/pages/api/class'
import { IQuizResultList } from '@lms/core'
import { Select } from 'antd'
import { ArrowDownIcon } from '@assets/icons/entranceTest'

interface IQuizAttempt {
  attempt?: {
    grading_status?: string
    id?: string
    number_of_attempts?: number
    quiz_id?: string
    ratio_score?: string
    score?: string | number
    total_attempt_time?: string | number | Date
  }
  id: string
  is_graded: boolean
  grading_method?: string
  required_percent_score?: number
  is_limited: boolean
}

interface CoursePart {
  course_section_type?: string
  description?: string
  duration?: string | number
  id?: string
  learning_progress?: {
    total_course_sections: number
    total_course_sections_completed: number
    time_spent: number
    duration: number
  }
  name?: string
  position?: number
  quiz?: IQuizAttempt
  user_section_learning_status?: string
}

interface IProps {
  class_user_id?: string
  coursePart: CoursePart
  setOpenReport: Dispatch<SetStateAction<boolean>>
  selectedResult:
    | {
        label: string
        value: string
        ratio_score?: string
        status: string
        score: number
        total_attempt_time: number
      }
    | undefined
  setSelectedResult: Dispatch<
    SetStateAction<
      | {
          label: string
          value: string
          ratio_score?: string
          status: string
          score: number
          total_attempt_time: number
        }
      | undefined
    >
  >
  isTeacher: boolean
  setLabelResult: Dispatch<SetStateAction<string>>
}

const ResultCourse = ({
  class_user_id,
  coursePart,
  selectedResult,
  setSelectedResult,
  setOpenReport,
  isTeacher,
  setLabelResult,
}: IProps) => {
  const [resultList, setResultList] = useState<IQuizResultList>({
    metadata: {
      page_index: 1,
      page_size: 10,
      total_pages: 0,
      total_records: 0,
    },
    data: [],
  })

  const handleNextPage = () => {
    const pageIndex = resultList.metadata.page_index
    const totalPage = resultList.metadata.total_pages
    if (pageIndex < totalPage) {
      fetchResult(pageIndex + 1, 10)
    }
  }

  const fetchResult = async (pageIndex: number = 1, pageSize: number = 10) => {
    if (!class_user_id || !coursePart?.quiz?.id) return

    const response = await ClassAPI.getAllResultOfQuiz(
      class_user_id,
      coursePart.quiz.id,
      {
        page_index: pageIndex,
        page_size: pageSize,
      },
    )

    const results = response?.data?.data || []
    const totalRecords = response?.data?.metadata?.total_records || 0

    if (!results.length) return

    // Set selected result (dùng chung ở cả 2 nhánh)
    const firstResult = results[0]
    setSelectedResult({
      label: firstResult.name,
      value: firstResult.id,
      ratio_score: firstResult.ratio_score,
      status: firstResult.status,
      score: firstResult.score,
      total_attempt_time: firstResult.total_attempt_time,
    })

    // Nếu nhiều hơn 1 kết quả thì gộp vào result list
    if (totalRecords >= 1) {
      setResultList((prev: IQuizResultList) => ({
        metadata: response.data.metadata,
        data: [...prev.data, ...results].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        ),
      }))
      setLabelResult(resultList?.data?.[0]?.name)
    }
  }

  useEffect(() => {
    fetchResult(1, 10)
  }, [])

  const isAttempt = resultList?.data?.length >= 1

  return (
    <div className="time-allow flex items-center justify-between">
      <p className="text-sm text-gray-800 md:text-base">
        <div className="flex h-8 items-center">
          <div
            className={`forcus-group:text-primary ${resultList?.data?.length <= 1 ? 'text-gray' : 'text-gray-800'}`}
          >
            Result of Attempts:
          </div>
          <div>
            {isAttempt ? (
              <>
                {resultList?.data?.length === 1 ? (
                  <div className="text-gray">1</div>
                ) : (
                  <Select
                    options={resultList?.data?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    className="custom-select-v2 h-8 pr-2"
                    popupClassName="select-card-course"
                    onPopupScroll={(e) => {
                      const target = e.target as HTMLDivElement
                      if (
                        target.scrollTop + target.offsetHeight >=
                        target.scrollHeight
                      ) {
                        handleNextPage()
                      }
                    }}
                    variant="borderless"
                    value={selectedResult?.value}
                    onChange={(selectedOption) => {
                      const selectedResultFind = resultList?.data?.find(
                        (item) => item?.id === selectedOption,
                      )

                      const selectedResult = {
                        label: selectedResultFind?.name,
                        value: selectedResultFind?.id,
                        ratio_score: selectedResultFind?.ratio_score,
                        status: selectedResultFind?.status,
                        score: selectedResultFind?.score,
                        total_attempt_time:
                          selectedResultFind?.total_attempt_time,
                      }
                      setSelectedResult(
                        selectedResult as {
                          label: string
                          value: string
                          ratio_score?: string
                          status: string
                          score: number
                          total_attempt_time: number
                        },
                      )
                    }}
                    suffixIcon={<ArrowDownIcon />}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </p>
      <p
        className={`text-sm font-medium md:text-base ${isAttempt ? 'text-info' : 'text-gray-800'}`}
      >
        {isAttempt ? `${selectedResult?.score || 0}%` : '--'}
      </p>
    </div>
  )
}

export default ResultCourse
