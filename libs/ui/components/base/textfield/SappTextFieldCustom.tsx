"use client"
import React, { HTMLInputTypeAttribute, ReactNode, useState } from 'react'
import { Control, ControllerRenderProps, FieldError } from 'react-hook-form'
import { Input, InputProps } from 'antd'
import clsx from 'clsx'
import { isUndefined } from 'lodash'

export interface IBaseInputProps extends Omit<InputProps, 'onChange'> {
  name: string
  control: Control<any>
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onPaste?: any
  onFocus?: React.FocusEventHandler
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  type?: HTMLInputTypeAttribute
  placeholder?: string
  className?: string
  value?: any
  defaultValue?: any
  disabled?: boolean
  label?: string
  required?: boolean
  maxLength?: number
  minNumber?: number
  maxNumber?: number
  requiredZero?: boolean
  onSubmit?: any
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  autofocus?: boolean
  showPassword?: boolean
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  isListScreen?: boolean
  isEdit?: boolean
  disabledEdit?: boolean
  handleEdit?: () => void
}

export interface IFieldInputProps extends IBaseInputProps {
  field?: ControllerRenderProps<any, string>
  id?: string
  tooltipIcon?: string
  onChangeType?: () => void
  passwordVisible?: boolean
  error?: FieldError
  otp?: {
    active: boolean
    index: number
  }
}

const SappTextFieldCustom = ({
  type,
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled,
  error,
  maxLength,
  field,
  id,
  onPaste,
  minNumber = 0,
  maxNumber,
  requiredZero = false,
  autofocus = false,
  onKeyDown,
  onInput,
  showPassword = false,
  addonAfter,
  required = false,
  isListScreen = false,
  label,
  addonBefore,
  className,
  isEdit = false,
  handleEdit = () => undefined,
  disabledEdit = false,
  ...props
}: IFieldInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const toggleChangeType = () => {
    setPasswordVisible(!passwordVisible)
  }
  // Dấu (*) khi trường bắt buộc
  const requiredMark = required ? (
    <span className="text-[#d35563]">*</span>
  ) : null

  return (
    <div className="float-label">
      <div className="position-relative">
        <Input
          {...field}
          type={type === 'password' && passwordVisible ? 'text' : type}
          id={id}
          autoFocus={autofocus}
          value={value ?? ''}
          onChange={onChange}
          status={error ? 'error' : ''}
          defaultValue={value ? defaultValue : undefined}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (requiredZero && type === 'number') {
              if (parseInt(e.currentTarget.value, 10) === 0) {
                e.currentTarget.value = ''
              } else {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /[-eE]/g,
                  '',
                )
              }
            }
            if (onInput) {
              onInput(e)
            }
          }}
          onKeyDown={(e: any) => {
            // Lọc các ký tự "e", "E" hoặc số ấm trong number
            if ((e.keyCode === 69 || e.keyCode === 189) && type === 'number') {
              e.preventDefault()
              e.currentTarget.value = e.currentTarget.value.replace(
                /[-eE]/g,
                '',
              )
            }
            if (onKeyDown) {
              onKeyDown(e)
            }
          }}
          min={`${minNumber}`}
          max={`${maxNumber}`}
          onPaste={onPaste}
          disabled={disabled}
          maxLength={maxLength}
          className={`${isListScreen ? 'h-10' : 'h-[45px]'} ${clsx(className, '')}`}
          allowClear={false}
          placeholder={placeholder?.trim() || ''}
          {...props}
        />
        <label className="textfield-label as-label">
          {label || placeholder} {requiredMark}
        </label>

        {!isUndefined(addonAfter) && (
          <span className="position-absolute addonAfter-field">
            {addonAfter}
          </span>
        )}
      </div>
      {showPassword && (
        <span
          className={`btn btn-sm btn-icon position-absolute translate-middle top-50 ${
            error ? 'd-none' : 'end-0'
          } me-n2`}
          onClick={toggleChangeType}
        >
          {passwordVisible ? (
            <i className="ki-duotone ki-eye-slash fs-1">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </i>
          ) : (
            <i className="ki-duotone ki-eye fs-1">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          )}
        </span>
      )}
    </div>
  )
}

export default SappTextFieldCustom
