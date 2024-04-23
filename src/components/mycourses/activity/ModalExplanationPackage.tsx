import { useEffect, useState } from 'react'

import SappModal from '@components/base/modal/SappModal'
import { ExplanationPackage } from 'explanation-package'
// import 'explanation-package/dist/index.css'
import CourseActivityApi from '../../../redux/services/Course/MyCourse/Activity'
import { CloseIcon } from '@assets/icons'
import { UploadAPI } from 'src/pages/api/upload'
import CourseTestApi from 'src/redux/services/Course/MyCourse/Test'
import { CoursesAPI } from 'src/pages/api/courses'

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

const ModalExplanationPackage = ({
  quizAttemptsAnswerId,
  open,
  setOpen,
  document_id = '',
}: {
  quizAttemptsAnswerId: string
  open: boolean
  setOpen: (open?: boolean) => void
  document_id?: string
}) => {
  const [activeQuestion, setActiveQuestion] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (quizAttemptsAnswerId) {
      getActiveQuestion(quizAttemptsAnswerId)
    }
  }, [quizAttemptsAnswerId])

  useEffect(() => {
    if (!open) {
      setActiveQuestion(undefined)
    }
  }, [open])

  const getActiveQuestion = async (id: string) => {
    setLoading(true)
    try {
      const resultResponse = await CourseActivityApi.getQuizAttemptsAnswer(id)
      const topicDescription = await CoursesAPI.getTopicDescription(
        resultResponse?.data?.answer?.question?.question_topic_id,
        resultResponse?.data?.answer?.quiz_attempt?.quiz?.id,
      )
      setActiveQuestion({
        ...resultResponse.data.answer.question,
        confirmed: true,
        corrects: getCorrect(
          resultResponse.data.answer.question.qType !== QUESTION_TYPES.MATCHING
            ? resultResponse.data.answer.question.answers
            : resultResponse.data.answer.answer_matching_mapping,
          resultResponse.data.answer.question.qType,
        ),
        question_matchings: resultResponse.data.answer.answer_matching_mapping,
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
        question_topic: topicDescription?.data,
        short_answer: resultResponse?.data?.answer?.short_answer,
        response_option_answer: resultResponse?.data?.answer?.response_option,
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
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

  const handleDownload = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      await UploadAPI.downloadFile(data)
    } catch (error) {}
  }

  return (
    <div>
      {loading && (
        <div className="fixed left-0 top-0 right-0 bottom-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-[9999]">
          Loading
        </div>
      )}
      <SappModal
        open={open}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        handleCancel={() => setOpen(undefined)}
        handleSubmit={() => setOpen(undefined)}
        setOpen={() => setOpen(undefined)}
        size="max-w-xxl"
        position="center"
        showFooter={false}
        isFullScreen={true}
        refClass="h-full md:px-0 px-5 pb-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all"
        showHeader={false}
      >
        <div>
          <div
            className="ml-auto cursor-pointer absolute  right-6 top-[14px]"
            onClick={() => setOpen(undefined)}
          >
            <CloseIcon className="transition-all stroke-bw-1 ease-in-out duration-300 transform group-hover:stroke-primary" />
          </div>
          <div className="mx-auto">
            <div className="mx-auto">
              <ExplanationPackage
                getActiveQuestion={getActiveQuestion}
                activeQuestion={activeQuestion}
                document_id={document_id}
                handleDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </SappModal>
    </div>
  )
}

export default ModalExplanationPackage
