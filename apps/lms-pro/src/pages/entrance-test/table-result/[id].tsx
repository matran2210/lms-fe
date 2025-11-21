import { CloseIcon } from '@lms/assets'
import { LAYOUT } from '@lms/core'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package'
import { IQuestionResultResponse } from 'quiz-result-package/dist/type'
import { useEffect, useState } from 'react'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from '@lms/contexts'
import { CoursesAPI } from '../../api/courses/index'
import { FullScreenLayout, Layout } from '@lms/ui'
import CloseModalIcon from '@lms/assets/CloseModalIcon'
import { PageLink } from 'src/constants/routers'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  MENU_ITEMS_EVENT,
} from 'src/constants/menu-items'
import { NotificationAPI } from '@pages/api/notification'

const TableEntranceResult = () => {
  const router = useRouter()
  const { id, attempt } = router.query
  const [loading, setLoading] = useState<boolean>(false)
  const [modalResult, setModalResult] = useState<{
    status?: boolean
    questions?: any
    id?: string
    result_answer?: {
      total_correct_answers: number
      total_question: number
    }
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
      const response = await CoursesAPI.getQuizAttemptsTableEntranceTest(
        id || modalResult?.id || '',
        {
          page_index,
          page_size,
        },
      )
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
        result_answer: response.data.result_answer,
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

  const searchParams =
    attempt && attempt !== 'undefined' ? `attempt=${attempt}` : ''

  return (
    <FullScreenLayout title="Entrance test result" className="!bg-gray-4">
      <div>
        <div
          className="fixed right-8 top-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gray-200 transition-colors hover:bg-gray-300"
          onClick={() => {
            router.push(`/entrance-test/test-result/${id}?${searchParams}`)
          }}
        >
          <CloseModalIcon />
        </div>
      </div>
      <Layout
        fullWidth
        title="Entrance Test Result"
        showSidebar={false}
        pageLink={PageLink}
        menuItems={MENU_ITEMS}
        menuItemsEvent={MENU_ITEMS_EVENT}
        menuBottom={MENU_BOTTOM}
        api={CoursesAPI}
        notificationApi={NotificationAPI}
      >
        <div className="">
          {modalResult?.questions?.data?.length > 0 && (
            <QuizResultComponent
              questionResponse={modalResult?.questions || []}
              getTable={getTable}
              onShowDetail={(e) => {
                router
                  .push(
                    `/explanation/${e.id}?title=Entrance Test&${searchParams}`,
                  )
                  .then(() => window.location.reload())
              }}
              loading={loading}
              showTotal={false}
              is_lms_v2
            />
          )}
        </div>
      </Layout>
    </FullScreenLayout>
  )
}
export default withAuthorization([UserType.STUDENT])(TableEntranceResult)
TableEntranceResult.layout = LAYOUT.FULLSCREEN_LAYOUT
