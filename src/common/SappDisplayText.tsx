import React from 'react'

const SappDisplayText = ({
  text,
  className = '',
}: {
  text: string
  className?: string | undefined
}) => {
  return <pre className={`mb-2 font-sans text-base ${className}`}>{text}</pre>
}

export default SappDisplayText
