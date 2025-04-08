import React from 'react'
import { DatePicker, Skeleton } from 'antd'
const { RangePicker } = DatePicker
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'

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

const HookFormDateRangePicker = ({
  name,
  control,
  defaultValue,
  onChange,
  placeholder,
  className = '',
  disabled,
  label,
  labelClass,
  skeleton,
  required,
  inputClassName,
  style,
  placeholderIcon,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="h-full w-full">
            {skeleton ? (
              <div className="flex items-center">
                <Skeleton.Button active shape={`default`} block size="large" />
              </div>
            ) : (
              <div>
                <RangePicker
                  {...field}
                  style={style}
                  className={className}
                  disabled={disabled}
                  allowClear
                  size="large"
                />
                {error?.message && (
                  <div>
                    <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }}
    />
  )
}

export default HookFormDateRangePicker
