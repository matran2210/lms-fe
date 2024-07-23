import { CloseIcon } from '@assets/icons'
import { LAYOUT } from '@utils/constants'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package'
import { IQuestionResultResponse } from 'quiz-result-package/dist/type'
import { useEffect, useState } from 'react'
import { CoursesAPI } from '../../api/courses/index'
import FullScreenLayout from '@components/layout/FullScreenLayout'

const TableEntranceResult = () => {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState<boolean>(false)
  const [modalResult, setModalResult] = useState<{
    status?: boolean
    questions?: any
    id?: string
  }>()
  const getTable = async ({
    id,
    page_index,
    page_size,
  }: {
    id?: string
    page_index: number
    page_size: number
  }) => {
    setLoading(true)
    try {
      const response = await CoursesAPI.getQuizAttemptsTable(
        id || modalResult?.id || '',
        {
          page_index,
          page_size,
        },
      )
      const newQuestionResponse: IQuestionResultResponse = {
        meta: response.data.meta,
        data: (modalResult?.questions?.data || []).concat(
          response.data.answers?.map((e: any) => ({
            active: e.active,
            id: e.id,
            content: e.question.question_content,
            section: e.question.question_filter_id?.part?.name,
            type: e.question.qType,
            is_correct: e.is_correct,
            time_spent: e.time_spent,
            question: e.question as any,
          })) || [],
        ),
      }
      setModalResult((e) => ({
        id: id || e?.id,
        status: true,
        questions: newQuestionResponse,
      }))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (id) {
      getTable({ id: id as string, page_index: 1, page_size: 10 })
    }
  }, [id])

  //todo: call api, make UI
  // return <></>

  return (
    <FullScreenLayout title=''>
      <div className="max-w-screen-lg m-auto overflow-y-hidden overflow-x-auto px-6">
        <div
          className="ml-auto cursor-pointer absolute  right-6 top-[18px]"
          onClick={() => {
            router.back()
          }}
        >
          <CloseIcon className="transition-all stroke-bw-1 ease-in-out duration-300 transform group-hover:stroke-primary" />
        </div>
        {modalResult?.questions?.data?.length > 0 && (
          <QuizResultComponent
            questionResponse={modalResult?.questions || []}
            getTable={getTable}
            onShowDetail={(e) => {
              router.push(`/explanation/${e.id}?title=Entrance Test`)
            }}
            loading={loading}
          />
        )}
      </div>
    </FullScreenLayout>
  )
}
export default TableEntranceResult
TableEntranceResult.layout = LAYOUT.FULLSCREEN_LAYOUT
