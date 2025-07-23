import SappModal from '@components/base/modal/SappModal'
import QuizComponent, {
  QuizComponentRef,
} from '@components/mycourses/activity/documents/QuizComponent'
import { useForm } from 'react-hook-form'
import { RefObject } from 'react'
import { IActivityStateQuestion } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'

type Props = {
  modalOpen: boolean
  onSubmit: () => void
  onCancel: () => void
  finishAll: boolean
  isConfirmQuestion: boolean
  questionRef: RefObject<QuizComponentRef>
  activeQuestion: IActivityStateQuestion | undefined
  activityId: string
  tabId: string
  quizId: string
  document_id: string
  grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
}

export default function QuizModal({
  modalOpen,
  onSubmit,
  onCancel,
  finishAll,
  isConfirmQuestion,
  questionRef,
  activeQuestion,
  activityId,
  tabId,
  quizId,
  document_id,
  grading_preference,
}: Props) {
  const { handleSubmit } = useForm()

  return (
    <SappModal
      open={modalOpen}
      customTitle={<div className="!text-xl font-bold text-bw-1">Question</div>}
      parentChildClass="snap-y flex-1 overflow-y-scroll bg-white -mr-4.5"
      okButtonCaption={`${finishAll ? 'Finish' : !isConfirmQuestion ? 'Submit' : 'Finish'}`}
      buttonSize="small"
      size="max-w-full"
      position="center"
      isInner={true}
      isBordered={true}
      okButtonClass="!w-20 h-8.5 !px-0"
      cancelButtonClass="!w-20 h-8.5 !px-0 !w-fit"
      footerButtonClassName="!justify-between flex"
      handleSubmit={handleSubmit(onSubmit)}
      handleCancel={onCancel}
      closeAfterSubmit={false}
      colorCancel="textUnderline"
      cancelButtonCaption={`${finishAll ? '' : !isConfirmQuestion ? 'Skip' : ''}`}
    >
      <div className="py-5">
        <QuizComponent
          activityId={activityId}
          tabId={tabId}
          quizId={quizId}
          ref={questionRef}
          activeQuestion={activeQuestion}
          showCorrect={true}
          document_id={document_id}
          grading_preference={grading_preference}
        />
      </div>
    </SappModal>
  )
}
