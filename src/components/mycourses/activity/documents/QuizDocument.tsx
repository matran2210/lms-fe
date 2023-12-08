import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import SappIcon from 'src/common/SappIcon'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  confirmQuestion,
  courseActivityQuizReducer,
  fetchQuestionById,
} from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz' // Import confirmQuestion from quizSlice

import { IQuestion } from 'src/type/course/Question'
import QuizComponent from './QuizComponent'

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
  const { control: controlAnswer, setValue, reset, getValues } = useForm()

  const questionsList = selector[activityId]?.[tabId]?.[quizId]?.questions || []

  const activeQuestion = questionsList[activeQuestionIndex]
  const isLastQuestion = activeQuestionIndex === questions.length - 1
  const isQuestionConfirmed = activeQuestion?.confirmed

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

      reset()
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

      reset()
    }
  }

  const handleConfirmQuestion = () => {
    if (activeQuestion) {
      dispatch(
        confirmQuestion({
          activityId: activityId,
          tabId: tabId,
          quizId: quizId,
          questionId: activeQuestion.id || '',
          myAnswers: getValues(),
        }),
      )
    }
  }

  return (
    <div>
      <div className="border border-gray-3 p-6">
        {activeQuestion && (
          <QuizComponent
            setValue={setValue}
            activeQuestion={activeQuestion}
            controlAnswer={controlAnswer}
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
            onClick={handleNextQuestion}
          >
            <SappIcon icon="arrow_right" />
          </div>
        </div>
        {!!isQuestionConfirmed && (
          <div
            className={`bg-gray-1 h-8 w-24 cursor-pointer select-none font-semibold text-white text-center text-medium-sm flex items-center justify-center hover:bg-gray-2 ${
              isLastQuestion ? 'opacity-50' : ''
            }`}
            onClick={handleNextQuestion}
          >
            Next
          </div>
        )}
        {!isQuestionConfirmed && (
          <div
            className={`bg-gray-1 h-8 w-24 cursor-pointer select-none font-semibold text-white text-center text-medium-sm flex items-center justify-center hover:bg-gray-2 ${
              isLastQuestion ? 'opacity-50' : ''
            }`}
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
