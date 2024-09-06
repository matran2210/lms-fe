import SappButton from '@components/base/button/SappButton'
import HookFormSelect from '@components/base/select/HookFormSelect'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { ClassAPI } from 'src/pages/api/class'
import { IQuizResultList } from 'src/type'

interface IProps {
  class_user_id?: string
  coursePart: any
  quizAttempt: any
  trackGA: () => void
}

const ResultCourse = ({
  class_user_id,
  coursePart,
  quizAttempt,
  trackGA,
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

  const [selectedResult, setSelectedResult] = useState<{
    label: string
    value: string
    ratio_score?: string
    status: string
  }>()

  const handleNextPage = () => {
    const pageIndex = resultList.metadata.page_index
    const totalPage = resultList.metadata.total_pages
    if (pageIndex < totalPage) {
      fetchResult(pageIndex + 1, 10)
    }
  }

  const fetchResult = async (pageIndex: number, pageSize: number) => {
    if (class_user_id && coursePart?.quiz?.id) {
      const response = await ClassAPI.getAllResultOfQuiz(
        class_user_id,
        coursePart?.quiz?.id,
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
        })
      }
    }
  }
  useEffect(() => {
    fetchResult(1, 10)
  }, [])

  useEffect(() => {
    const element = document.querySelector(
      '.select__single-value',
    ) as HTMLElement
    if (element) {
      element.style.color = isFocus ? '#FFB800' : '#a1a1a1'
    }
  }, [isFocus])

  return resultList.data.length <= 1 ? (
    <SappButton
      title="Result"
      isUnderLine
      color="text"
      className="!p-0 font-medium underline"
      onClick={() => {
        router.push(`/courses/test/test-result/${quizAttempt?.attempt?.id}`)
        trackGA()
      }}
    />
  ) : (
    <div className="flex items-center gap-2">
      <div
        className={`forcus-group:text-primary text-gray-1 ${isFocus ? 'text-primary' : ''}`}
      >
        Result:
      </div>
      <div>
        <HookFormSelect
          classParent="w-full md:max-w-full border-none h-[50px] forcus:text-primary"
          placeholder=""
          className="right-top"
          value={selectedResult}
          onChange={(selectedOption) => {
            setSelectedResult(selectedOption)
            setIsFocus(false)
            router.push({
              pathname: `/courses/test/test-result/${selectedOption.value}`,
              query: { attempt: selectedOption?.label },
            })
          }}
          options={resultList.data.map((item) => ({
            value: item.id,
            label: item.name,
            status: item.status,
            ratio_score: item.ratio_score,
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
          onFocus={(e) => {
            setIsFocus(true)
          }}
          onBlur={(e) => {
            setIsFocus(false)
          }}
        />
      </div>
    </div>
  )
}

export default ResultCourse
