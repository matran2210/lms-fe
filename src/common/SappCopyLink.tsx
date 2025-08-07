import React, { ReactNode } from 'react'
import toast from 'react-hot-toast'

export const ClickToCopyButton = ({
  children,
  link = '',
  className,
}: {
  children: ReactNode
  link: string
  className?: string
}) => {
  const copylink = () => {
    navigator.clipboard.writeText(link)
    toast.success('Link copied successfully!')
  }

  return (
    <div onClick={copylink} className={className}>
      {children}
    </div>
  )
}
