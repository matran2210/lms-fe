import SappButton from '@components/base/button/SappButton'
import HookFormSelect from '@components/base/select/HookFormSelect'
import router from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { GRADE_STATUS, GRADING_METHOD } from 'src/constants'
import { ClassAPI } from 'src/pages/api/class'
import { IQuizResultList } from 'src/type'

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
        }
      | undefined
    >
  >
}

const ResultCourse = ({
  class_user_id,
  coursePart,
  selectedResult,
  setSelectedResult,
  setOpenReport,
}: IProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)
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
    })

    // Nếu nhiều hơn 1 kết quả thì gộp vào result list
    if (totalRecords > 1) {
      setResultList((prev: IQuizResultList) => ({
        metadata: response.data.metadata,
        data: [...prev.data, ...results].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        ),
      }))
    }
  }

  useEffect(() => {
    fetchResult(1, 10)
  }, [])

  const isAttempt = resultList?.data?.length <= 1

  return (
    <div className="flex h-8 items-center gap-2">
      <div
        className={`forcus-group:text-primary ${isAttempt ? 'text-gray' : 'text-gray-800'}`}
      >
        Result of Attemps:
      </div>
      <div>
        {isAttempt ? (
          <div className="text-gray">1</div>
        ) : (
          <HookFormSelect
            classParent="w-full md:max-w-full border-none h-[50px] forcus:text-primary"
            placeholder=""
            className="right-top text-base"
            value={selectedResult}
            onChange={(selectedOption) => {
              setSelectedResult(selectedOption)
              setIsFocus(false)
            }}
            options={resultList.data.map((item) => ({
              value: item.id,
              label: item.name,
              status: item.status,
              ratio_score: item.ratio_score,
              score: item.score,
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
            isSearchable={false}
          />
        )}
      </div>
    </div>
  )
}

export default ResultCourse
