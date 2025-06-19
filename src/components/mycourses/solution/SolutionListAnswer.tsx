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
      <h3 className="mb-4 text-base font-semibold text-[#050505]">
        {question}
      </h3>
      {solutionListAnswers.map((solutionListAnswer, index) => (
        <>
          <SolutionAnswer
            message={solutionListAnswer?.message}
            isYourAnswer={solutionListAnswer?.isYourAnswer}
            isCorrect={solutionListAnswer?.isCorrect}
          />
        </>
      ))}
    </>
  )
}

export default SolutionListAnswer
