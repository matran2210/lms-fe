import React, { ReactNode } from 'react'
import { Control, Controller } from 'react-hook-form'
import Select from 'react-select'
import ErrorMessage from 'src/common/ErrorMessage'

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
  label?: string
  labelClass?: string
}

const SappHookFormSelect = ({
  control,
  name,
  className,
  isDisabled,
  defaultValue,
  options,
  placeholder,
  labelClass = 'text-base block font-medium mb-2',
  label,
  required,
}: IProps) => {
  return (
    <>
      {label && (
        <label className={labelClass}>
          <span className={`${required ? 'required' : ''}`}>{label}</span>
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => {
          const customStyles = {
            control: (base: any) => ({
              ...base,
              borderColor: error && 'red !important',
            }),
          }
          return (
            <>
              <Select
                {...field}
                options={options}
                styles={customStyles}
                className={`select-single ${className} `}
                classNamePrefix="select"
                instanceId="selectInstanceId"
                placeholder={placeholder}
                isDisabled={isDisabled}
                onChange={field.onChange}
              />
              <ErrorMessage>{error?.message}</ErrorMessage>
            </>
          )
        }}
      />
    </>
  )
}

export default SappHookFormSelect
