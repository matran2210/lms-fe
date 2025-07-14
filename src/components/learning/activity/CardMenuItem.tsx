import clsx from 'clsx'
import React from 'react'

interface IProps {
  title: string
  onClick?: () => void
  icon: React.ReactNode
  className?: string
}
const CardMenuItem = ({ title, onClick, icon, className }: IProps) => {
  return (
    <div
      className={clsx(
        'flex cursor-pointer flex-col items-center justify-center gap-1 text-white',
        className,
      )}
      onClick={onClick}
    >
      <div>{icon}</div>
      <div className="text-xs font-normal md:text-sm">{title}</div>
    </div>
  )
}

export default CardMenuItem
