import { Button, ButtonProps } from 'antd'
import Link from 'next/link'
import { FC } from 'react'
import SpinIcon from './SpinIcon'

export interface BaseButtonProps extends ButtonProps {
  link?: string
}

const BaseButton: FC<BaseButtonProps> = ({
  children,
  className,
  link,
  ...props
}) => {
  const baseClassName =
    '!shadow-none outline-none inline-block h-fit box-border flex items-center justify-center'

  if (link) {
    return (
      <Link href={link}>
        <Button {...props} className={`${baseClassName} ${className}`}>
          {children}
        </Button>
      </Link>
    )
  }

  return (
    <Button {...props} className={`${baseClassName} ${className}`}>
      {children}
    </Button>
  )
}

export default BaseButton
