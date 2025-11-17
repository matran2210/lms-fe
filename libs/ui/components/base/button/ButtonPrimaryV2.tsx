import clsx from 'clsx'
import BaseButton from './BaseButton'
import { IButtonBaseProps } from '@lms/core'

const ButtonPrimaryV2 = ({
  title,
  onClick,
  className = '',
  link,
  size = 'small',
  disabled = false,
  startIcon,
  endIcon,
  full = false,
  children,
  ...props
}: IButtonBaseProps) => {
  let textSizeClass =
    size === 'small'
      ? 'text-v2-sm'
      : size === 'medium'
        ? 'text-v2-sm md:text-v2-base'
        : 'text-v2-sm md:text-v2-lg'
  let padding =
    size === 'small'
      ? 'py-2 px-4'
      : size === 'medium'
        ? 'py-2 px-4 md:py-3 md:px-6'
        : 'py-2 px-4 md:py-4 md:px-8'
  // let fullWidthClass = full ? 'block w-full' : 'inline-block'
  // let disabledClass = disabled
  //   ? 'cursor-not-allowed !bg-gray-100 !text-gray-400 hover:!bg-gray-100 hover:!text-gray-400 hover:!border-gray-100'
  //   : 'cursor-pointer'
  let componentClass = clsx(
    `text-center font-medium border-none ${padding} ${textSizeClass}`,
    className,
    {
      'cursor-not-allowed !bg-gray-v2-100 !text-gray-v2-400 hover:!bg-gray-v2-100 hover:!text-gray-v2-400 hover:!border-gray-v2-100':
        disabled,
      'cursor-pointer text-white bg-secondary-v2-600 hover:!text-white hover:!bg-secondary-v2-DEFAULT':
        !disabled,
      'block w-full': full,
      'inline-block': !full,
    },
  )

  return (
    <BaseButton
      className={componentClass}
      onClick={onClick}
      disabled={disabled}
      link={link}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        {startIcon && <div className="w-full">{startIcon}</div>}
        <div className="w-full">{title || children}</div>
        {endIcon && <div className="w-full">{endIcon}</div>}
      </div>
    </BaseButton>
  )
}

export default ButtonPrimaryV2
