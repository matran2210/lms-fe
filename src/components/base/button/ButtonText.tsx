import React from 'react'
import { IButtonProps } from 'src/type'

const ButtonText = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  type,
  isPaddingHorizontal = true,
  loading = false,
}: IButtonProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-[0.875rem] leading-4'
      : size === 'medium'
        ? 'text-[1rem] leading-6'
        : 'text-lg leading-6.5'
  let paddingVerticalClass =
    size === 'small' ? 'py-2' : size === 'medium' ? 'py-2' : 'py-2.8'
  let paddingHorizontalClass = isPaddingHorizontal
    ? size === 'small'
      ? 'px-7'
      : size === 'medium'
        ? 'px-8'
        : 'px-9'
    : ''
  let fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'
  let disabledClass = disabled
    ? 'text-[#DCDDDD] cursor-not-allowed'
    : 'text-[#050505] cursor-pointer'
  let componentClass = `${className} text-center ${fullWidthClass} ${paddingVerticalClass} ${paddingHorizontalClass} ${disabledClass} ${textSizeClass} font-semibold underline`

  if (link)
    return (
      <a href={link} className={componentClass} aria-disabled={disabled}>
        {title}
      </a>
    )

  return (
    <button
      className={componentClass}
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {title}
    </button>
  )
}

export default ButtonText
