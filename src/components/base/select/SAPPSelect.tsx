import { ArrowDownIcon } from '@components/icons'
import { Select } from 'antd'
import { ButtonSize } from 'antd/es/button'
import { DefaultOptionType } from 'antd/es/select'
import clsx from 'clsx'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPLabel from '../Label/SAPPLabel'

interface SAPPSelectProps {
  control: Control<any>
  name: string
  defaultValue?: any
  className?: string
  placeholder?: string
  options: DefaultOptionType[]
  size?: ButtonSize
  suffixIcon?: React.ReactNode
  label?: string
  required?: boolean
  labelClass?: string
  onChange?: any
}

const SAPPSelect = ({
  control,
  name,
  defaultValue,
  className,
  placeholder,
  options,
  size,
  suffixIcon = <ArrowDownIcon />,
  label,
  required,
  labelClass,
  onChange,
}: SAPPSelectProps) => {
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
            <>
              <Select
                {...field}
                className={clsx('h-10 w-full font-medium', className)}
                placeholder={placeholder}
                value={field?.value}
                options={options}
                size={size}
                suffixIcon={suffixIcon}
                onChange={(value: string) => {
                  field.onChange(value)
                  onChange?.()
                }}
              />
              <ErrorMessage>{error?.message}</ErrorMessage>
            </>
          )
        }}
      />
    </>
  )
}

export default SAPPSelect
