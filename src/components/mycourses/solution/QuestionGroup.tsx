// components/SearchForm.tsx

import React from 'react'
import Icon from '@components/icons'

interface QuestionGroupProps {
  question: string
}

const QuestionGroup = ({ question }: QuestionGroupProps) => {
  return (
    <div className="py-4.5 relative flex w-full justify-center bg-[#F1F1F1] shadow-solution">
      <div className="heading flex items-center">
        <Icon type="ant-left" />
        <h3 className="mx-1">{question}</h3>
        <Icon type="ant-right" />
      </div>
      <div className="close-action absolute right-4 top-2 cursor-pointer p-4">
        <Icon type="arrows" />
      </div>
    </div>
  )
}

export default QuestionGroup
