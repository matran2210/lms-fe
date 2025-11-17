import React, { ReactNode } from 'react'
import { IButtonBaseProps } from '@lms/core'
import BaseButton from './BaseButton'

interface IButtonIconProps extends IButtonBaseProps {
  buttonType: 'rounded' | 'square' //bo tròn || bo tròn vuông với radius
}

// phải tự set w/h của icon và chuyển icon về fill=currentColor
const ButtonIconV2 = ({
  icon,
  onClick,
  className = '',
  link,
  size = 'small',
  disabled = false,
  full = false,
  children,
  buttonType = 'rounded',
  ...props
}: IButtonIconProps) => {
  let padding = 'p-[7px]'
  let borderRadius = buttonType === 'rounded' ? 'rounded-full' : 'rounded-md'
  let disabledClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  let componentClass = `text-center text-icon border border-gray-v2-300 hover:!text-white hover:!bg-primary-v2-DEFAULT hover:!border-primary-v2-DEFAULT font-medium ${padding} ${borderRadius} ${disabledClass} ${className}`

  return (
    <BaseButton
      className={`${componentClass}`}
      onClick={onClick}
      disabled={disabled}
      link={link}
      {...props}
    >
      {icon}
    </BaseButton>
  )
}

export default ButtonIconV2
