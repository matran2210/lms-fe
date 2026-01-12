import React from 'react'
import { Control, Controller } from 'react-hook-form'
import SappTextFieldV2 from './SappTextFieldV2'
import { ErrorMessage, GuidelineFieldV2 } from '@lms/ui'

interface IProps {
  name: string
  control: Control<any>
  defaultValue?: any
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'number' | 'password' | 'email' | 'text' | 'date'
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
  style?: React.CSSProperties
  placeholderIcon?: React.ReactNode
}

const HookFormTextFieldV2 = ({
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
  guideline,
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
                <SappTextFieldV2
                  type={type}
                  value={field.value ?? ''}
                  defaultValue={field.value ? undefined : defaultValue}
                  onChange={(value) => {
                    field.onChange(value)
                    onChange && onChange(value)
                  }}
                  className={`${className} ${
                    error
                      ? 'border-[#B90E0A] focus:border-[#B90E0A]'
                      : 'border-[#DCDDDD] focus:border-[#141414] '
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
                <GuidelineFieldV2 guideline={guideline} />
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

export default HookFormTextFieldV2
