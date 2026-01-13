"use client"
import React, { useMemo } from 'react'
import parse, { Element } from 'html-react-parser'
import { Correct } from '@lms/utils'

interface CorrectAnswerProps {
  questionContent: string
  corrects: Correct[]
}

const CorrectAnswer: React.FC<CorrectAnswerProps> = ({
  questionContent,
  corrects,
}) => {
  // Đếm thứ tự slot để map với corrects
  let slotIdx = 0
  const htmlWithAnswers = useMemo(() => {
    return parse(questionContent, {
      replace: (domNode) => {
        if (
          domNode instanceof Element &&
          domNode.name === 'span' &&
          domNode.attribs?.class?.includes('question-content-tag')
        ) {
          const correct = corrects[slotIdx]
          slotIdx++
          if (correct) {
            return (
              <span key={domNode.attribs.id} className="text-success">
                {correct.answer}
              </span>
            )
          }
        }
        return undefined
      },
    })
    // eslint-disable-next-line
  }, [questionContent, corrects])

  return (
    <div>
      <div className="mb-4 text-base font-bold">Correct Answer:</div>
      <div>{htmlWithAnswers}</div>
    </div>
  )
}

export default CorrectAnswer
