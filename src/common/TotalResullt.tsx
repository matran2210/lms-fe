import React from 'react'

interface IProps {
  total: number
  className?: string
}

const TotalResullt = ({ total, className = '' }: IProps) => {
  return (
    <div
      className={`text-medium-sm border-r border-gray-1 pr-6 font-normal text-gray-1 ${className}`}
    >
      {`${total} ${total > 1 ? 'Results' : 'Result'}`}
    </div>
  )
}

export default TotalResullt
