import clsx from 'clsx'
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
  defaultValue?: string | Object | undefined | null
  label?: string
  labelClass?: string
  isSearchable?: boolean
  onMenuScrollToBottom?: () => void
  onFocus?: () => void
  isClearable?: boolean
  onMenuClose?: () => void
  onBlur?: () => void
  isSelectCustom?: boolean
  onSearch?: (value: string) => void
}

const SappHookFormSelect = ({
  control,
  name,
  className,
  isDisabled,
  defaultValue,
  options,
  placeholder,
  onChange,
  labelClass = 'text-base block font-medium mb-2',
  label,
  required,
  isSearchable = true,
  onMenuScrollToBottom,
  onFocus,
  isClearable,
  onMenuClose,
  onBlur,
  isSelectCustom = false,
  onSearch,
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
                className={clsx(
                  'select-single',
                  isSelectCustom && 'select-single-custom',
                  className,
                )}
                classNamePrefix="select"
                instanceId="selectInstanceId"
                placeholder={placeholder}
                isDisabled={isDisabled}
                isClearable={isClearable}
                onChange={(selectedOption) => {
                  // Gọi hàm onChange truyền từ props
                  onChange && onChange(selectedOption)
                  // Gọi hàm onChange của field
                  field.onChange(selectedOption)
                }}
                onMenuClose={onMenuClose}
                isSearchable={isSearchable}
                defaultValue={defaultValue}
                onMenuScrollToBottom={onMenuScrollToBottom}
                onFocus={onFocus}
                onBlur={onBlur}
                onInputChange={onSearch}
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
