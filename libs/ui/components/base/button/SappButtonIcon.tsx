import clsx from 'clsx'
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
  type?: 'button' | 'submit' | 'reset'
  ishover?: boolean
}

const SappButtonIcon = ({
  title,
  children,
  onClick,
  className = '',
  link,
  loading,
  disabled,
  classTitle = '',
  isBgPrimary = false,
  isTextPrimary = false,
  ishover = true,
  download,
  target,
  type,
}: IProps) => {
  if (link) {
    return (
      <a
        onClick={onClick}
        target={target}
        href={link}
        download={download}
        className={`${className} bg-${isBgPrimary ? 'primary' : 'white'} ${
          isBgPrimary
            ? 'primary'
            : 'button-icon border border-solid border-secondary'
        } flex h-8 min-w-[120px] items-center justify-center`}
      >
        {children}
        <div
          className={`${classTitle} ms-2 text-sm font-medium ${
            isTextPrimary ? 'text-white' : 'text-[#050505]'
          }`}
        >
          {title}
        </div>
      </a>
    )
  }

  return (
    <button
      className={`${className} bg-${isBgPrimary ? 'primary' : 'white'} ${
        isBgPrimary ? 'primary' : 'border border-solid border-secondary'
      } ${clsx({ 'button-icon': ishover })} flex h-8 min-w-[120px] items-center justify-center`}
      onClick={onClick}
      disabled={loading || disabled}
      type={type ?? 'button'}
    >
      {children}
      <div
        className={`${classTitle} ms-2 text-sm font-medium ${
          isTextPrimary ? 'text-white' : 'text-[#050505]'
        }`}
      >
        {title}
      </div>
    </button>
  )
}

export default SappButtonIcon
