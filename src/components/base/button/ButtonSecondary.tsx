import React from 'react'
import Link from 'next/link'
import { IButtonProps } from 'src/type'
import SpinIcon from './SpinIcon'

interface IButtonSecondaryProps extends IButtonProps {
  isSecondaryButton?: boolean
}

const ButtonSecondary = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  loading = false,
  disabled = false,
  isSecondaryButton = true,
}: IButtonSecondaryProps) => {
  const isDisabled = disabled || loading

  const textSizeClass =
    size === 'small'
      ? 'text-[0.875rem] leading-4'
      : size === 'medium'
        ? 'text-[1rem] leading-6'
        : 'text-lg leading-6.5'

  const paddingVerticalClass =
    size === 'small' ? 'py-2' : size === 'medium' ? 'py-2' : 'py-2.8'

  const paddingHorizontalClass =
    size === 'small' ? 'px-7' : size === 'medium' ? 'px-8' : 'px-9'

  const fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'

  const componentClass = `
    text-center 
    ${fullWidthClass} 
    ${paddingVerticalClass} 
    ${paddingHorizontalClass} 
    text-bw-1 
    ${textSizeClass} 
    font-medium 
    bg-gray-3 
    ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} 
    ${isSecondaryButton ? 'secondary' : ''} 
    ${className}
  `.trim()

  const buttonContent = loading ? (
    <div className="flex items-center justify-center space-x-2">
      <SpinIcon />
      <span>Loading...</span>
    </div>
  ) : (
    <span>{title}</span>
  )

  if (link) {
    return (
      <Link href={link} className={componentClass} aria-disabled={isDisabled}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <button
      className={componentClass}
      onClick={onClick}
      disabled={isDisabled}
      type="button"
    >
      {buttonContent}
    </button>
  )
}

export default ButtonSecondary
