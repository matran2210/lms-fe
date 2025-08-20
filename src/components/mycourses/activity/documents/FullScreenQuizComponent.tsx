import React, { useRef, useEffect } from 'react'
import QuizComponent, { QuizComponentRef } from './QuizComponent'
import ButtonCancelSubmit from '@components/v2/base/button/ButtonCancelSubmit'
import { IActivityStateQuestion } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'
import { GRADING_PREFERENCE, QUIZ_MODAL_WIDTH } from 'src/constants'

interface FullScreenQuizComponentProps {
  modalOpen?: boolean
  finishAll?: boolean
  isConfirmQuestion?: boolean
  activityId: string
  tabId: string
  quizId: string
  questionRef?: React.RefObject<QuizComponentRef>
  activeQuestion?: IActivityStateQuestion
  document_id: string
  grading_preference: GRADING_PREFERENCE
  handleSubmitQuestion?: () => void
  handleCancelQuestion?: () => void
}

const FullScreenQuizComponent: React.FC<FullScreenQuizComponentProps> = ({
  modalOpen,
  finishAll,
  isConfirmQuestion,
  activityId,
  tabId,
  quizId,
  questionRef,
  activeQuestion,
  document_id,
  grading_preference,
  handleSubmitQuestion,
  handleCancelQuestion,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        handleCancelQuestion
      ) {
        handleCancelQuestion()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleCancelQuestion])

  if (!modalOpen) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-overlay-control">
      <div
        ref={modalRef}
        className="rounded-lg bg-white p-6 shadow-lg"
        style={{ width: QUIZ_MODAL_WIDTH }}
      >
        <div>
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
          <div className="pt-6 md:pt-10">
            <ButtonCancelSubmit
              className="flex flex-row-reverse justify-between"
              submit={{
                title: finishAll
                  ? 'Finish'
                  : !isConfirmQuestion
                    ? 'Submit'
                    : 'Finish',
                className: '!h-9.5',
                onClick: handleSubmitQuestion,
              }}
              cancel={{
                title: finishAll ? '' : !isConfirmQuestion ? 'Skip' : '',
                className: '!h-9.5',
                onClick: handleCancelQuestion,
                isUnderLine: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullScreenQuizComponent
