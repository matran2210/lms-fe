import { ReactNode } from 'react'

export type SkeletonProps = {
  children?: ReactNode
  loading?: boolean
  length?: number
  className?: string
  classChild?: string
  widths?: string[]
}
