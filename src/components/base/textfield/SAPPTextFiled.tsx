import React from 'react'
import { ControllerRenderProps, FieldError } from 'react-hook-form'

interface IProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'number' | 'password' | 'email' | 'text'
  placeholder?: string
  className?: string
  value?: any
  defaultValue?: string
  disabled?: boolean
  label?: string
  labelClass?: string
  tooltipIcon?: string | undefined
  onChangeType?: () => void
  passwordVisible?: boolean
  showIconPassword?: boolean
  error?: FieldError
  required?: boolean
  maxLength?: number
  groupText?: string
  field?: ControllerRenderProps<any, string>
  postFix?: any
}

const SAPPTextFiled = ({
  type,
  value,
  defaultValue,
  onChange,
  className,
  placeholder,
  disabled,
  label,
  labelClass = 'd-flex align-items-center fs-6 fw-bold mb-3',
  onChangeType,
  passwordVisible,
  showIconPassword,
  error,
  required,
  maxLength,
  groupText,
  field,
  postFix,
}: IProps) => {
  return (
    <>
      {label && (
        <label className={labelClass}>
          <span className={`${required ? 'required' : ''}`}>{label}</span>
        </label>
      )}
      <div className={`${className ?? ''} position-relative w-100`}>
        <div className={`${groupText || postFix ? 'input-group' : ''}`}>
          {groupText && (
            <div className="input-group-text sapp-input-group-text justify-content-center">
              {groupText}
            </div>
          )}
          <input
            {...field}
            type={type}
            value={value ?? ''}
            defaultValue={value ? defaultValue : undefined}
            onChange={onChange}
            className={`${
              className ?? ''
            } form-control bg-transparent sapp-form-control-custom ${
              groupText && 'rounded-end'
            }`}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
          />
          {postFix && (
            <span className="input-group-text" id="basic-addon2">
              {postFix}
            </span>
          )}
        </div>
        {showIconPassword && (
          <span
            className={`btn btn-sm btn-icon position-absolute translate-middle top-50 ${
              error ? 'end-15px' : 'end-0'
            } me-n2`}
            onClick={onChangeType}
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
    </>
  )
}

export default SAPPTextFiled
