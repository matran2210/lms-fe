import React from 'react'
import { SpinIcon } from '../icons'
import { IBaseButtonProps } from 'src/type/courses-3-level'
import Link from 'next/link'

export default function BaseButtonIconFlip({
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
    small: 'text-sm leading-5.5 py-2 px-7',
    medium:
      'text-sm leading-5.5 lg:text-base lg:leading-6 py-1.5 lg:py-3 px-4 lg:px-[31px] min-w-[92px] lg:min-w-[120px]',
    large: 'text-lg leading-6.5 py-2.8 px-9',
    extra: 'text-xl leading-6.5 py-2.8 px-9',
  }

  const isDisabled = disabled || loading

  const baseClass = `
    relative text-center rounded-[6px] font-medium
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
      : 'text-bw-1 bg-gray-3'

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
            <span className="invisible mr-2">{title}</span>
            {icon && (
              <div className="inline-block align-middle lg:hidden">{icon}</div>
            )}
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
          {title && <div className="inline-block align-middle">{title}</div>}
          {icon && (
            <div className="inline-block scale-x-[-1] align-middle lg:hidden">
              {icon}
            </div>
          )}
        </>
      )}
    </button>
  )
}
