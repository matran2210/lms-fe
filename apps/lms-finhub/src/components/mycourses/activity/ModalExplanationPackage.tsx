import { useEffect, useState } from 'react'

import { PDFViewer, SappModal } from '@lms/ui'
import { ExplanationPackageV2 } from '@sapp-fe/explanation-package'
// import '@sapp-fe/explanation-package/dist/index.css'
import SappLoading from '@components/common/SappLoading'
import { CloseIcon } from '@lms/assets'
import { ActivityAPI } from 'src/api/activity'
import { TestServiceAPI } from 'src/api/test-api'

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
      const resultResponse = await ActivityAPI.getQuizAttemptsAnswer(id)
      const topicDescription = await TestServiceAPI.getTopicDescription(
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
      await TestServiceAPI.downloadFile(data)
    } catch (error) {}
  }

  return (
    <div>
      {/* {loading && (
        <div className="fixed left-0 top-0 right-0 bottom-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center z-[9999]">
          Loading
        </div>
      )} */}
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
            className="absolute right-6 top-[14px]  ml-auto cursor-pointer"
            onClick={() => setOpen(undefined)}
          >
            <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
          </div>
          <div className="mx-auto">
            <div className="mx-auto">
              {activeQuestion ? (
                <ExplanationPackageV2
                  getActiveQuestion={getActiveQuestion}
                  activeQuestion={activeQuestion}
                  document_id={document_id}
                  handleDownload={handleDownload}
                  renderPdf={({
                    url,
                    fileName,
                  }: {
                    url: string
                    fileName?: string | undefined
                  }) => {
                    return <PDFViewer file={url} />
                  }}
                />
              ) : (
                <SappLoading />
              )}
            </div>
          </div>
        </div>
      </SappModal>
    </div>
  )
}

export default ModalExplanationPackage
