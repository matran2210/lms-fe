import React from 'react'
import BaseButton from './BaseButton'
import { IButtonBaseProps } from '@lms/core'

const ButtonSecondaryV2 = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  disabled = false,
  startIcon,
  endIcon,
  full = false,
  children,
  ...props
}: IButtonBaseProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-v2-sm'
      : size === 'medium'
        ? 'text-v2-sm md:text-v2-base'
        : 'text-v2-sm md:text-v2-lg'
  let padding =
    size === 'small'
      ? 'py-[7px] px-[15px]'
      : size === 'medium'
        ? 'py-[7px] px-[15px] md:py-[11px] md:px-[23px]'
        : 'py-[7px] px-[15px] md:py-[15px] md:px-[31px]'

  let fullWidthClass = full ? 'block w-full' : 'inline-block'
  let disabledClass = disabled
    ? 'cursor-not-allowed !bg-gray-v2-100 b!text-gray-v2-400 hover:!bg-gray-v2-100 hover:b!text-gray-v2-400 hover:!border-gray-100'
    : 'cursor-pointer'

  let componentClass = `
    text-center
    text-secondary-v2-DEFAULT
    hover:!text-secondary-v2-DEFAULT
    bg-transparent
    rounded-lg
    border border-secondary-v2-DEFAULT
    hover:!border-secondary-v2-DEFAULT
    hover:!bg-gray-v2-100
    box-border
    font-medium
    ${padding}
    ${textSizeClass}
    ${fullWidthClass}
    ${disabledClass} 
    ${className}
  `

  return (
    <BaseButton
      className={`${componentClass}`}
      onClick={onClick}
      disabled={disabled}
      link={link}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        {startIcon && <div className="w-full">{startIcon}</div>}
        <div className="w-full">{title || children}</div>
        {endIcon && <div className="w-full">{endIcon}</div>}
      </div>
    </BaseButton>
  )
}

export default ButtonSecondaryV2
