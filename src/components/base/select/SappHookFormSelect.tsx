import clsx from 'clsx'
import React, { ReactNode, useCallback, memo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import Select, { SingleValue, MultiValue } from 'react-select'
import ErrorMessage from 'src/common/ErrorMessage'
import { OptionType } from 'src/type'

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
  isLoading?: boolean
  isSelectCustom?: boolean
  onSearch?: (value?: string) => void
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
  isLoading = false,
  isSelectCustom = false,
  onSearch,
}: IProps) => {
  const handleChange = useCallback(
    (selectedOption: OptionType | null) => {
      onSelectChange?.(selectedOption)
    },
    [onSelectChange]
  )

  const handleMenuOpen = useCallback(() => {
    onSearch?.()
  }, [onSearch])

  return (
    <>
      {label && (
        <label className={labelClass}>
          <span className={required ? 'required' : ''}>{label}</span>
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              {...field}
              options={options}
              className={clsx(
                'select-single',
                isSelectCustom && 'select-single-custom',
                className
              )}
              classNamePrefix="select"
              instanceId="selectInstanceId"
              placeholder={placeholder}
              isDisabled={isDisabled}
              isClearable={isClearable}
              onChange={(selectedOption) => {
                field.onChange(selectedOption)
                handleChange(selectedOption)
              }}
              onMenuOpen={handleMenuOpen}
              onMenuClose={onMenuClose}
              isSearchable={isSearchable}
              defaultValue={defaultValue}
              onMenuScrollToBottom={onMenuScrollToBottom}
              onFocus={onFocus}
              onBlur={onBlur}
              isLoading={isLoading}
              onInputChange={onSearch}
            />
            <ErrorMessage>{error?.message}</ErrorMessage>
          </>
        )}
      />
    </>
  )
}

export default memo(SappHookFormSelect)
