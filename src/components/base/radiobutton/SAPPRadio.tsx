import React from 'react'

interface IProps {
  name: string
  key?: string
  value?: string | boolean
  ktCheck?: boolean
  checkTarget?: string
  checked: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  className?: string
  disabled?: boolean
}

const SAPPRadio = ({
  name,
  key,
  value,
  ktCheck,
  checkTarget,
  checked,
  onChange,
  className = '',
  disabled = false,
}: IProps) => {
  return (
    <div className={`inline-block w-6 h-6 ${className}`}>
      <input
        name={name}
        className={`block w-full h-full bg-radio-normal rounded-full border-0 border-transparent checked:bg-radio-checked outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:bg-radio-checked ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        }`}
        type="radio"
        data-kt-check={ktCheck}
        data-kt-check-target={checkTarget}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        key={key}
        value={value?.toString()}
      />
    </div>
  )
}

export default SAPPRadio
