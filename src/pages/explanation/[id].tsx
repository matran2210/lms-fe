import { ExplanationPackage } from 'explanation-package'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { QUESTION_TYPES } from 'src/type/course/Question'
import { LAYOUT } from '@utils/constants'
import { CloseIcon } from '@assets/icons'
import { UploadAPI } from 'src/pages/api/upload'
import { CoursesAPI } from '../api/courses'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { PageLink } from 'src/constants'

const Explanation = () => {
  const router = useRouter()
  const [activeQuestion, setActiveQuestion] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  function getCorrect(answers: any, questionType: any) {
    switch (questionType as QUESTION_TYPES) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        const correctAnswers = answers
        const corrects = Object?.fromEntries(
          correctAnswers?.map((answer: any) => [answer.id, answer.is_correct]),
        )
        return corrects
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return Object.fromEntries(
          (answers || [])?.map((originalAnswer: any) => [
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
    setLoading(true)
    try {
      // const quizAttempts = axiosInstance.get('')
      // const selectedResponseAnswers = data.data.selectedResponseAnswers
      const resultResponse = await CoursesAPI.getQuizAttempt(id)
      const topicDescription = await CoursesAPI.getTopicDescription(
        resultResponse?.data?.answer?.question?.question_topic_id,
        resultResponse?.data?.answer?.quiz_attempt?.quiz?.id,
      ) // const newActiveQuestion = { ...selectedResponseAnswers[0].question }
      setActiveQuestion({
        ...resultResponse.data.answer.question,
        program: resultResponse.data.program,
        answer_file: resultResponse.data.answer.answer_file,
        active: resultResponse.data.answer.active,
        confirmed: true,
        grading_question: resultResponse.data.answer.grading_question,
        corrects: getCorrect(
          resultResponse?.data?.answer?.question?.qType !==
            QUESTION_TYPES.MATCHING
            ? resultResponse?.data?.answer?.question?.answers
            : resultResponse?.data?.answer?.answer_matching_mapping,
          resultResponse?.data?.answer?.question?.qType,
        ),
        question_matchings:
          resultResponse?.data?.answer?.answer_matching_mapping,
        answers: resultResponse?.data?.answer?.question?.answers || [],
        myAnswers: [
          {
            question_id: resultResponse?.data?.answer?.question?.id,
            question_answer_id:
              resultResponse?.data?.answer?.question_answer_id,
            answer: resultResponse?.data?.answer?.answer,
          },
        ],
        defaultValue: resultResponse?.data?.answer?.answer,
        next: resultResponse?.data?.next,
        previous: resultResponse?.data?.previous,
        total_question: resultResponse?.data?.total_question,
        index: resultResponse?.data?.index,
        answer_position_mapping:
          resultResponse?.data?.answer?.answer_position_mapping,
        question_topic: topicDescription?.data,
        short_answer: resultResponse?.data?.answer?.short_answer,
        response_option_answer: resultResponse?.data?.answer?.response_option,
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.query.id) {
      getActiveQuestion(router.query.id as string)
    }
  }, [router.query.id])

  //todo: call api, make UI
  // return <></>

  const handleDownload = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      await UploadAPI.downloadFile(data)
    } catch (error) {}
  }

  return (
    <SappLoadingGlobal loading={loading}>
      <FullScreenLayout title="Detailed Explanation">
        <div
          className="absolute right-6 top-[14px] ml-auto cursor-pointer"
          onClick={() => {
            if (activeQuestion?.answer?.quiz_attempt?.id) {
              router.push(
                `/entrance-test/table-result/${activeQuestion?.answer?.quiz_attempt?.id}`,
              )
            } else {
              router.push(
                localStorage.getItem('previousUrl') ?? PageLink.ENTRANCE_TEST,
              )
            }
          }}
        >
          <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
        </div>
        <ExplanationPackage
          getActiveQuestion={getActiveQuestion}
          activeQuestion={activeQuestion}
          document_id={''}
          handleDownload={handleDownload}
        />
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}
export default Explanation
Explanation.layout = LAYOUT.FULLSCREEN_LAYOUT
