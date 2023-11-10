import React from 'react'

interface IProps {
  ktCheck?: boolean
  checkTarget?: string
  checked: boolean
  isWrong?: boolean
  disabled?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  className?: string
}

const SAPPCheckbox = ({
  ktCheck,
  checkTarget,
  checked,
  isWrong,
  disabled,
  onChange,
  className,
}: IProps) => {
  return (
    <div className={`inline-block ${className}`}>
      <input
        className={`block w-6 h-6 min-w-6 min-h-6 border-1.5 border-gray-1 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ${
          isWrong
            ? 'checked:bg-state-error checked:hover:bg-state-error checked:focus:bg-state-error'
            : 'checked:bg-state-success checked:hover:bg-state-success checked:focus:bg-state-success'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        type="checkbox"
        data-kt-check={ktCheck}
        data-kt-check-target={checkTarget}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}

export default SAPPCheckbox
