import React, { ReactNode } from 'react'
import toast from 'react-hot-toast'

export const ClickToCopyButton = ({
  children,
  link = '',
}: {
  children: ReactNode
  link: string
}) => {
  const copylink = () => {
    navigator.clipboard.writeText(link)
    toast.success('Link copied successfully!')
  }

  return <div onClick={copylink}>{children}</div>
}
