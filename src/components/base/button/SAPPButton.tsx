// import { StyleProvider } from '@ant-design/cssinjs'
import { Button } from 'antd'
import { ButtonSize, ButtonType } from 'antd/es/button'
import clsx from 'clsx'
import { ReactNode } from 'react'

type ButtonColor = 'primary' | 'secondary'

interface SAPPButtonProps {
  type?: ButtonType
  title?: string
  children?: ReactNode
  className?: string
  size?: ButtonSize
  color?: ButtonColor
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  onClick?: any
  loading?: boolean
  disabled?: boolean
}

const SAPPButton = ({
  type = 'primary',
  title,
  children,
  className,
  size,
  color = 'primary',
  icon,
  iconPosition = 'start',
  onClick,
  loading,
  disabled,
}: SAPPButtonProps) => {
  let colorClass = ''
  switch (color) {
    case 'primary':
      colorClass = 'bg-primary text-white hover:!bg-primary-2 hover:!text-white'
      break
    case 'secondary':
      colorClass = 'bg-gray-4 text-gray-12 hover:!bg-gray-3 hover:!text-gray-12'
      break
  }

  return (
    <Button
      type={type}
      className={clsx(
        'h-10 px-6 py-3 font-medium shadow-none',
        colorClass,
        className,
      )}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      {title}
      {children}
    </Button>
  )
}

export default SAPPButton
