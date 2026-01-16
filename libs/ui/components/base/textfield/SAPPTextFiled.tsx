"use client"
import clsx from 'clsx'
import React, { useState } from 'react'
import { ControllerRenderProps } from 'react-hook-form'
import SAPPLabel from '../Label/SAPPLabel'
import { EyeIcon, CloseEyeIcon } from '@lms/assets'

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
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
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
  onFocus,
  onBlur,
}: IProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      {label && (
        <SAPPLabel title={label} className={labelClass} required={required} />
      )}
      <div className={clsx('relative flex w-full items-center', className)}>
        {placeholderIcon && (
          <span className="absolute left-4 text-[#6b7280]">
            {placeholderIcon}
          </span>
        )}

        <input
          {...field}
          ref={inputRef}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          value={value ?? ''}
          defaultValue={value ? defaultValue : undefined}
          onChange={onChange}
          className={clsx(
            inputClassName,
            TEXT_SIZES[textSize],
            'form-control h-[50px] w-full border border-solid border-[#DCDDDD] px-4 py-3 font-medium text-[#050505] shadow-0 placeholder:font-medium placeholder:text-[#A1A1A1] focus:border-primary focus:shadow-0 focus:outline-none',
            {
              '!border-[#B90E0A]': isError,
              'bg-[#F9F9F9]': disabled,
              'bg-transparent': !disabled,
              'pl-12': placeholderIcon,
              'pr-12': type === 'password', // thêm padding phải để tránh icon đè chữ
            },
          )}
          placeholder={placeholder}
          disabled={disabled}
          style={style}
          maxLength={maxLength}
          onPaste={onPaste}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {/* 👁 Icon hiện/ẩn mật khẩu */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1A1] hover:text-[#050505] focus:outline-none"
          >
            {showPassword ? <CloseEyeIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </>
  )
}

export default SAPPTextFiled
