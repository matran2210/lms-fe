import React from 'react'
import { IButtonBaseProps } from 'src/type'
import BaseButton from './BaseButton'

const ButtonTextV2 = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  disabled = false,
  startIcon,
  endIcon,
  full = false,
  isUnderLine = true,
  children,
  ...props
}: IButtonBaseProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-v2-sm'
      : size === 'medium'
        ? 'text-v2-sm md:text-v2-base'
        : 'text-v2-sm md:text-v2-lg'

  let fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'
  let disabledClass = disabled
    ? 'cursor-not-allowed !bg-transparent !text-secondary-v2-100 hover:!text-secondary-v2-100'
    : 'cursor-pointer'

  let isUnderline = isUnderLine ? 'underline' : ''

  let componentClass = `
    p-0
    text-center 
    font-medium
    !border-none
    text-gray-v2-800
    hover:text-primary
    ${isUnderline}
    ${fullWidthClass} 
    ${disabledClass} 
    ${textSizeClass} 
    ${className} 
  `

  return (
    <BaseButton
      className={componentClass}
      onClick={onClick}
      disabled={disabled}
      link={link}
      {...props}
    >
      <div className="flex items-center gap-2">
        {startIcon && <div className="w-full">{startIcon}</div>}
        <div className="w-full">{title || children}</div>
        {endIcon && <div className="w-full">{endIcon}</div>}
      </div>
    </BaseButton>
  )
}

export default ButtonTextV2
