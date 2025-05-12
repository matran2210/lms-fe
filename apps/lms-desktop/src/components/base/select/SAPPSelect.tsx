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
  disabled?: boolean
  isSearchable?: boolean
  onSearch?: (value: string) => Promise<void> | any
  isLoading?: boolean
  onMenuScrollToBottom?: () => void
  onChange?: (select: any) => void
  onDropdownVisibleChange?: ((open: boolean) => void) | undefined
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
