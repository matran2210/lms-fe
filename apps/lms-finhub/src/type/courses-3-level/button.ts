import { ReactNode } from 'react'

export interface IButtonTab {
  title: string
  onClick: () => void
  active?: boolean
}

export interface IButton3Level {
  title?: string
  children?: ReactNode
  onClick?: () => void
  className?: string
  loading?: boolean
  disabled?: boolean
  classTitle?: string
}

export interface IButtonTabProps {
  items: IButtonTab[]
  className?: string
}

export interface IButtonNextPrevProps {
  titlePrev: string
  prevClick: () => void
  titleNext: string
  nextClick: () => void
  disabled?: boolean
  loading?: boolean
  classNameNext?: string
  classNamePrev?: string
  showNext?: boolean
  showPrev?: boolean
  isLockedNext?: boolean
  isLockPrevious?: boolean
}
