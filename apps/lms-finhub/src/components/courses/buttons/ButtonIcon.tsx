import { IButton3Level } from '@lms/core'

export default function ButtonIcon({
  title,
  children,
  onClick,
  className = '',
  loading,
  disabled,
  classTitle = '',
}: IButton3Level) {
  return (
    <button
      className={`${className} flex items-center justify-center gap-1`}
      onClick={onClick}
      disabled={loading || disabled}
      type="button"
    >
      <span className={`${classTitle} text-base font-medium`}>{title}</span>
      {children}
    </button>
  )
}
