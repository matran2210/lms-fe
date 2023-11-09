import React from 'react'
import { IButtonProps } from 'src/type'

const ButtonPrimary = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
}: IButtonProps) => {
  let fontSizeClass =
    size === 'small' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'
  let paddingVerticalClass =
    size === 'small' ? 'py-2' : size === 'medium' ? 'py-1.8' : 'py-0.5'
  let fullWidthClass = full ? 'block mx-0' : 'inline-block mx-auto'

  if (link)
    return (
      <a
        href={link}
        className={`${className} text-center ${fullWidthClass} ${paddingVerticalClass} px-8 text-white ${fontSizeClass} bg-[#FFB800]`}
      >
        {title}
      </a>
    )

  return (
    <div
      className={`${className} text-center ${fullWidthClass} ${paddingVerticalClass} px-8 text-white ${fontSizeClass} bg-[#FFB800]`}
      onClick={onClick}
    >
      <span className="">{title}</span>
    </div>
  )
}

export default ButtonPrimary
