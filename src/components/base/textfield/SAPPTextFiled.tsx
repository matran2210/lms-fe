import clsx from 'clsx'
import React, { useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import SAPPLabel from '../Label/SAPPLabel'

interface IProps {
  inputRef?: React.LegacyRef<HTMLInputElement>
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'number' | 'password' | 'email' | 'text'
  placeholder?: string
  placeholderIcon?: React.ReactNode
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
  style?: React.CSSProperties
}

const TEXT_SIZES = {
  base: 'text-base placeholder:text-base',
  sm: 'text-sm placeholder:text-sm',
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
  placeholderIcon,
  disabled,
  label,
  labelClass = 'text-base block font-medium mb-2',
  required,
  maxLength,
  field,
  textSize = 'base',
  isError,
  style,
  onPaste,
}: IProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      {label && (
        <SAPPLabel title={label} className={labelClass} required={required} />
      )}
      <div className={`${className ?? ''} relative flex w-full items-center`}>
        {placeholderIcon && (
          <span className="text-gray-500 absolute left-4">
            {placeholderIcon}
          </span>
        )}
        <input
          {...field}
          ref={inputRef}
          type={
            type == 'password' ? (showPassword ? 'text' : 'password') : type
          }
          value={value ?? ''}
          defaultValue={value ? defaultValue : undefined}
          onChange={onChange}
          className={clsx(
            inputClassName,
            TEXT_SIZES[textSize],
            'form-control h-[50px] w-full border border-solid border-[#DCDDDD] px-4 py-3 font-medium text-bw-1 shadow-0 placeholder:font-medium placeholder:text-gray-1 focus:border-primary focus:shadow-0 focus:outline-none',
            {
              '!border-error': isError,
              'bg-gray-4': disabled,
              'bg-transparent': !disabled,
              'pl-12': placeholderIcon,
            },
          )}
          placeholder={placeholder}
          disabled={disabled}
          style={style}
          maxLength={maxLength}
          onPaste={onPaste}
        />
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
