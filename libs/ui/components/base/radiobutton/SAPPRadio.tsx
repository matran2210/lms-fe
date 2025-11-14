import clsx from 'clsx'
import React from 'react'

interface IProps {
  name?: string
  value?: string | boolean
  checked: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
  state?: 'default' | 'error' | 'success' | 'primary'
  size?: 'small' | 'medium' | 'lager'
  className?: string
}

const SAPPRadio = ({
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  state,
}: IProps) => {
  return (
    <label className={clsx('relative inline-block h-5 w-5', className)}>
      <input
        type="radio"
        name={name}
        value={value?.toString()}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <div
        className={clsx('h-full w-full rounded-full border transition-all', {
          'border-primary': checked && (state === 'primary' || !state),
          'border-success-600': state === 'success',
          'border-error': state === 'error',
          'border-secondary': !checked && (state === 'primary' || !state),
          'cursor-not-allowed opacity-50': disabled,
          'cursor-pointer': !disabled,
        })}
      >
        <div
          className={clsx(
            'mx-auto mt-[5px] h-2 w-2 rounded-full transition-opacity',
            {
              'opacity-100': checked,
              'opacity-0': !checked,
              'bg-primary': checked && (state === 'primary' || !state),
              'bg-success-600': checked && state === 'success',
              'bg-error': checked && state === 'error',
            },
          )}
        />
      </div>
    </label>
  )
}

export default SAPPRadio
