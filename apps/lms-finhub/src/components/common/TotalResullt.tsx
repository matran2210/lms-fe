import React from 'react'

interface IProps {
  total: number
  className?: string
}

const TotalResullt = ({ total, className = '' }: IProps) => {
  return (
    <div
      className={`border-r border-gray pr-6 text-sm font-normal text-gray ${className}`}
    >
      {`${total} ${total > 1 ? 'Results' : 'Result'}`}
    </div>
  )
}

export default TotalResullt
