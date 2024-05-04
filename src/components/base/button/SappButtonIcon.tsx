import React, { ReactNode } from 'react'

interface IProps {
  title?: string
  children: ReactNode
  onClick?: (e?: any) => void
  className?: string
  link?: string | undefined
  loading?: boolean
  disabled?: boolean
  classTitle?: string
  isBgPrimary?: boolean
  isTextPrimary?: boolean
  download?: boolean
  target?: '_blank' | '_parent' | '_self'
}

const SappButtonIcon = ({
  title,
  children,
  onClick,
  className = '',
  link,
  loading,
  disabled,
  classTitle,
  isBgPrimary = false,
  isTextPrimary = false,
  download,
  target
}: IProps) => {
  if (link) {
    return (
      <a onClick={onClick} target={target} href={link} download={download} className={`${className} bg-${isBgPrimary ? 'primary' : 'white'} ${isBgPrimary ? 'primary' : 'border border-solid border-[#404041] button-icon'} flex items-center h-8 min-w-[120px] justify-center`}>
        {children}
        <div className={`${classTitle} font-medium text-sm ms-2 ${isTextPrimary ? 'text-white' : 'text-bw-1'}`}>{title}</div>
      </a>
    )
  }

  return (
    <button
      className={`${className} bg-${isBgPrimary ? 'primary' : 'white'} ${isBgPrimary ? 'primary' : 'border border-solid border-[#404041] button-icon'} flex items-center h-8 min-w-[120px] justify-center`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {children}
      <div className={`${classTitle} font-medium text-sm ms-2 ${isTextPrimary ? 'text-white' : 'text-bw-1'}`}>{title}</div>
    </button>
  )
}

export default SappButtonIcon
