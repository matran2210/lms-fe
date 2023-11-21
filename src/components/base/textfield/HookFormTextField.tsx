import React from 'react'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPTextFiled from './SAPPTextFiled'

interface IProps {
  name: string
  control: Control<any>
  defaultValue?: any
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'number' | 'password' | 'email' | 'text'
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  labelClass?: string
  onChangeType?: () => void
  passwordVisible?: boolean
  showIconPassword?: boolean
  guideline?: Array<string> | undefined
  skeleton?: boolean
  required?: boolean
  maxLength?: number
}

const HookFormTextField = ({
  name,
  control,
  defaultValue,
  onChange,
  type,
  placeholder,
  className = '',
  disabled,
  label,
  labelClass,
  skeleton,
  required,
  maxLength,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {!skeleton ? (
            <div>
              <SAPPTextFiled
                type={type}
                value={field.value ?? ''}
                defaultValue={field.value ? undefined : defaultValue}
                onChange={(value) => {
                  field.onChange(value)
                  onChange && onChange(value)
                }}
                className={`${className} ${
                  error
                    ? 'border-error focus:border-error'
                    : 'border-default focus:border-focus '
                }`}
                placeholder={placeholder}
                disabled={disabled}
                label={label}
                labelClass={labelClass}
                required={required}
                maxLength={maxLength}
                field={field}
              />{' '}
              <div>
                <>
                  <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                </>
              </div>
            </div>
          ) : (
            <div className="flex items-center">Loading...</div>
          )}
        </div>
      )}
    />
  )
}

export default HookFormTextField
