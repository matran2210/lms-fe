import React from 'react'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPTextFiled from './SAPPTextFiled'
import GuidelineField from 'src/common/GuidelineField'

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
  skeleton?: boolean
  required?: boolean
  maxLength?: number
  guideline?: Array<string> | undefined
  groupText?: string
  postFix?: any
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
  onChangeType,
  passwordVisible,
  showIconPassword,
  skeleton,
  required,
  maxLength,
  guideline,
  groupText,
  postFix,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          {!skeleton ? (
            <>
              <SAPPTextFiled
                groupText={groupText}
                type={type}
                value={field.value ?? ''}
                defaultValue={field.value ? undefined : defaultValue}
                onChange={(value) => {
                  field.onChange(value)
                  onChange && onChange(value)
                }}
                className={`${className} ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                disabled={disabled}
                label={label}
                labelClass={labelClass}
                onChangeType={onChangeType}
                passwordVisible={passwordVisible}
                showIconPassword={showIconPassword}
                error={error}
                required={required}
                maxLength={maxLength}
                guideline={guideline}
                field={field}
                postFix={postFix}
              />{' '}
              <div>
                <>
                  <GuidelineField guideline={guideline} />
                  <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                </>
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    />
  )
}

export default HookFormTextField
