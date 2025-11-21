import { ArrowIcon, PlusIcon } from '@lms/assets'
import Link from 'next/link'
import { useState } from 'react'
import { IButtonIconProps, IButtonSize, IButtonVariant } from '@lms/core'

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

const iconMap = (
  icon: string | undefined,
  iconColor: string,
): JSX.Element | null => {
  switch (icon) {
    case 'plus':
      return <PlusIcon />
    case 'arrow':
      return <ArrowIcon color={iconColor} />
    default:
      return null
  }
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
  position = 'start',
  iconColorProps = '#374151',
}: IButtonIconProps) => {
  const [iconColor, setIconColor] = useState<string>(iconColorProps)

  const isDisabled = disabled || loading

  const btnClass = `
    relative text-center font-medium rounded-lg transition-all flex items-center justify-center h-10
    ${variantStyles[variant]}
    ${full ? 'w-full' : 'inline-flex'} 
    ${sizeStyles[size]}
    ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    ${className}
  `.trim()

  const IconComponent = iconMap(icon, iconColor)

  const buttonContent = (
    <>
      {position === 'start' && IconComponent && (
        <span className="mr-2">{IconComponent}</span>
      )}
      <span>{title}</span>
      {position === 'end' && IconComponent && (
        <span className="ml-2">{IconComponent}</span>
      )}
    </>
  )

  const buttonProps = {
    type,
    className: btnClass,
    onClick,
    disabled: isDisabled,
    onMouseEnter: () => setIconColor('#fff'),
    onMouseLeave: () => setIconColor(iconColorProps),
  }

  if (link) {
    return (
      <Link href={link}>
        <button {...buttonProps}>{buttonContent}</button>
      </Link>
    )
  }

  return <button {...buttonProps}>{buttonContent}</button>
}

export default ButtonIconSapp
