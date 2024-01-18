import { ExplanationPackage } from 'explanation-package'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { httpService } from 'src/redux/services/httpService'
import { QUESTION_TYPES } from 'src/type/course/Question'
import 'explanation-package/dist/index.css'
import { LAYOUT } from '@utils/constants'
// import {} from 'explanation-package'
const Explanation = () => {
  const router = useRouter()
  const [activeQuestion, setActiveQuestion] = useState<any>()
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
  const getActiveQuestion = async (id: string) => {
    // const quizAttempts = axiosInstance.get('')
    // const selectedResponseAnswers = data.data.selectedResponseAnswers
    try {
      const resultResponse = (await httpService.GET({
        uri: 'quiz-attempts/answers/' + id,
      })) as any
      // const newActiveQuestion = { ...selectedResponseAnswers[0].question }
      setActiveQuestion({
        ...resultResponse.data.answer.question,
        confirmed: true,
        corrects: getCorrect(
          resultResponse.data.answer.question.answers?.[0]
            ? resultResponse.data.answer.question.answers
            : resultResponse.data.answer.question.question_matchings,
          resultResponse.data.answer.question.qType,
        ),
        answers: resultResponse.data?.answer?.question.answers || [],
        myAnswers: [
          {
            question_id: resultResponse.data.answer.question.id,
            question_answer_id: resultResponse.data.answer.question_answer_id,
            answer: resultResponse.data.answer.answer,
          },
        ],
        defaultValue: resultResponse.data.answer.answer,
        next: resultResponse.data.next,
        previous: resultResponse.data.previous,
        total_question: resultResponse.data.total_question,
        index: resultResponse.data.index,
      })
    } catch (err) {}
  }

  useEffect(() => {
    if (router.query.id) {
      getActiveQuestion(router.query.id as string)
    }
  }, [router.query.id])

  //todo: call api, make UI
  // return <></>

  return (
    <div>
      <ExplanationPackage
        getActiveQuestion={getActiveQuestion}
        activeQuestion={activeQuestion}
      />
    </div>
  )
}
export default Explanation
Explanation.layout = LAYOUT.FULLSCREEN_LAYOUT
