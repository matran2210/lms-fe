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
    <div className="mb-1 mt-4 px-1 text-center text-medium-sm xl:mb-7">
      <span className="text-gray-1">{text1}</span>{' '}
      <span className="text-bw-1">{text2}</span>.
      <div className="mt-0.5 text-gray-1">{text3}</div>
    </div>
  )
}

export default ContentTestCongratution
