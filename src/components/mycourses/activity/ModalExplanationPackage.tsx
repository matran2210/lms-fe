import { useEffect, useState } from 'react'

import { ExplanationPackageV2 } from 'explanation-package'
// import 'explanation-package/dist/index.css'
import { AltArrowLeft } from '@assets/icons'
import { UploadAPI } from 'src/pages/api/upload'
import { CoursesAPI } from 'src/pages/api/courses'
import { ActivityAPI } from '../../../pages/api/activity/index'
import { Modal } from 'antd'
import SappLoading from 'src/common/SappLoading'
import { CloseIconV2 } from '@components/icons'

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
  setOpen: () => void
  document_id?: string
}) => {
  const [activeQuestion, setActiveQuestion] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  const getActiveQuestion = async (id: string) => {
    setLoading(true)
    try {
      const resultResponse = await ActivityAPI.getQuizAttemptsAnswer(id)
      const topicDescription = await CoursesAPI.getTopicDescription(
        resultResponse?.data?.answer?.question?.question_topic_id,
        resultResponse?.data?.answer?.quiz_attempt?.quiz?.id,
      )
      setActiveQuestion({
        ...resultResponse?.data?.answer?.question,
        answer_file: resultResponse.data.answer.answer_file,
        active: resultResponse.data.answer.active,
        confirmed: true,
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
            question_answer_id: resultResponse.data.answer?.question_answer_id,
            answer: resultResponse?.data?.answer?.answer,
          },
        ],
        defaultValue: resultResponse?.data?.answer?.answer,
        next: resultResponse?.data?.next,
        previous: resultResponse?.data?.previous,
        total_question: resultResponse?.data?.total_question,
        index: resultResponse?.data?.index,
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
          correctAnswers.map((answer: any) => [answer?.id, answer?.is_correct]),
        )
        return corrects
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return Object.fromEntries(
          (answers || []).map((originalAnswer: any) => [
            originalAnswer?.id,
            originalAnswer?.is_correct,
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

  return (
    <Modal
      open={open}
      title=""
      onOk={setOpen}
      onCancel={setOpen}
      footer={[]}
      closable={false}
      //   closeIcon={<CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />}
      style={{ top: 0, left: 0, padding: 0, maxWidth: '100%', height: '100%' }}
      width="100vw"
      centered={false}
      classNames={{
        content:
          'bg-white w-screen h-screen !max-w-none !rounded-none overflow-hidden !p-0',
      }}
    >
      <div>
        <div
          className="absolute left-8 top-5 z-10 cursor-pointer"
          onClick={() => setOpen()}
        >
          <div className="hidden rounded-md bg-gray-200 p-2 transition-all duration-300 ease-in-out hover:bg-gray-300 md:block">
            <AltArrowLeft />
          </div>
          <div className="rounded-md bg-gray-200 p-2 transition-all duration-300 ease-in-out hover:bg-gray-300 md:hidden">
            <CloseIconV2 className="h-[18px] w-[18px]" />
          </div>
        </div>
        <div className="mx-auto">
          <div className="mx-auto">
            {activeQuestion ? (
              <ExplanationPackageV2
                getActiveQuestion={getActiveQuestion}
                activeQuestion={activeQuestion}
                document_id={document_id}
                handleDownload={handleDownload}
              />
            ) : (
              <SappLoading />
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalExplanationPackage
