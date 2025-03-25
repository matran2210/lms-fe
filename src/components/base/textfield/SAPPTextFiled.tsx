import React, { useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'

interface IProps {
  inputRef?: React.LegacyRef<HTMLInputElement>
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'number' | 'password' | 'email' | 'text'
  placeholder?: string
  className?: string
  inputClassName?: string
  value?: any
  defaultValue?: string
  disabled?: boolean
  label?: string
  labelClass?: string
  tooltipIcon?: string | undefined
  required?: boolean
  maxLength?: number
  field?: ControllerRenderProps<any, string>
  textSize?: 'base' | 'sm'
  isError?: boolean
  onPaste?: (e: any) => void
}

const TEXT_SIZES = {
  base: 'text-base placeholder:text-base',
  sm: 'text-medium-sm placeholder:text-medium-sm',
}

const SAPPTextFiled = ({
  inputRef,
  type,
  value,
  defaultValue,
  onChange,
  className,
  inputClassName,
  placeholder,
  disabled,
  label,
  labelClass = 'text-base block font-medium mb-2',
  required,
  maxLength,
  field,
  textSize = 'base',
  isError,
  onPaste,
}: IProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      {label && (
        <label className={labelClass}>
          <span className={`${required ? 'required' : ''}`}>{label}</span>
        </label>
      )}
      <div className={`${className ?? ''} relative w-full`}>
        <div className="">
          <input
            {...field}
            ref={inputRef}
            type={
              type == 'password' ? (showPassword ? 'text' : 'password') : type
            }
            value={value ?? ''}
            defaultValue={value ? defaultValue : undefined}
            onChange={onChange}
            className={`${inputClassName} ${TEXT_SIZES[textSize]} ${
              isError ? '!border-error' : ''
            } form-control h-[50px] w-full rounded-[4px] border border-solid border-default px-4 py-3 font-medium text-bw-1 shadow-0 placeholder:font-medium placeholder:text-gray-1 hover:border-primary focus:border-primary focus:shadow-0 focus:outline-none ${
              disabled ? 'bg-gray-4' : 'bg-transparent'
            }`}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            onPaste={onPaste}
          />
        </div>
        {type == 'password' && (
          <div
            className={`${
              showPassword ? 'bg-show-password' : 'bg-hide-password'
            } absolute right-4 top-2/4 h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 -translate-y-2/4 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          ></div>
        )}
      </div>
    </>
  )
}

export default SAPPTextFiled
