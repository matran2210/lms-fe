import clsx from 'clsx'
import React from 'react'

interface IProps {
  checked: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  className?: string
  name?: string
  value?: string | boolean
  state?: 'default' | 'error' | 'success' | 'primary' // Thêm prop state
  size?: 'small' | 'medium' | 'lager' // Thêm prop size
  lowerOptions?: boolean
  inputStyle?: string
}

const STATE = {
  success:
    'checked:bg-success-600 checked:hover:bg-success-600 checked:focus:bg-success-600',
  error: 'checked:bg-error checked:hover:bg-error checked:focus:bg-error',
  default:
    'checked:bg-[#050505] checked:hover:bg-[#050505] checked:focus:bg-[#050505]',
  primary:
    'checked:bg-primary checked:hover:bg-primary checked:focus:bg-primary',
}

const SIZES = {
  small: 'w-4.5 h-[18px]',
  medium: 'w-[24px] h-[24px]',
  lager: 'w-[30px] h-[30px]',
}

const SAPPCheckbox = ({
  checked,
  disabled,
  onChange,
  className,
  value,
  state = 'default', // Gán giá trị mặc định cho prop state
  size = 'medium', // Gán giá trị mặc định cho prop size
  lowerOptions = false,
  inputStyle = 'border-[#050505]',
}: IProps) => {
  return (
    <div className={`inline-block ${className}`}>
      <input
        className={clsx(
          'block h-6 w-6 bg-transparent',
          'rounded-[5px] outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0',
          SIZES[size],
          inputStyle,
          STATE[state],
          {
            'cursor-not-allowed opacity-60': disabled,
            'cursor-pointer': !disabled,
            'border-none': lowerOptions,
          },
        )}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        value={value?.toString()}
      />
    </div>
  )
}

export default SAPPCheckbox
