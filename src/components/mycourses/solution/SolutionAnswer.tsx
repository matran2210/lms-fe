import React, { useState } from 'react'
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
        className={`flex gap-x-3 items-center text-base mb-4 ${classParent}`}
      >
        {isYourAnswer ? (
          <>
            <Icon type="group-fill" className="w-[18px] h-[18px]" />
          </>
        ) : (
          <>
            <Icon type="group-empty" className="w-[18px] h-[18px]" />
          </>
        )}
        <div className="w-fit">
          {message}
          {isYourAnswer && (
            <span className="ml-3 inline-block bg-gray-4 border-default text-bw-1 text-ssm py-0.5 px-2">
              Your Answer
            </span>
          )}
        </div>
      </div>
    </>
  )
}

export default SolutionAnswer
