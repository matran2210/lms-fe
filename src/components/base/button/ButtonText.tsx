import React from 'react'
import Link from 'next/link'
import { IButtonProps } from 'src/type'

const ButtonText = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  type = 'button',
  isPaddingHorizontal = true,
  loading = false,
}: IButtonProps) => {
  const isDisabled = disabled || loading

  const textSizeClass =
    size === 'small'
      ? 'text-[0.875rem] leading-4'
      : size === 'medium'
        ? 'text-[1rem] leading-6'
        : 'text-lg leading-6.5'

  const paddingVerticalClass =
    size === 'small' ? 'py-2' : size === 'medium' ? 'py-2' : 'py-2.8'

  const paddingHorizontalClass = isPaddingHorizontal
    ? size === 'small'
      ? 'px-7'
      : size === 'medium'
        ? 'px-8'
        : 'px-9'
    : ''

  const fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'

  const disabledClass = isDisabled
    ? 'text-gray-2 cursor-not-allowed'
    : 'text-bw-1 cursor-pointer'

  const componentClass = `
    ${className}
    text-center
    ${fullWidthClass}
    ${paddingVerticalClass}
    ${paddingHorizontalClass}
    ${disabledClass}
    ${textSizeClass}
    font-semibold
    underline
  `.trim()

  const buttonContent = loading ? 'Loading...' : title

  if (link) {
    return (
      <Link href={link} className={componentClass} aria-disabled={isDisabled}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={componentClass}
      onClick={onClick}
      disabled={isDisabled}
    >
      {buttonContent}
    </button>
  )
}

export default ButtonText
