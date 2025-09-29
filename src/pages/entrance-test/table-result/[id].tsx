import { CloseIcon } from '@assets/icons'
import Layout from '@components/layout'
import { LAYOUT } from '@utils/constants'
import { useRouter } from 'next/router'
import { QuizResultComponent } from 'quiz-result-package'
import { IQuestionResultResponse } from 'quiz-result-package/dist/type'
import { useEffect, useState } from 'react'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { CoursesAPI } from '../../api/courses/index'

const TableEntranceResult = () => {
  const router = useRouter()
  const { id } = router.query
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

  return (
    <>
      <div className="relative">
        <div className="shadow-entrance-test flex flex-col items-center justify-between bg-white p-4 md:p-2.5">
          <h2 className="text-base font-semibold md:text-2xl">Entrance Test</h2>
          <div className="mt-1 hidden md:block">
            <span className="text-gray-800">
              Result:{' '}
              {(() => {
                const totalCorrect =
                  modalResult?.result_answer?.total_correct_answers
                const totalQuestion = modalResult?.result_answer?.total_question
                const hasValidData =
                  (totalCorrect || totalCorrect === 0) && totalQuestion

                return hasValidData ? (
                  <strong className="text-info">
                    {totalCorrect}/{totalQuestion}
                  </strong>
                ) : (
                  <strong className="text-info">__ /{totalQuestion}</strong>
                )
              })()}
            </span>
          </div>
        </div>
        <div
          className="absolute right-4 top-4 z-10 cursor-pointer rounded-md bg-progress-active p-1 md:right-8 md:top-5 md:p-2"
          onClick={() => {
            router.push(`/entrance-test/test-result/${id}`)
          }}
        >
          <CloseIcon className="h-4.5 w-4.5 transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary md:h-6 md:w-6" />
        </div>
      </div>
      <Layout size="md" title="Entrance Test Result" showSidebar={false}>
        <div className="m-auto">
          {modalResult?.questions?.data?.length > 0 && (
            <QuizResultComponent
              questionResponse={modalResult?.questions || []}
              getTable={getTable}
              onShowDetail={(e) =>
                router
                  .push(`/explanation/${e.id}?title=Entrance Test`)
                  .then(() => window.location.reload())
              }
              loading={loading}
              showTotal={false}
              is_lms_v2={true}
            />
          )}
        </div>
      </Layout>
    </>
  )
}
export default withAuthorization([UserType.STUDENT])(TableEntranceResult)
TableEntranceResult.layout = LAYOUT.FULLSCREEN_LAYOUT
