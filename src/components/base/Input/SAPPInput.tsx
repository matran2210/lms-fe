import { StyleProvider } from '@ant-design/cssinjs'
import { Input } from 'antd'
import { ButtonSize } from 'antd/es/button'
import clsx from 'clsx'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPLabel from '../Label/SAPPLabel'
import GuidelineField from 'src/common/GuidelineField'

interface SAPPInputProps {
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
}: SAPPInputProps) => {
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
