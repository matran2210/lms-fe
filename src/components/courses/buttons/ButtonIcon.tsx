import React, { ReactNode } from 'react'
import { IButton3Level } from 'src/type/courses-3-level/button'

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
