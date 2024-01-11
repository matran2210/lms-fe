import { useEffect, useRef, useState } from 'react'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityQuizReducer,
  fetchQuestionById,
  selectQuestions,
  submitQuestion,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import SappModal from '@components/base/modal/SappModal'
import { QuizResultComponent } from 'quiz-result-package'
import { IQuestionResultResponse } from 'quiz-result-package/dist/type'
import CourseActivityApi from 'src/redux/services/Course/MyCourse/Activity'
import { IQuestion } from 'src/type/course/Question'
import QuizComponent, { QuizComponentRef } from './QuizComponent'

type Props = {
  questions: IQuestion[]
  activityId: string
  tabId: string
  quizId: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
}

const QuizDocument = ({
  questions,
  activityId,
  tabId,
  quizId,
  grading_preference,
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

  const [modalResult, setModalResult] = useState<{
    status?: boolean
    questions?: any
    id?: string
  }>()

  useEffect(() => {
    if (questions?.[0]) {
      // Load the first question when the component mounts
      dispatch(
        fetchQuestionById({
          activityId: activityId,
          tabId: tabId,
          quizId: quizId,
          questionId: questions[0]?.id || '',
        }),
      )
    }
  }, [questions, dispatch])

  useEffect(() => {
    if (runHandleFinishQuiz > 1) {
      handleFinishQuiz()
    }
  }, [runHandleFinishQuiz])

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)

      // Load the next question if it hasn't been loaded yet
      const nextQuestionId = questions[activeQuestionIndex + 1]?.id
      if (nextQuestionId) {
        dispatch(
          fetchQuestionById({
            activityId: activityId,
            tabId: tabId,
            quizId: quizId,
            questionId: nextQuestionId || '',
          }),
        )
      }

      questionRef.current?.reset()
    }
  }

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1)

      // Load the previous question if it hasn't been loaded yet
      const prevQuestionId = questions[activeQuestionIndex - 1]?.id
      if (prevQuestionId) {
        dispatch(
          fetchQuestionById({
            activityId: activityId,
            tabId: tabId,
            quizId: quizId,
            questionId: prevQuestionId || '',
          }),
        )
      }

      questionRef.current?.reset()
    }
  }

  const handleConfirmQuestion = (isFinish: boolean = false) => {
    if (activeQuestion) {
      questionRef.current?.onSubmit({
        activityId: activityId,
        tabId: tabId,
        quizId: quizId,
        then: () => {
          if (isFinish) {
            setRunHandleFinishQuiz((e) => e + 1)
          }
        },
      })
    }
  }

  const handleFinishQuiz = () => {
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
      dispatch(
        submitQuestion({
          id: quizId,
          data: { answers, quiz_position_mapping },
        }),
      )
        .unwrap()
        .then((e: any) => {
          getTable({ id: e.quizAttemptId, page_index: 1, page_size: 10 })
        })
    } catch (error) {}
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

  return (
    <div>
      <div className="border border-gray-3 p-6">
        {activeQuestion && (
          <QuizComponent
            showCorrect={grading_preference === 'AFTER_EACH_QUESTION'}
            activeQuestion={activeQuestion}
            ref={questionRef}
          />
        )}
      </div>

      <div className="min-h-[50px] bg-gray-3 flex items-center py-2 px-6">
        <div className="text-state-info bg-state-info bg-opacity-10 whitespace-nowrap px-1 py-0.5 font-semibold text-center text-medium-sm text-[11px]">
          Graded Activity
        </div>
        <div className="w-fit mx-auto flex items-center gap-3">
          <div
            className={`cursor-pointer select-none ${
              activeQuestionIndex === 0 ? 'opacity-50' : ''
            }`}
            onClick={handlePrevQuestion}
          >
            <SappIcon icon="arrow_left" />
          </div>
          Question: {activeQuestionIndex + 1} of {questions?.length || 0}
          <div
            className={`cursor-pointer select-none ${
              isLastQuestion ? 'opacity-50' : ''
            }`}
            onClick={() => {
              if (grading_preference !== 'AFTER_EACH_QUESTION') {
                handleConfirmQuestion(false)
              }
              handleNextQuestion()
            }}
          >
            <SappIcon icon="arrow_right" />
          </div>
        </div>

        <div
          className={`bg-gray-1 h-8 w-24 cursor-pointer select-none font-semibold text-white text-center text-medium-sm flex items-center justify-center hover:bg-gray-2`}
          onClick={
            isLastQuestion
              ? () => handleConfirmQuestion(true)
              : () => {
                  if (grading_preference !== 'AFTER_EACH_QUESTION') {
                    handleConfirmQuestion(false)
                  }
                  handleNextQuestion()
                }
          }
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </div>

        {!isQuestionConfirmed &&
          grading_preference === 'AFTER_EACH_QUESTION' && (
            <div
              className={`bg-gray-1 h-8 w-24 cursor-pointer select-none font-semibold text-white text-center text-medium-sm flex items-center justify-center hover:bg-gray-2`}
              onClick={() => handleConfirmQuestion(false)}
            >
              Confirm
            </div>
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
      >
        <QuizResultComponent
          questionResponse={modalResult?.questions || []}
          getTable={getTable}
        />
      </SappModal>
    </div>
  )
}

export default QuizDocument
