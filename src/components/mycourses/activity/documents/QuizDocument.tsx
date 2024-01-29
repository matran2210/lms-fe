import { useEffect, useRef, useState } from 'react'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityQuizReducer,
  fetchQuestionById,
  removeQuizFinished,
  selectQuestions,
  submitQuestion,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import { CloseIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { QuizResultComponent } from 'quiz-result-package'
import {
  IQuestionResult,
  IQuestionResultResponse,
} from 'quiz-result-package/dist/type'
import toast from 'react-hot-toast'
import ConFirmSubmit from 'src/pages/test/conFirmSubmit'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { IQuestion } from 'src/type/course/Question'
import ModalExplanationPackage from '../ModalExplanationPackage'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SappButton from '@components/base/button/SappButton'

type Props = {
  questions: IQuestion[]
  activityId: string
  tabId: string
  quizId: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
  document_id: string
  is_graded?: boolean
  setOpenFile?: any
}

const QuizDocument = ({
  questions,
  activityId,
  tabId,
  quizId,
  grading_preference,
  document_id,
  is_graded,
  setOpenFile,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityQuizReducer)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const questionRef = useRef<QuizComponentRef>(null)

  const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []

  const activeQuestion = questionsList[activeQuestionIndex]
  const isLastQuestion = activeQuestionIndex === questions.length - 1
  const isQuestionConfirmed = activeQuestion?.confirmed

  const [runHandleFinishQuiz, setRunHandleFinishQuiz] = useState<number>(1)

  const [loading, setLoading] = useState<boolean>(false)

  const [modalResult, setModalResult] = useState<{
    status?: boolean
    questions?: any
    id?: string
  }>()

  const [quizComponentKey, setQuizComponentKey] = useState<number>(1)

  const [openFinishQuiz, setOpenFinishQuiz] = useState<boolean>(false)

  const [showQuestionResultDetail, setShowQuestionResultDetail] = useState<{
    id: string
    isOpen: boolean
  }>()

  useEffect(() => {
    ;(async () => {
      if (questions?.[0]) {
        // Load the first question when the component mounts
        try {
          dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: questions[0]?.id || '',
            }),
          )
        } catch (error) {}
      }
    })()
  }, [questions, dispatch])

  useEffect(() => {
    if (runHandleFinishQuiz > 1) {
      setOpenFinishQuiz(true)
    }
  }, [runHandleFinishQuiz])

  const handleNextQuestion = async () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)

      // Load the next question if it hasn't been loaded yet
      const nextQuestionId = questions[activeQuestionIndex + 1]?.id
      if (nextQuestionId) {
        try {
          await dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: nextQuestionId || '',
            }),
          )
        } catch (error) {}
      }

      questionRef.current?.reset()
    }
  }

  const handlePrevQuestion = async () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1)

      // Load the previous question if it hasn't been loaded yet
      const prevQuestionId = questions[activeQuestionIndex - 1]?.id
      if (prevQuestionId) {
        try {
          await dispatch(
            fetchQuestionById({
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: prevQuestionId || '',
            }),
          )
        } catch (error) {}
      }

      questionRef.current?.reset()
    }
  }

  const handleConfirmQuestion = (isFinish: boolean = false) => {
    setLoading(true)
    if (activeQuestion) {
      questionRef.current?.onSubmit({
        activityId: activityId,
        tabId: tabId,
        quizId: quizId,
        then: () => {
          if (isFinish) {
            setRunHandleFinishQuiz((e) => e + 1)
          }
          setLoading(false)
        },
        onFinally: () => {
          setLoading(false)
        },
      })
    }
  }

  const handleFinishQuiz = async () => {
    setOpenFinishQuiz(false)
    setLoading(true)
    const questions = selectQuestions(selector, activityId, tabId, quizId || '')
    const {
      answers,
      quiz_position_mapping,
    }: { answers: any[]; quiz_position_mapping: any[] } = questions?.reduce(
      (acc: any, obj: any) => {
        if (obj?.myAnswers) {
          acc.answers = acc.answers.concat({ ...obj.myAnswers })
        }
        if (obj?.quiz_position_mapping) {
          acc.quiz_position_mapping = acc.quiz_position_mapping.concat(
            obj.quiz_position_mapping,
          )
        }

        return acc
      },
      { answers: [] as any[], quiz_position_mapping: [] as any[] },
    )

    try {
      await dispatch(
        submitQuestion({
          id: quizId,
          data: { answers, quiz_position_mapping },
        }),
      )
        .unwrap()
        .then((e: any) => {
          getTable({ id: e.quizAttemptId, page_index: 1, page_size: 10 })

          dispatch(
            removeQuizFinished({
              activityId,
              tabId,
              quizId: quizId,
            }),
          )
          setLoading(false)
          setQuizComponentKey((e) => e + 1)
          setActiveQuestionIndex(0)
        })
    } catch (error: any) {
      if (error.response.status === 422) {
        toast.error('Có lỗi xảy ra khi gửi bình luận nộp bài!')
      }
    } finally {
      setLoading(false)
    }
  }

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
      const response = await CourseActivityApi.getQuizAttemptsTable(
        id || modalResult?.id || '',
        {
          page_index,
          page_size,
        },
      )

      const newQuestionResponse: IQuestionResultResponse = {
        meta: response.data.meta,
        data: (modalResult?.questions?.data || []).concat(
          response.data.answers?.map((e: any) => {
            return {
              id: e.id,
              content: e.question.question_content,
              section: e.question.question_filter_id?.part?.name,
              type: e.question.qType,
              is_correct: e.is_correct,
              time_spent: e.time_spent,
              question: e.question as any,
              active: e.active,
            }
          }) || [],
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

  const handleShowQuestionResultDetail = (data: IQuestionResult) => {
    setShowQuestionResultDetail({ id: data.id, isOpen: true })
  }

  return (
    <div>
      <ConFirmSubmit
        open={openFinishQuiz}
        setOpen={setOpenFinishQuiz}
        handleSubmit={handleFinishQuiz}
        handleCancel={() => {}}
      ></ConFirmSubmit>

      <div className="border border-gray-3 p-6">
        {activeQuestion && (
          <QuizComponent
            activityId={activityId}
            tabId={tabId}
            quizId={quizId}
            showCorrect={grading_preference === 'AFTER_EACH_QUESTION'}
            activeQuestion={activeQuestion}
            ref={questionRef}
            key={quizComponentKey}
            document_id={document_id}
            setOpenFile={setOpenFile}
          />
        )}
      </div>

      <div className="min-h-[50px] bg-gray-3 flex items-center py-2 px-6">
        <div
          className={`${
            is_graded || 'invisible'
          } text-state-info bg-state-info bg-opacity-10 whitespace-nowrap px-1 py-0.5 font-semibold text-center text-medium-sm text-[11px]`}
        >
          Graded Activity
        </div>

        <div className="w-fit mx-auto flex items-center gap-3">
          <div
            className={`cursor-pointer select-none ${
              activeQuestionIndex === 0 || loading ? 'opacity-50' : ''
            }`}
            onClick={() => {
              if (loading) {
                return
              }
              handlePrevQuestion()
            }}
          >
            <SappIcon icon="arrow_left" />
          </div>
          Question: {activeQuestionIndex + 1} of {questions?.length || 0}
          <div
            className={`cursor-pointer select-none ${
              isLastQuestion || loading ? 'opacity-50' : ''
            }`}
            onClick={() => {
              if (loading) {
                return
              }
              if (grading_preference !== 'AFTER_EACH_QUESTION') {
                handleConfirmQuestion(false)
              }
              handleNextQuestion()
            }}
          >
            <SappIcon icon="arrow_right" />
          </div>
        </div>
        {(isQuestionConfirmed ||
          grading_preference !== 'AFTER_EACH_QUESTION' ||
          (isQuestionConfirmed && isLastQuestion)) && (
          <SappButton
            title={isLastQuestion ? 'Finish' : 'Next'}
            full={false}
            size={'small'}
            onClick={() => {
              if (loading) {
                return
              }
              if (isLastQuestion) {
                handleConfirmQuestion(true)
              } else {
                if (grading_preference !== 'AFTER_EACH_QUESTION') {
                  handleConfirmQuestion(false)
                }
                handleNextQuestion()
              }
            }}
            color="quizActivity"
            loading={loading}
          />
        )}
        {!isQuestionConfirmed &&
          grading_preference === 'AFTER_EACH_QUESTION' && (
            <SappButton
              title={'Confirm'}
              full={false}
              size={'small'}
              onClick={() => {
                if (!loading) {
                  handleConfirmQuestion(false)
                }
              }}
              color="quizActivity"
              loading={loading}
            />
          )}
      </div>
      <SappModal
        open={modalResult?.status}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        handleCancel={() => setModalResult(undefined)}
        handleSubmit={() => setModalResult(undefined)}
        setOpen={() => setModalResult(undefined)}
        size="max-w-xxl"
        position="center"
        showFooter={false}
        isFullScreen={true}
        refClass="h-full md:px-6 px-5 pb-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all"
        showHeader={false}
      >
        <div>
          <div
            className="ml-auto cursor-pointer absolute  right-6 top-4.5"
            onClick={() => setModalResult(undefined)}
          >
            <CloseIcon className="transition-all stroke-bw-1 ease-in-out duration-300 transform group-hover:stroke-primary" />
          </div>
          <div className="max-w-[1114px] mx-auto">
            <QuizResultComponent
              questionResponse={modalResult?.questions || []}
              getTable={getTable}
              onShowDetail={handleShowQuestionResultDetail}
              loading={loading}
            />
          </div>
        </div>
      </SappModal>
      <ModalExplanationPackage
        quizAttemptsAnswerId={showQuestionResultDetail?.id || ''}
        open={showQuestionResultDetail?.isOpen || false}
        setOpen={() => setShowQuestionResultDetail(undefined)}
      ></ModalExplanationPackage>
    </div>
  )
}

export default QuizDocument
