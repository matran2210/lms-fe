import React, { useEffect, useState } from 'react'

import CourseActivityApi from '../../../redux/services/Course/MyCourse/Activity'
import { ExplanationPackage } from 'explanation-package'
import 'explanation-package/dist/index.css'

export enum QUESTION_LEVELS {
  FUNDAMENTAL = 'FUNDAMENTAL',
  ADVANCED = 'ADVANCED',
}

export enum QUESTION_TYPES {
  TRUE_FALSE = 'TRUE_FALSE',
  ONE_CHOICE = 'ONE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MATCHING = 'MATCHING',
  SELECT_WORD = 'SELECT_WORD',
  FILL_WORD = 'FILL_WORD',
  DRAG_DROP = 'DRAG_DROP',
  ESSAY = 'ESSAY',
}

const ModalExplanationPackage = () => {
  const [activeQuestion, setActiveQuestion] = useState<any>()
  useEffect(() => {
    getActiveQuestion('ec8910e3-7b06-4375-9bb2-3dd677be503b')
  }, [])

  const getActiveQuestion = async (id: string) => {
    // const quizAttempts = axiosInstance.get('')
    // const selectedResponseAnswers = data.data.selectedResponseAnswers
    const resultResponse = await CourseActivityApi.getQuizAttemptsAnswer(id)

    // const newActiveQuestion = { ...selectedResponseAnswers[0].question }
    setActiveQuestion({
      ...resultResponse.data.answer.question,
      confirmed: true,
      corrects: getCorrect(
        resultResponse.data.answer.answer_position_mapping?.[0]
          ? resultResponse.data.answer.answer_position_mapping
          : resultResponse.data.answer.question.question_matchings,
        resultResponse.data.answer.question.qType,
      ),
      answers:
        resultResponse.data?.answer?.answer_position_mapping?.answers || [],
      myAnswers: [
        {
          question_id: resultResponse.data.answer.question.id,
          question_answer_id: resultResponse.data.answer.id,
          answer: resultResponse.data.answer.answer,
        },
      ],
      defaultValue: resultResponse.data.answer.answer,
      next: resultResponse.data.next,
      previous: resultResponse.data.previous,
      total_question: resultResponse.data.total_question,
      index: resultResponse.data.index,
    })
  }

  function getCorrect(answers: any, questionType: any) {
    switch (questionType as QUESTION_TYPES) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        const correctAnswers = answers
        const corrects = Object.fromEntries(
          correctAnswers.map((answer: any) => [answer.id, answer.is_correct]),
        )
        return corrects
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return Object.fromEntries(
          (answers || []).map((originalAnswer: any) => [
            originalAnswer.id,
            originalAnswer.is_correct,
          ]),
        )
      case QUESTION_TYPES.FILL_WORD:
      case QUESTION_TYPES.SELECT_WORD:
        return answers || []
      case QUESTION_TYPES.MATCHING:
        return answers || []
      case QUESTION_TYPES.DRAG_DROP:
        return answers || []
      default:
        return {}
    }
  }

  return (
    <div>
      <ExplanationPackage
        getActiveQuestion={getActiveQuestion}
        activeQuestion={activeQuestion}
      />
    </div>
  )
}

export default ModalExplanationPackage
