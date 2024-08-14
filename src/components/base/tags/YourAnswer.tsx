import React from 'react'

type Props = {
  show: boolean
}

const YourAnswer = ({ show }: Props) => {
  return (
    <>
      {show && (
        <div className="ml-3 inline-block max-h-5.5 whitespace-nowrap rounded-sm border border-gray-2 bg-gray-4 px-2 text-ssm font-normal text-bw-1">
          Your Answer
        </div>
      )}
    </>
  )
}

export default YourAnswer
