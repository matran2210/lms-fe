import { useEffect, useRef, useState } from 'react'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityQuizReducer,
  fetchQuestionById,
  removeQuizFinished,
  selectQuestions,
  submitQuiz,
  saveAnswer,
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
import { IQuestion } from 'src/type/course/Question'
import ModalExplanationPackage from '../ModalExplanationPackage'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import SappButton from '@components/base/button/SappButton'
import { ANIMATION } from 'src/constants'
import { CoursesAPI } from '../../../../pages/api/courses/index'
import { trackGAEvent } from '@utils/google-analytics'
import { showPopup } from 'src/redux/slice/Popup/Result-test'
import { isValidatedAnswer } from '@utils/answer'

type Props = {
  questions: IQuestion[]
  activityId: string
  tabId: string
  quizId: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
  document_id: string
  is_graded?: boolean
  setOpenFile?: any
  class_user_id?: string
}

interface IAnswer {
  active: string
  id: string
  is_correct: false
  quiz_attempt_id: string
  time_spent: number
  topic_attempt_id: string
  question: {
    id: string
    qType: string
    question_content: string
    question_filter_id: {
      part: {
        name: string
      }
    }
  }
}

interface IAnswers {
  answers: IAnswer[]
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
  class_user_id,
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
  const [resultId, setResultId] = useState<string>('')

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
              questionId: questions?.[0]?.id || '',
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
    if (activeQuestionIndex < questions?.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)
      handleSaveAnswer()
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

      questionRef?.current?.reset()
    }
  }

  const handlePrevQuestion = async () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1)
      handleSaveAnswer()
      // Load the previous question if it hasn't been loaded yet
      const prevQuestionId = questions?.[activeQuestionIndex - 1]?.id
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
      questionRef?.current?.onSubmit({
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
  /**
   * Function: Xử lý việc lưu đáp án lên store trước khi chuyển sang câu khác
   */
  const handleSaveAnswer = () => {
    const myAnswers = questionRef?.current?.onSaveAnswer(
      activeQuestion,
    ) as unknown
    if (!activeQuestion?.confirmed) {
      dispatch(
        saveAnswer({
          activityId,
          tabId,
          quizId,
          myAnswers,
          question: activeQuestion,
        }),
      )
    }
  }

  const handleFinishQuiz = async () => {
    setOpenFinishQuiz(false)
    setLoading(true)
    const questions = selectQuestions(selector, activityId, tabId, quizId || '')
    // Handle: handle việc check xem đáp án đó đãn làm và có đáp án chưa chưa có thì sẽ return null
    const availableQuestions = questions?.map((item: any) => {
      if (isValidatedAnswer(item.myAnswers, item.qType)) {
        return item
      }
      return { ...item, myAnswers: null }
    })
    const {
      answers,
      quiz_position_mapping,
    }: { answers: any[]; quiz_position_mapping: any[] } =
      availableQuestions?.reduce(
        (acc: any, obj: any) => {
          if (obj?.myAnswers) {
            acc.answers = acc?.answers?.concat(...obj.myAnswers)
          }
          if (obj?.quiz_position_mapping) {
            acc.quiz_position_mapping = acc?.quiz_position_mapping?.concat(
              obj?.quiz_position_mapping,
            )
          }

          return acc
        },
        { answers: [] as any[], quiz_position_mapping: [] as any[] },
      )

    try {
      await dispatch(
        submitQuiz({
          id: quizId,
          data: { answers, quiz_position_mapping },
          class_user_id,
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
          if (e?.data?.class_user_score) {
            setTimeout(() => {
              dispatch(showPopup(e.data.class_user_score))
            }, 4000)
          }
        })
      reload()
    } catch (error: any) {
      if (error?.response?.status === 422) {
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
      const checkId = id || modalResult?.id
      if (checkId === resultId) return
      setResultId(id ?? modalResult?.id ?? '')
      const response = await CoursesAPI.getQuizAttemptsTable(
        id || modalResult?.id || '',
        {
          page_index,
          page_size,
        },
      )

      const newQuestionResponse: IQuestionResultResponse = {
        meta: response?.data?.meta,
        data: (modalResult?.questions?.data ?? []).concat(
          response?.data?.answer_groups?.flatMap((group: IAnswers) => {
            const answers = group?.answers?.map((answer: IAnswer) => {
              return {
                id: answer?.id,
                content: answer?.question?.question_content,
                section: answer?.question?.question_filter_id?.part?.name,
                type: answer?.question?.qType,
                is_correct: answer?.is_correct,
                time_spent: answer?.time_spent,
                question: answer?.question,
                active: answer?.active,
              }
            })
            return answers || []
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
    setShowQuestionResultDetail({ id: data?.id, isOpen: true })
  }

  return (
    <div>
      <ConFirmSubmit
        open={openFinishQuiz}
        setOpen={setOpenFinishQuiz}
        handleSubmit={handleFinishQuiz}
        handleCancel={() => {}}
      ></ConFirmSubmit>

      <div
        className="text-black-1 max-h-[500px] select-none overflow-auto border border-gray-2 p-6 "
        data-aos={ANIMATION.DATA_AOS}
      >
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
            grading_preference={grading_preference}
            showQuestionContent={false}
            isHideExhibit={false}
            saveAnswer={handleSaveAnswer}
          />
        )}
      </div>

      <div className="flex min-h-[50px] items-center bg-gray-3 px-6 py-2">
        <div
          className={`${
            is_graded || 'invisible'
          } whitespace-nowrap bg-state-info bg-opacity-10 px-1 py-0.5 text-center text-[11px] text-medium-sm font-semibold text-state-info`}
        >
          Graded Activity
        </div>

        <div className="mx-auto flex w-fit items-center gap-3">
          <div
            className={`cursor-pointer select-none ${
              activeQuestionIndex === 0 || loading ? 'opacity-50' : ''
            }`}
            onClick={() => {
              if (loading) {
                return
              }
              handlePrevQuestion()
              trackGAEvent('Click Prev Question Quiz Activity')
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
              trackGAEvent('Click Next Question Quiz Activity')
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
              if (
                isLastQuestion &&
                grading_preference === 'AFTER_EACH_QUESTION'
              ) {
                setRunHandleFinishQuiz((e) => e + 1)
                trackGAEvent('Click Button Finish Quiz Activity')
                return
              }
              if (
                isLastQuestion &&
                grading_preference !== 'AFTER_EACH_QUESTION'
              ) {
                handleConfirmQuestion(true)
                trackGAEvent('Click Button Confirm Quiz Activity')
              } else {
                if (grading_preference !== 'AFTER_EACH_QUESTION') {
                  handleConfirmQuestion(false)
                }
                handleNextQuestion()
                trackGAEvent('Click Button Next Quiz Activity')
              }
            }}
            color="primary"
            loading={loading}
          />
        )}
        {!isQuestionConfirmed &&
          grading_preference === 'AFTER_EACH_QUESTION' && (
            <SappButton
              title={'View Answer'}
              full={false}
              size={'small'}
              onClick={() => {
                if (!loading) {
                  handleConfirmQuestion(false)
                }
                trackGAEvent('Click Button Confirm Quiz Activity')
              }}
              color="primary"
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
        refClass="h-full md:px-6 px-5 pb-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all z-[100000]"
        showHeader={false}
      >
        <div className="relative">
          <div
            className="absolute right-6 top-5  ml-auto cursor-pointer"
            onClick={() => setModalResult(undefined)}
          >
            <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
          </div>
          <div className="mx-auto max-w-[1114px] overflow-auto">
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
