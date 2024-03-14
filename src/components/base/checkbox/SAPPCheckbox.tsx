import React from 'react'

interface IProps {
  checked: boolean
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
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
    'checked:bg-state-success checked:hover:bg-state-success checked:focus:bg-state-success',
  error:
    'checked:bg-state-error checked:hover:bg-state-error checked:focus:bg-state-error',
  default: 'checked:bg-bw-1 checked:hover:bg-bw-1 checked:focus:bg-bw-1',
  primary:
    'checked:bg-primary checked:hover:bg-primary checked:focus:bg-primary',
}

const SIZES = {
  small: 'w-4.5 h-4.5',
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
  inputStyle = 'border-bw-1',
}: IProps) => {
  return (
    <div className={`inline-block ${className}`}>
      <input
        className={`block ${
          SIZES[size]
        } border-1.5 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ${inputStyle} ${
          STATE[state]
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${
          lowerOptions && 'border-none'
        }`}
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
