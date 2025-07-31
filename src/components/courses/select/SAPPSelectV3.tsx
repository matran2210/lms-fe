import { ArrowDownIcon } from '@components/icons'
import { Select } from 'antd'
import { DefaultOptionType, SelectProps } from 'antd/es/select'
import clsx from 'clsx'
import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'

interface SAPPSelectProps<T extends FieldValues> extends SelectProps {
  control: Control<T>
  name: Path<T>
  defaultValue?: PathValue<T, Path<T>>
  suffixIcon?: React.ReactNode
  className?: string
  label?: string
  required?: boolean
  isSearchable?: boolean
  isLoading?: boolean
  onMenuScrollToBottom?: (event: React.UIEvent<HTMLDivElement>) => void
  onChange?: (select: DefaultOptionType) => void
  onDropdownVisibleChange?: ((open: boolean) => void) | undefined
}

const SAPPSelectV3 = <T extends FieldValues>({
  control,
  name,
  defaultValue,
  suffixIcon = <ArrowDownIcon />,
  className,
  label,
  required,
  onChange,
  isSearchable,
  isLoading = false,
  onMenuScrollToBottom,
  onChange: onSelectChange,
  ...props
}: SAPPSelectProps<T>) => {
  return (
    <>
      <div className="float-label">
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
                  {...props}
                  className={clsx('h-12 w-full font-normal', className)}
                  value={field?.value}
                  suffixIcon={suffixIcon}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption)
                    onSelectChange && onSelectChange?.(selectedOption)
                  }}
                  showSearch={isSearchable}
                  loading={isLoading}
                  onPopupScroll={(e) => {
                    const { target } = e
                    if (
                      Math.ceil((target as HTMLElement).scrollTop) +
                        Math.ceil((target as HTMLElement).offsetHeight) ===
                      Math.ceil((target as HTMLElement).scrollHeight)
                    ) {
                      onMenuScrollToBottom?.(e)
                    }
                  }}
                />
                {label && (
                  <label className="textfield-label as-label">
                    <span className={clsx({ required }, '')}>{label}</span>
                  </label>
                )}
                <ErrorMessage>{error?.message}</ErrorMessage>
              </>
            )
          }}
        />
      </div>
    </>
  )
}

export default SAPPSelectV3
