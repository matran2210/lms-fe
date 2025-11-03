import React from 'react'

const SappDisplayText = ({
  text,
  className = '',
}: {
  text: string
  className?: string | undefined
}) => {
  return (
    <React.Fragment>
      {text.split('\n').map((item, index) => (
        <React.Fragment key={index}>
          <div className={`break-words font-sans text-base ${className}`}>
            {item}
          </div>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export default SappDisplayText
