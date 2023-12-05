import React, { useState } from 'react'
import SolutionAnswer from './SolutionAnswer'

interface SolutionListAnswerProps {
  question: string
  solutionListAnswers: any[]
}

const SolutionListAnswer: React.FC<SolutionListAnswerProps> = ({
  solutionListAnswers,
  question,
}) => {
  return (
    <>
      <h3 className="text-base text-bw-1 font-semibold mb-4">{question}</h3>
      {solutionListAnswers.map((solutionListAnswer, index) => (
        <>
          <SolutionAnswer
            message={solutionListAnswer.message}
            isYourAnswer={solutionListAnswer.isYourAnswer}
            isCorrect={solutionListAnswer.isCorrect}
          />
        </>
      ))}
    </>
  )
}

export default SolutionListAnswer
