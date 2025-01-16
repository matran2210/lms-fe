import React from 'react'
import Icon from '@components/icons'
interface SolutionAnswerProps {
  message: string
  isYourAnswer: boolean
  isCorrect: boolean
}

const SolutionAnswer = ({
  message,
  isYourAnswer,
  isCorrect,
}: SolutionAnswerProps) => {
  let classParent = isYourAnswer
    ? isCorrect
      ? 'text-state-success'
      : 'text-state-error'
    : 'text-bw-1'

  return (
    <>
      <div
        className={`mb-4 flex items-center gap-x-3 text-base ${classParent}`}
      >
        {isYourAnswer ? (
          <>
            <Icon type="group-fill" className="h-[1.125rem] w-[1.125rem]" />
          </>
        ) : (
          <>
            <Icon type="group-empty" className="h-[1.125rem] w-[1.125rem]" />
          </>
        )}
        <div className="w-fit">
          {message}
          {isYourAnswer && (
            <span className="ml-3 inline-block border-default bg-gray-4 px-2 py-0.5 text-ssm text-bw-1">
              Your Answer
            </span>
          )}
        </div>
      </div>
    </>
  )
}

export default SolutionAnswer
