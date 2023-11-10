import React from 'react'
import { IButtonProps } from 'src/type'

const ButtonText = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
}: IButtonProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-[0.875rem] leading-4'
      : size === 'medium'
      ? 'text-[1rem] leading-6'
      : 'text-lg leading-6.5'
  let paddingVerticalClass =
    size === 'small' ? 'py-2' : size === 'medium' ? 'py-2' : 'py-2.8'
  let paddingHorizontalClass =
    size === 'small' ? 'px-7' : size === 'medium' ? 'px-8' : 'px-9'
  let fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'
  let componentClass = `${className} text-center ${fullWidthClass} ${paddingVerticalClass} ${paddingHorizontalClass} text-bw-1 ${textSizeClass} font-semibold underline cursor-pointer`

  if (link)
    return (
      <a href={link} className={componentClass}>
        {title}
      </a>
    )

  return (
    <div className={componentClass} role="button" onClick={onClick}>
      <span className="">{title}</span>
    </div>
  )
}

export default ButtonText
