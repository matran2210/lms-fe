import React, { ReactNode } from 'react'
import { Control, Controller } from 'react-hook-form'
import Select from 'react-select'

interface IProps {
  name: string
  control: Control<any>
  required?: boolean
  className?: string
  options?: Array<{ label: string; value: string }>
  isMulti?: boolean
  children?: ReactNode
  placeholder?: string
  onChange?: (select: any) => void
  value?: string | null | undefined
  isDisabled?: boolean
  defaultValue?: string | undefined | null
}

const SappHookFormSelect = ({
  control,
  name,
  className,
  isDisabled,
  defaultValue,
  options,
  placeholder,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          className={`select-single ${className}`}
          classNamePrefix="select"
          instanceId="selectInstanceId"
          placeholder={placeholder}
          isDisabled={isDisabled}
          onChange={field.onChange}
        />
      )}
    />
  )
}

export default SappHookFormSelect
