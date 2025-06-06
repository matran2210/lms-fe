import { ArrowIcon, PlusIcon } from '@assets/icons'
import Link from 'next/link'
import { useState } from 'react'
import { IButtonIconProps, IButtonSize, IButtonVariant } from 'src/type'

const sizeStyles: Record<IButtonSize, string> = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-5 py-2.5 text-base',
  large: 'px-6 py-3 text-lg',
  extra: 'px-6 py-3 text-lg',
}

const variantStyles: Record<IButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-[#FFC83A]',
  secondary: 'hover:border-primary bg-white hover:bg-primary hover:text-white',
  custom: '',
}
const ButtonIconSapp = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  full = false,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  icon,
  position,
  iconColorProps = '#374151',
}: IButtonIconProps) => {
  const isPrimary = variant === 'primary'
  const isSecondary = variant === 'secondary'
  const [iconColor, setIconColor] = useState<string>(iconColorProps)
  const btnClass = `
    relative text-center font-medium rounded-lg transition-all flex items-center justify-center h-10
    ${isPrimary ? variantStyles.primary : ''}
    ${isSecondary ? variantStyles.secondary : ''}
    ${full ? 'w-full' : 'inline-flex'} 
    ${size === 'small' ? sizeStyles.small : size === 'medium' ? sizeStyles.medium : sizeStyles.large}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `
  const iconMap: Record<string, JSX.Element | null> = {
    plus: <PlusIcon />,
    search: null,
    arrow: <ArrowIcon color={iconColor} />,
  }
  const IconComponent = iconMap[icon ?? 'plus']
  const Button = () => (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIconColor('#fff')}
      onMouseLeave={() => setIconColor(iconColorProps)}
    >
      {position === 'start' && IconComponent}
      <span className="mx-2">{title}</span>
      {position === 'end' && IconComponent}
    </button>
  )
  if (link) {
    return <Link href={link}>{Button()}</Link>
  }
  return Button()
}

export default ButtonIconSapp
