import React from 'react'
import { IButtonBaseProps } from 'src/type'
import BaseButton from './BaseButton'
import Link from 'next/link'
import { IButtonProps } from 'src/type'
import LoadingBtnAnimation from '@assets/icons/LoadingBtnAnimation'

const ButtonText = ({
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
  loading,
  children,
  ...props
}: IButtonBaseProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-sm'
      : size === 'medium'
        ? 'text-sm md:text-base'
        : 'text-sm md:text-lg'

  let fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'
  let disabledClass = disabled
    ? 'cursor-not-allowed !text-secondary-100 hover:!text-secondary-100'
    : 'cursor-pointer'

  let isUnderline = isUnderLine ? 'underline' : ''

  let componentClass = `
    p-0
    text-center 
    font-medium
    !border-none
    text-gray-800
    !bg-transparent
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
        {loading ? (
          <LoadingBtnAnimation />
        ) : (
          <>
            {startIcon && <div className="w-full">{startIcon}</div>}
            <div className="w-full">{title || children}</div>
            {endIcon && <div className="w-full">{endIcon}</div>}
          </>
        )}
      </div>
    </BaseButton>
  )
}

export default ButtonText
