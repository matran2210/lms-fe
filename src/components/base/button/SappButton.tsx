import React from 'react'
import { IButtonProps } from 'src/type'

const SIZES = {
  small: 'text-[0.875rem] leading-4',
  medium: 'text-[1rem] leading-6',
  lager: 'text-lg leading-6.5',
  extra: 'text-lg leading-6.5',
}

const COLORS = {
  primary: 'primary',
  info: 'bg-info hover:bg-info-2 disabled:bg-info-2 text-white',
  success: 'bg-success hover:bg-success-2 disabled:bg-success-2 text-white',
  secondary: 'bg-gray-3 hover:bg-secondary-4 disabled:bg-secondary-4 text-bw-1',
  danger: 'bg-danger hover:bg-danger-2 disabled:bg-danger-2 text-white',
  warning: 'bg-warning hover:bg-warning-2 disabled:bg-warning-2 text-white',
  light: 'bg-light hover:bg-light-2 disabled:bg-light-2 text-white',
  dark: 'bg-dark hover:bg-dark-2 disabled:bg-dark-2 text-white',
  white:
    'bg-white hover:bg-primary-2 disabled:bg-white text-gray-1 hover:text-white',
  outline:
    'bg-white border-bw-1 hover:border-gray-1 hover:text-gray-1 text-bw-1',
  text: 'bg-none text-bw-1 hover:text-gray-1 disabled:text-gray-2 underline-offset-2 font-medium',
  textUnderline:
    'bg-none text-bw-1 hover:text-gray-1 disabled:text-gray-2 underline-offset-2 underline font-medium',
  quizActivity: 'bg-gray-1 hover:bg-gray-2 disabled:bg-gray-2 text-white',
}

const PADDINGS = {
  small: 'px-7 h-8',
  medium: 'px-8 py-2',
  lager: 'px-9 py-2.8',
  extra: 'px-17.5 py-2.8',
  none: '',
}

const COLOR_LOADING = {
  primary: 'bg-white',
  info: 'bg-white',
  success: 'bg-white',
  secondary: 'bg-bw-1',
  danger: 'bg-white',
  warning: 'bg-white',
  light: 'bg-white',
  dark: 'bg-white',
  white: 'bg-gray-1',
  outline: 'bg-gray-1',
  text: 'bg-none',
  textUnderline: 'bg-none',
  quizActivity: 'bg-white',
}

const SappButton = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  loading = false,
  type,
  color = 'primary',
  isUnderLine,
  isPadding = true,
  childClass = '',
  classNameLoading = '',
}: IButtonProps) => {
  let fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'
  let paddingClass = isPadding ? PADDINGS[size] : PADDINGS['none']
  let componentClass = `${className} cursor-pointer relative text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-medium  ${SIZES[size]} ${COLORS[color]} ${fullWidthClass} ${paddingClass}`

  isUnderLine = isUnderLine ?? color === 'text'
  componentClass += ` ${isUnderLine ? 'hover:underline' : ''}`

  if (link)
    return (
      <a href={link} className={componentClass} aria-disabled={disabled}></a>
    )
  return (
    <button
      className={`${componentClass} ${classNameLoading}`}
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className={`flex justify-center items-center`}>
          <span className="sr-only">Loading...</span>
          <div
            className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s] ${COLOR_LOADING[color]}`}
          ></div>
          <div
            className={`h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s] ${COLOR_LOADING[color]}`}
          ></div>
          <div
            className={`h-2 w-2 rounded-full animate-bounce ${COLOR_LOADING[color]}`}
          ></div>
        </div>
      ) : (
        <span className={`${loading ? 'invisible' : ''} ${childClass}`}>
          {title}
        </span>
      )}
    </button>
  )
}

export default SappButton
