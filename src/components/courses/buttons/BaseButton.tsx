import React from 'react'
import { SpinIcon } from '../icons'
import { IBaseButtonProps } from 'src/type/courses-3-level'
import Link from 'next/link'

export default function BaseButton({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  loading = false,
  disabled = false,
  variant = 'primary',
  type,
  icon,
  isSecondaryButton = true,
}: IBaseButtonProps) {
  const fullWidthClass = full ? 'block w-full' : 'inline-block w-fit'

  const sizeConfigs = {
    small: 'text-sm leading-5.5 py-2 px-4',
    medium:
      'text-sm leading-5.5 md:text-base md:leading-6 py-1.5 md:py-3 px-4 md:px-[31px] min-w-[92px] md:min-w-[120px]',
    lager: 'text-lg leading-6.5 py-2.8 px-9',
    extra: 'text-xl leading-6.5 py-2.8 px-9',
  }

  const isDisabled = disabled || loading

  const baseClass = `
    relative text-center rounded-sm font-medium outline-0
    ${fullWidthClass}
    ${sizeConfigs[size]}
    ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  const variantClass =
    variant === 'primary'
      ? 'text-white bg-primary hover:bg-primary-2'
      : variant === 'secondary'
        ? 'text-bw-1 bg-gray-3 hover:text-white hover:bg-primary'
        : variant === 'black'
          ? 'bg-bw-17 text-white rounded-lg hover:bg-bw-18'
          : 'bg-white text-gray-14 rounded-lg border border-black-1 hover:bg-bw-17 hover:text-white hover:border-0'

  const componentClass = `${baseClass} ${variantClass}`.trim()

  if (link) {
    return (
      <Link href={link} className={componentClass} aria-disabled={isDisabled}>
        {title}
      </Link>
    )
  }

  return (
    <button
      className={`${variant === 'secondary' && isSecondaryButton ? 'secondary' : ''} ${componentClass}`}
      onClick={onClick}
      disabled={isDisabled}
      type={type ?? 'button'}
    >
      {loading ? (
        variant === 'primary' ? (
          <>
            {icon && (
              <div className="mr-2 inline-block align-middle">{icon}</div>
            )}
            <span className="invisible">{title}</span>
            <div className="absolute inset-0 flex items-center justify-center space-x-2 dark:invert">
              <span className="sr-only">Loading...</span>
              <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-white" />
            </div>
          </>
        ) : (
          <span className="flex items-center gap-2">
            <SpinIcon />
            Loading...
          </span>
        )
      ) : (
        <>
          {icon && <div className="mr-2 inline-block align-middle">{icon}</div>}
          {title}
        </>
      )}
    </button>
  )
}
