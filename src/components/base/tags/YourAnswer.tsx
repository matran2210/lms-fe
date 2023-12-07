import React from 'react'

type Props = {
  show: boolean
}

const YourAnswer = ({ show }: Props) => {
  return (
    <>
      {show && (
        <div className="whitespace-nowrap max-h-5.5 ml-3 text-ssm text-bw-1 font-normal inline-block px-2 border-gray-2 border rounded-sm bg-gray-4">
          Your Answer
        </div>
      )}
    </>
  )
}

export default YourAnswer
