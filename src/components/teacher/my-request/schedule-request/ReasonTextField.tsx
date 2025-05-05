import React from 'react'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import TeacherTextField from './TeacherTextField'

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
  textSize?: 'base' | 'sm'
  inputClassName?: string
  style?: React.CSSProperties
  placeholderIcon?: React.ReactNode
}

const ReasonTextField = ({
  name,
  control,
  defaultValue,
  onChange,
  type,
  placeholder,
  className = '',
  disabled,
  label,
  skeleton,
  required,
  maxLength,
  style,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="h-full w-full">
            {!skeleton ? (
              <div>
                <TeacherTextField
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
                  required={required}
                  maxLength={maxLength}
                  field={field}
                  style={style}
                  name={name}
                  control={control}
                />

                <>
                  {error?.message && (
                    <div>
                      <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                    </div>
                  )}
                </>
              </div>
            ) : (
              <div className="flex items-center">Loading...</div>
            )}
          </div>
        )
      }}
    />
  )
}

export default ReasonTextField
