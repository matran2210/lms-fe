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
        <span className={clsx("inline-block max-h-[22px] whitespace-nowrap rounded-sm border border-[#DCDDDD] bg-[#ECF0FD] px-2 text-xs font-normal text-[#3964EA]",
            className,
          )}>
          Your Answer
        </span>
      )}
    </>
  )
}

export default YourAnswer
