import { CloseIcon } from '@assets/icons'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { LAYOUT } from '@utils/constants'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package-dat-test'
import { IQuestionResultResponse } from 'quiz-result-package-dat-test/dist/type'
import { useEffect, useState } from 'react'
import { PageLink } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import { ActivityInfo } from 'src/type'
import Layout from '@components/layout'

const QuizResults = ({ isTeacher = false }: { isTeacher?: boolean }) => {
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
        attempt_info: response?.data?.attempt_info,
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
    <FullScreenLayout title="Quiz result" className="!bg-gray-4">
      <div className="m-auto max-w-[1570px] overflow-x-auto overflow-y-hidden">
        <div
          className="absolute right-6 top-[18px] z-10 ml-auto cursor-pointer"
          onClick={() => {
            activityInfo !== null &&
              router.push(
                `${isTeacher ? PageLink.TEACHER_MY_COURSE : '/courses'}/${activityInfo?.class_id}/activity/${activityInfo?.activity_id}`,
              )
          }}
        >
          <CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />
        </div>
        <Layout
          size="md"
          title="Quiz Result"
          showSidebar={false}
          className="bg-gray-4"
        >
          <div className="m-auto overflow-x-auto overflow-y-hidden">
            {modalResult?.questions?.data?.length > 0 && (
              <QuizResultComponent
                questionResponse={modalResult?.questions || []}
                getTable={getTable}
                onShowDetail={(e) => {
                  router.push(
                    `${isTeacher ? PageLink.TEACHER_EXPLANATION : '/explanation'}/${e.id}?title=Entrance Test`,
                  )
                }}
                loading={loading}
                is_lms_v2
              />
            )}
          </div>
        </Layout>
      </div>
    </FullScreenLayout>
  )
}
export default QuizResults
QuizResults.layout = LAYOUT.FULLSCREEN_LAYOUT
