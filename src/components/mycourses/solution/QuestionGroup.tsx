// components/SearchForm.tsx

import React from 'react'
import Icon from '@components/icons'

interface QuestionGroupProps {
  question: string
}

const QuestionGroup = ({ question }: QuestionGroupProps) => {
  return (
    <div className="flex justify-center py-4.5 bg-gray-3 shadow-solution w-full relative">
      <div className="heading flex items-center">
        <Icon type="ant-left" />
        <h3 className="mx-1">{question}</h3>
        <Icon type="ant-right" />
      </div>
      <div className="close-action absolute right-4 top-2 p-4 cursor-pointer">
        <Icon type="arrows" />
      </div>
    </div>
  )
}

export default QuestionGroup
