import React from 'react'

interface IProps {
  total: number
  className?: string
}

const TotalResullt = ({ total, className = '' }: IProps) => {
  return (
    <div
      className={`pr-6 border-r border-gray-1 text-medium-sm font-normal text-gray-1 ${className}`}
    >
      {`${total} ${total > 1 ? 'Results' : 'Result'}`}
    </div>
  )
}

export default TotalResullt
