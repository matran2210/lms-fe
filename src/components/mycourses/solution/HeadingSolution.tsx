// components/SearchForm.tsx

import React from 'react'
import Icon from '@components/icons'

interface IProps {
  question: string
}

const HeadingSolution = ({ question }: IProps) => {
  return (
    <div className="py-4.5 relative flex w-full justify-center bg-[#F1F1F1]">
      <div className="heading flex items-center">
        <Icon type="ant-left" />
        <h3 className="mx-1">{question}</h3>
        <Icon type="ant-right" />
      </div>
    </div>
  )
}

export default HeadingSolution
