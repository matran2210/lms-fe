import React from 'react'

interface IProps {
  name?: string
  value?: string | boolean
  ktCheck?: boolean
  checkTarget?: string
  checked: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  className?: string
  disabled?: boolean
  state?: 'default' | 'error' | 'success'
  size?: 'small' | 'medium' | 'lager'
}

const STATE = {
  success:
    'bg-radio-success-checked checked:text-transparent checked:hover:bg-radio-success-checked checked:focus:bg-radio-success-checked',
  error:
    'checked:bg-radio-error-checked checked:text-transparent checked:hover:bg-radio-error-checked checked:focus:bg-radio-error-checked',
  default:
    'checked:bg-radio-default-checked checked:text-transparent checked:hover:bg-radio-default-checked checked:focus:bg-radio-default-checked',
}

const SIZES = {
  small: 'w-4.5 h-4.5',
  medium: 'w-[24px] h-[24px]',
  lager: 'w-[30px] h-[30px]',
}

const SAPPRadio = ({
  name,
  value,
  ktCheck,
  checkTarget,
  checked,
  onChange,
  className = '',
  disabled = false,
  state = 'default',
  size = 'medium',
}: IProps) => {
  return (
    <div className={`inline-block ${SIZES[size]} ${className}`}>
      <input
        name={name}
        className={`${
          STATE[state]
        } block w-full h-full bg-center bg-no-repeat bg-radio-normal rounded-full border-0 border-transparent  outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        }`}
        type="radio"
        data-kt-check={ktCheck}
        data-kt-check-target={checkTarget}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        value={value?.toString()}
      />
    </div>
  )
}

export default SAPPRadio
