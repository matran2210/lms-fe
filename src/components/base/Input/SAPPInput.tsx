import { StyleProvider } from '@ant-design/cssinjs'
import { Input } from 'antd'
import { ButtonSize } from 'antd/es/button'
import clsx from 'clsx'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'

interface SAPPInputProps {
  control: Control<any>
  name: string
  defaultValue?: any
  className?: string
  placeholder?: string
  size?: ButtonSize
}

const SAPPInput = ({
  control,
  name,
  defaultValue,
  className,
  placeholder,
  size,
}: SAPPInputProps) => {
  return (
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
            />
            <ErrorMessage>{error?.message}</ErrorMessage>
          </StyleProvider>
        )
      }}
    />
  )
}

export default SAPPInput
