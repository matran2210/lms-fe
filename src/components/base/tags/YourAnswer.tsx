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
        <span
          className={clsx(
            'inline-block max-h-[22px] whitespace-nowrap rounded border-none bg-info-50 p-[2px_8px] px-2 text-sm font-normal text-info-500',
            className,
          )}
        >
          Your Answer
        </span>
      )}
    </>
  )
}

export default YourAnswer
