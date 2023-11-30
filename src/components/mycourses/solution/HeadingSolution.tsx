// components/SearchForm.tsx

import React, { useState } from 'react'
import Icon from '@components/icons'

interface IProps {
  question: string
}

const HeadingSolution = ({ question }: IProps) => {
  return (
    <div className="flex justify-center py-4.5 bg-gray-3 w-full relative">
      <div className="heading flex items-center">
        <Icon type="ant-left" />
        <h3 className="mx-1">{question}</h3>
        <Icon type="ant-right" />
      </div>
    </div>
  )
}

export default HeadingSolution
