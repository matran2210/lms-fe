import { Skeleton } from 'antd'
import clsx from 'clsx'
import React, { KeyboardEvent } from 'react'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'

interface IProps {
  name: string
  control: Control<any>
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  placeholder?: string
  className?: string
  extraClassName?: string
  // rows?: number | undefined
  // label?: string
  // guideline?: string[]
  disabled?: boolean
  labelClass?: string
  // required?: boolean
  skeleton?: boolean
  handleKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  actions?: React.ReactNode
}

const HookFormTextArea = ({
  name,
  control,
  defaultValue,
  onChange,
  placeholder,
  className = 'w-fill--available h-[7.5rem]',
  extraClassName = 'top-4',
  // rows,
  // label,
  // guideline,
  disabled,
  // labelClass = 'fs-6 fw-bold mb-3',
  // required,
  skeleton,
  handleKeyDown,
  actions,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          {!skeleton ? (
            <div className="relative h-full">
              <textarea
                {...field}
                value={field.value ?? ''}
                defaultValue={field.value ? undefined : defaultValue}
                onChange={(value) => {
                  field.onChange(value)
                  onChange && onChange(value)
                }}
                className={`${className} form-control rounded-[4px] border-[#dcdddd] focus:border-primary focus:shadow-0 focus:outline-none ${
                  error?.message ? 'is-invalid' : ''
                }`}
                placeholder={placeholder}
                // rows={rows ?? 3}
                disabled={disabled}
                onKeyDown={handleKeyDown}
              />
              <div className={clsx('absolute right-4', extraClassName)}>
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

export default HookFormTextArea
