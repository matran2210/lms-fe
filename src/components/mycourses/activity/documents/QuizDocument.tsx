import { useEffect, useRef, useState } from 'react'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  courseActivityQuizReducer,
  fetchQuestionById,
  submitQuestion,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import { IQuestion } from 'src/type/course/Question'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import toast from 'react-hot-toast'

type Props = {
  questions: IQuestion[]
  activityId: string
  tabId: string
  quizId: string
}

const QuizDocument = ({
  questions,
  activityId,
  tabId,
  quizId,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector(courseActivityQuizReducer)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const questionRef = useRef<QuizComponentRef>(null)

  const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []

  const activeQuestion = questionsList[activeQuestionIndex]
  const isLastQuestion = activeQuestionIndex === questions.length - 1
  const isQuestionConfirmed = activeQuestion?.confirmed

  const [isFinish, setIsFinish] = useState<{ [key: string]: true }>()

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

  const handleConfirmQuestion = () => {
    if (activeQuestion) {
      questionRef.current?.onSubmit({
        activityId: activityId,
        tabId: tabId,
        quizId: quizId,
      })
    }
  }

  const handleFinishQuiz = () => {
    const {
      answers,
      quiz_position_mapping,
    }: { answers: any[]; quiz_position_mapping: any[] } = questionsList.reduce(
      (acc: any, obj: any) => {
        if (obj?.myAnswers) {
          acc.answers = acc.answers.concat(obj.myAnswers)
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
        .then(() => {
          toast.success('Nộp bài thành công!')
          setIsFinish({ [quizId]: true })
        })
    } catch (error) {}
  }

  return (
    <div>
      <div className="border border-gray-3 p-6">
        {activeQuestion && (
          <QuizComponent activeQuestion={activeQuestion} ref={questionRef} />
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
            onClick={handleNextQuestion}
          >
            <SappIcon icon="arrow_right" />
          </div>
        </div>
        {(!!isQuestionConfirmed || isFinish?.[quizId]) && (
          <div
            className={`bg-gray-1 h-8 w-24 cursor-pointer select-none font-semibold text-white text-center text-medium-sm flex items-center justify-center hover:bg-gray-2`}
            onClick={
              isLastQuestion && !isFinish?.[quizId]
                ? handleFinishQuiz
                : handleNextQuestion
            }
          >
            {isLastQuestion && !isFinish?.[quizId] ? 'Finish' : 'Next'}
          </div>
        )}
        {!isQuestionConfirmed && !isFinish?.[quizId] && (
          <div
            className={`bg-gray-1 h-8 w-24 cursor-pointer select-none font-semibold text-white text-center text-medium-sm flex items-center justify-center hover:bg-gray-2`}
            onClick={handleConfirmQuestion}
          >
            Confirm
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizDocument
