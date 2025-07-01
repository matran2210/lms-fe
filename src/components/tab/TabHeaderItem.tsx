import React from 'react'

interface IProps {
  icon: React.ReactNode
  title: string
}
const TabHeaderItem = ({ icon, title }: IProps) => {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-2">
      {icon}
      <span>{title}</span>
    </div>
  )
}

export default TabHeaderItem
