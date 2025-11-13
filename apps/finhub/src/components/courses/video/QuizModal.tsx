import SappModalV2 from '@components/base/modal/SappModalV2'
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
    <SappModalV2
      open={modalOpen}
      title={null}
      parentChildClass="snap-y flex-1 overflow-y-scroll bg-white -mr-4.5"
      okButtonCaption={`${finishAll ? 'Finish' : !isConfirmQuestion ? 'Submit' : 'Finish'}`}
      buttonSize="small"
      size="max-w-full"
      position="center"
      isInner={true}
      isBordered={true}
      okButtonClass="!h-9.5"
      cancelButtonClass="!h-9.5"
      footerButtonClassName="!justify-between flex flex-row-reverse"
      onOk={handleSubmit(onSubmit)}
      handleCancel={onCancel}
      closeAfterSubmit={false}
      cancelButtonCaption={`${finishAll ? '' : !isConfirmQuestion ? 'Skip' : ''}`}
      classNameModal="quiz-modal"
      footer={null}
      isCancelUnderLine={false}
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
          modalOpen={modalOpen}
        />
      </div>
    </SappModalV2>
  )
}
