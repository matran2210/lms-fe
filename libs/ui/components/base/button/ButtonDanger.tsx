import { memo } from 'react'
import Link from 'next/link'
import { IButtonProps } from '@lms/core'
import {
  ButtonSize,
  getPaddingHorizontalClass,
  getPaddingVerticalClass,
  getTextSizeClass,
} from '@lms/utils'

const LoadingSpinner = () => (
  <div className="w-100 h-100 absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center space-x-2 bg-none dark:invert">
    <span className="sr-only">Loading...</span>
    <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-white" />
  </div>
)

const ButtonDanger = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  loading = false,
  type,
}: IButtonProps) => {
  const textSizeClass = getTextSizeClass(size as ButtonSize)
  const paddingVerticalClass = getPaddingVerticalClass(size as ButtonSize)
  const paddingHorizontalClass = getPaddingHorizontalClass(size as ButtonSize)
  const fullWidthClass = full ? 'block w-full' : 'inline-block'

  const disabledClass =
    disabled || loading
      ? 'cursor-not-allowed opacity-60 bg-[#D35563]'
      : 'cursor-pointer'

  const componentClass = [
    className,
    'relative text-center text-white',
    fullWidthClass,
    paddingVerticalClass,
    paddingHorizontalClass,
    disabledClass,
    textSizeClass,
    'font-medium bg-danger hover:bg-danger-2',
  ].join(' ')

  if (link) {
    return (
      <Link href={link} className={componentClass} aria-disabled={disabled}>
        <span>{title}</span>
      </Link>
    )
  }

  return (
    <button
      className={componentClass}
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className={loading ? 'invisible' : ''}>{title}</span>
      {loading && <LoadingSpinner />}
    </button>
  )
}

export default memo(ButtonDanger)
