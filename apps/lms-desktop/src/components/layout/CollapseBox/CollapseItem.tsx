import React from 'react'

type IProps = {
  title?: string
  body?: string | React.ReactNode
  className?: string
}

function CollapseItem({ title, body, className }: IProps) {
  return (
    <div className={`grid grid-cols-3 ${className}`}>
      <div className="text-sm text-secondary">{title}</div>
      <div className="col-span-2 text-sm text-primary">{body}</div>
    </div>
  )
}

export default CollapseItem
