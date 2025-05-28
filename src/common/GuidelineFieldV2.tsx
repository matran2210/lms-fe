import clsx from 'clsx'
import React from 'react'

interface Props {
  guideline?: Array<string>
  classString?: string
}

const GuidelineFieldV2 = ({ guideline, classString = '' }: Props) => {
  return (
    guideline?.length && (
      <div
        className={clsx(
          'text-xs ms-3 mt-1 justify-start font-normal leading-[18px] text-gray-11',
          classString,
        )}
      >
        {guideline.map((str, index) => (
          <React.Fragment key={index}>
            {guideline.length < 2 ? str : `• ${str}`}
            <br />
          </React.Fragment>
        ))}
      </div>
    )
  )
}

export default GuidelineFieldV2
