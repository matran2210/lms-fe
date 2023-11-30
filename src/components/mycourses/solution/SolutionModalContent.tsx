import React, { useState } from 'react'
import Icon from '@components/icons'
import SolutionListAnswer from './SolutionListAnswer'

interface SolutionModalContentProps {
  topic: string
  solution: string
  type1column: boolean
}

// define solutionListAnswers
const solutionListAnswers = [
  {
    message:
      'Cash flows in the future must be discounted at appropriate interest rates to find the equivalent.',
    isYourAnswer: true,
    isCorrect: false,
  },
  {
    message: 'Lorem ipsum dolor sit amet consectetur.',
    isYourAnswer: false,
    isCorrect: false,
  },
  {
    message:
      'Cash flows in the future must be discounted at appropriate interest rates to find the equivalent present value, time value of money equates cash flows that occur on different dates.',
    isYourAnswer: true,
    isCorrect: true,
  },
]

const SolutionModalContent = ({
  topic,
  solution,
  type1column,
}: SolutionModalContentProps) => {
  let classModalParent = type1column
    ? 'max-w-dl mx-auto block'
    : 'w-full flex gap-x-6 bg-gray-3'

  let classModalContent = type1column ? '' : 'w-1/2 p-6 pb-0 bg-white'

  let classModalSolutionGroup = type1column ? '' : 'max-h-full overflow-y-auto'

  return (
    <div
      className={`pt-6 ${classModalParent} overflow-y-auto h-[calc(100vh-60px)]`}
    >
      <div
        className={`topic ${classModalContent} text-base text-bw-1 [&>p]:mb-6 [&>img]:my-6 [&>img]:mx-auto [&>img]:max-w-[225px] [&>.content]:max-h-full [&>.content]:overflow-y-auto`}
        dangerouslySetInnerHTML={{ __html: topic }}
      ></div>
      <div className={`content ${classModalContent}`}>
        <div className={`solution ${classModalSolutionGroup}`}>
          <div className="question-part pb-2">
            <SolutionListAnswer
              question="Question: With a one-year interest rate of 5%, receiving $100 today is equivalent to receiving $105 in one year."
              solutionListAnswers={solutionListAnswers}
            />
          </div>
          <div className="solution-part bg-gray-4 p-6 pb-5">
            <h3 className="text-base text-bw-1 mb-4 font-semibold">Solution</h3>
            <div
              className="solution text-base text-bw-1 [&>p]:mb-6"
              dangerouslySetInnerHTML={{ __html: solution }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolutionModalContent
