import { CloseIcon } from '@assets/icons'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { LAYOUT } from '@utils/constants'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package'
import { IQuestionResultResponse } from 'quiz-result-package/dist/type'
import { useEffect, useState } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import { ActivityInfo } from 'src/type'

const QuizResults = () => {
  const router = useRouter()
  const [activityInfo, setActivitiInfo] = useState<ActivityInfo | null>(null)
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
      setActivitiInfo(response.data.activity_info)
      const newQuestionResponse: IQuestionResultResponse = {
        meta: response.data.metadata,
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

  return (
    <FullScreenLayout title="">
      <div className="m-auto max-w-screen-lg overflow-x-auto overflow-y-hidden px-6">
        <div
          className="absolute right-6 top-[18px]  z-10 ml-auto cursor-pointer"
          onClick={() => {
            activityInfo !== null &&
              router.push(
                `/courses/${activityInfo?.class_id}/activity/${activityInfo?.activity_id}`,
              )
          }}
        >
          <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
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
export default QuizResults
QuizResults.layout = LAYOUT.FULLSCREEN_LAYOUT
