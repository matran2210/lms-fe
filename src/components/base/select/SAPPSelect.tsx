import { ArrowDownIcon } from '@components/icons'
import { Select } from 'antd'
import { ButtonSize } from 'antd/es/button'
import { DefaultOptionType } from 'antd/es/select'
import clsx from 'clsx'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from '@components/common/ErrorMessage'
import SAPPLabel from '../Label/SAPPLabel'
import { IBaseFormFieldProps } from 'src/type/common'

interface SAPPSelectProps extends IBaseFormFieldProps {
  placeholder?: string
  options: DefaultOptionType[]
  size?: ButtonSize
  suffixIcon?: React.ReactNode
  isSearchable?: boolean
  onSearch?: (value: string) => Promise<void> | any
  isLoading?: boolean
  onMenuScrollToBottom?: () => void
  onChange?: (select: any) => void
  onDropdownVisibleChange?: ((open: boolean) => void) | undefined
  allowClear?: boolean
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
  disabled,
  isSearchable,
  onSearch,
  isLoading = false,
  onMenuScrollToBottom,
  onChange: onSelectChange,
  onDropdownVisibleChange,
  allowClear,
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
                onChange={(selectedOption) => {
                  field.onChange(selectedOption)
                  onSelectChange && onSelectChange?.(selectedOption)
                }}
                disabled={disabled}
                showSearch={isSearchable}
                onSearch={onSearch}
                loading={isLoading}
                onDropdownVisibleChange={onDropdownVisibleChange}
                onPopupScroll={(e) => {
                  const { target } = e
                  if (
                    Math.ceil((target as HTMLElement).scrollTop) +
                      Math.ceil((target as HTMLElement).offsetHeight) ===
                    Math.ceil((target as HTMLElement).scrollHeight)
                  ) {
                    if (onMenuScrollToBottom) {
                      onMenuScrollToBottom
                    }
                  }
                }}
                allowClear={allowClear}
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
