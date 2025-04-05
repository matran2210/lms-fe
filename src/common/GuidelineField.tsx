import React from 'react'

interface Props {
  guideline: Array<string> | undefined
  classString?: string
}

const GuidelineField = ({ guideline, classString = 'mt-1' }: Props) => {
  return (
    <>
      {guideline && (
        <>
          {guideline && guideline.length < 2 ? (
            <div
              className={`${classString} sapp-guideline text-xsm font-semibold text-gray-2`}
            >
              {guideline.map((str, index) => (
                <React.Fragment key={index}>
                  {str}
                  <br />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className={`${classString} sapp-guideline font-semibold`}>
              {guideline?.map((str, index) => (
                <React.Fragment key={index}>
                  • {str}
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default GuidelineField
