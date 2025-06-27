import React from 'react'

interface IProps {
  title: string
  onClick?: () => void
  icon: React.ReactNode
}
const CardMenuItem = ({ title, onClick, icon }: IProps) => {
  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center gap-1 text-white"
      onClick={onClick}
    >
      <div>{icon}</div>
      <div className="text-xs font-normal md:text-sm">{title}</div>
    </div>
  )
}

export default CardMenuItem
