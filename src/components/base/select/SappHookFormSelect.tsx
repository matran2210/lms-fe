import React, { ReactNode } from 'react'
import { Control, Controller } from 'react-hook-form'
import Select from 'react-select'
import ErrorMessage from 'src/common/ErrorMessage'

interface IProps {
  name: string
  control: Control<any>
  required?: boolean
  className?: string
  options?: Array<{ label: string; value: string; isDisabled?: boolean }>
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
  onSearch?: () => void
  isLoading?: boolean
}

const SappHookFormSelect = ({
  control,
  name,
  className,
  isDisabled,
  defaultValue,
  options,
  placeholder,
  onChange: onSelectChange,
  labelClass = 'text-base block font-medium mb-2',
  label,
  required,
  isSearchable = true,
  onMenuScrollToBottom,
  onFocus,
  isClearable,
  onMenuClose,
  onBlur,
  onSearch,
  isLoading = false,
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
          return (
            <>
              <Select
                {...field}
                options={options}
                // styles={customStyles}
                className={`select-single ${className} `}
                classNamePrefix="select"
                instanceId="selectInstanceId"
                placeholder={placeholder}
                isDisabled={isDisabled}
                isClearable={isClearable}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption)
                  onSelectChange && onSelectChange?.(selectedOption)
                }}
                onMenuOpen={() => onSearch?.()}
                onMenuClose={onMenuClose}
                isSearchable={isSearchable}
                defaultValue={defaultValue}
                onMenuScrollToBottom={onMenuScrollToBottom}
                onFocus={onFocus}
                onBlur={onBlur}
                isLoading={isLoading}
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
