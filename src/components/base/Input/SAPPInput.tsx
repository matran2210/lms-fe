import { StyleProvider } from '@ant-design/cssinjs'
import { Input, InputRef } from 'antd'
import { ButtonSize } from 'antd/es/button'
import clsx from 'clsx'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPLabel from '../Label/SAPPLabel'
import GuidelineField from 'src/common/GuidelineField'
import { useEffect, useRef } from 'react'

export interface SAPPInputProps {
  control: Control<any>
  name: string
  defaultValue?: any
  className?: string
  placeholder?: string
  size?: ButtonSize
  label?: string
  required?: boolean
  labelClass?: string
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  guideline?: string[]
  autoFocus?: boolean
}

const SAPPInput = ({
  control,
  name,
  defaultValue,
  className,
  placeholder,
  size,
  label,
  required,
  labelClass,
  disabled = false,
  onChange,
  guideline,
  autoFocus = false,
}: SAPPInputProps) => {
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current?.focus) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [autoFocus])
  return (
    <>
      {label && (
        <SAPPLabel title={label} required={required} className={labelClass} />
      )}
      <Controller
        key={name}
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => {
          return (
            <StyleProvider hashPriority="high">
              <Input
                {...field}
                className={clsx('h-10 w-full font-medium', className)}
                placeholder={placeholder}
                value={field?.value}
                size={size}
                disabled={disabled}
                onChange={(value) => {
                  field.onChange(value)
                  onChange && onChange(value)
                }}
                autoFocus={true}
                ref={(instance) => {
                  field.ref(instance)
                  if (instance) {
                    ;(inputRef as React.MutableRefObject<any>).current =
                      instance
                  }
                }}
              />
              <GuidelineField guideline={guideline} />
              <ErrorMessage>{error?.message}</ErrorMessage>
            </StyleProvider>
          )
        }}
      />
    </>
  )
}

export default SAPPInput
