import React from 'react'

const ContentTestCongratution = ({
  text1,
  text2,
  text3,
}: {
  text1: string
  text2: string
  text3: string
}) => {
  return (
    <div className="px-1 text-center text-sm">
      <span className="text-[#A1A1A1]">{text1}</span>{' '}
      <span className="font-medium text-gray-800">{text2}</span>.
      <div className="mt-0.5 text-[#A1A1A1]">{text3}</div>
    </div>
  )
}

export default ContentTestCongratution
