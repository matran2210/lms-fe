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
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
}

const SAPPButtonCustom = ({
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
      colorClass = 'bg-primary text-white hover:!bg-primary-600 hover:!text-white'
      break
    case 'secondary':
      colorClass =
        'bg-[#F9F9F9] text-[#78829D] hover:!bg-[#F1F1F1] hover:!text-[#78829D]'
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

export default SAPPButtonCustom
