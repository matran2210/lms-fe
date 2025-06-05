import clsx from 'clsx'
import React from 'react'

type Props = {
  show: boolean
  className?: string
}

const YourAnswer = ({ show, className }: Props) => {
  return (
    <>
      {show && (
        <div
          className={clsx(
            'ml-3 inline-block max-h-5.5 whitespace-nowrap rounded-sm border border-gray-2 bg-gray-4 px-2 text-ssm font-normal text-bw-1',
            className,
          )}
        >
          Your Answer
        </div>
      )}
    </>
  )
}

export default YourAnswer
