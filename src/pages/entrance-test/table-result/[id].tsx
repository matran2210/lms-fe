import { LAYOUT } from '@utils/constants'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package'
import { IQuestionResultResponse } from 'quiz-result-package/dist/type'
import { useEffect, useState } from 'react'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
const TableEntranceResult = () => {
  const router = useRouter()
  const { id } = router.query
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
    try {
      const response = await CourseActivityApi.getQuizAttemptsTable(
        id || modalResult?.id || '',
        {
          page_index,
          page_size,
        },
      )
      const newQuestionResponse: IQuestionResultResponse = {
        meta: response.data.meta,
        data:
          response.data.answers?.map((e: any) => ({
            id: e.id,
            content: e.question.question_content,
            section: e.question.question_topic?.name,
            type: e.question.qType,
            result: {
              is_correct: e.is_correct,
              percent: 0,
            },
            time_spent: e.time_spent || 0,
          })) || [],
      }
      setModalResult((e) => ({
        id: id || e?.id,
        status: true,
        questions: newQuestionResponse,
      }))
    } catch (error) {}
  }
  useEffect(() => {
    if (id) {
      getTable({ id: id as string, page_index: 1, page_size: 10 })
    }
  }, [id])

  //todo: call api, make UI
  // return <></>

  return (
    <div className="max-w-screen-lg m-auto">
      {modalResult?.questions?.data?.length > 0 ? (
        <QuizResultComponent
          questionResponse={modalResult?.questions || []}
          getTable={getTable}
          onShowDetail={(e) => {
            router.push(`/entrance-test/table-result/explanation/${e.id}`)
          }}
        />
      ) : (
        <></>
      )}
    </div>
    // <></>
  )
}
export default TableEntranceResult
TableEntranceResult.layout = LAYOUT.FULLSCREEN_LAYOUT
