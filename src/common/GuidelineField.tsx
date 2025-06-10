import clsx from 'clsx'
import React from 'react'

interface Props {
  guideline: Array<string> | undefined
  classString?: string
}

const GuidelineField = ({ guideline, classString = 'mt-1' }: Props) => {
  return (
    guideline?.length && (
      <div
        className={clsx(
          'sapp-guideline',
          guideline.length < 2
            ? 'text-xsm font-semibold text-[#DCDDDD]'
            : 'font-semibold',
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

export default GuidelineField
