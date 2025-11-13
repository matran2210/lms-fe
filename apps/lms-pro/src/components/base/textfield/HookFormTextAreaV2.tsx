import { Skeleton } from 'antd'
import React, { KeyboardEvent } from 'react'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import { Input } from 'antd'
const { TextArea } = Input
interface IProps {
  name: string
  control: Control<any>
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  placeholder?: string
  className?: string
  rows?: number | undefined
  // label?: string
  // guideline?: string[]
  disabled?: boolean
  labelClass?: string
  // required?: boolean
  skeleton?: boolean
  handleKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  actions?: React.ReactNode
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined' | undefined
  autoSize?: boolean | object | undefined
}

const HookFormTextAreaV2 = ({
  name,
  control,
  defaultValue,
  onChange,
  placeholder,
  className,
  rows,
  // label,
  // guideline,
  disabled,
  // labelClass = 'fs-6 fw-bold mb-3',
  // required,
  skeleton,
  handleKeyDown,
  actions,
  variant,
  autoSize,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          {!skeleton ? (
            <div className="relative h-full flex-1">
              <TextArea
                {...field}
                value={field.value ?? ''}
                variant={variant}
                defaultValue={field.value ? undefined : defaultValue}
                onChange={(value) => {
                  field.onChange(value)
                  onChange && onChange(value)
                }}
                className={`${className} form-control rounded-[4px] border-[#dcdddd] ${
                  error?.message ? 'is-invalid' : ''
                }`}
                placeholder={placeholder}
                rows={rows ?? 3}
                disabled={disabled}
                onKeyDown={handleKeyDown}
                autoSize={autoSize}
              />
              <div className="absolute right-4 top-1/2 translate-y-[-50%]">
                {actions}
              </div>
            </div>
          ) : (
            <Skeleton.Input
              active
              size="large"
              className="w-100 h-150px"
            ></Skeleton.Input>
          )}
          <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
        </>
      )}
    />
  )
}

export default HookFormTextAreaV2
