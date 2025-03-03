import { DatePicker } from 'antd'
import { ButtonSize } from 'antd/es/button'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'

interface SAPPRangePickerProps {
  control: Control<any>
  name: string
  defaultValue?: any
  className?: string
  required?: boolean
  allowClear?: boolean
  disabled?: boolean
  placeholder?: [string, string]
  showTime?: boolean
  formatDate?: string
  suffixIcon?: React.ReactNode
  needConfirm?: boolean
  size?: ButtonSize
}

const { RangePicker } = DatePicker
const SAPPRangePicker = ({
  control,
  name,
  defaultValue,
  className,
  allowClear,
  disabled = false,
  placeholder,
  showTime = false,
  formatDate = 'DD/MM/YYYY',
  suffixIcon,
  needConfirm = false,
  size = 'large',
}: SAPPRangePickerProps) => {
  return (
    <Controller
      key={name}
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        return (
          <>
            <RangePicker
              style={{ width: '100%' }}
              status={fieldState.error ? 'error' : undefined}
              placeholder={placeholder}
              ref={field.ref}
              name={field.name}
              format={formatDate}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={[
                field.value?.[0] ? dayjs(field.value?.[0]) : null,
                field.value?.[1] ? dayjs(field.value?.[1]) : null,
              ]}
              className={clsx(
                'px-4 py-3 focus-within:border-primary hover:border-primary focus:border-primary focus:shadow-0 focus:outline-none',
                className,
              )}
              allowClear={allowClear}
              disabled={disabled}
              suffixIcon={suffixIcon}
              showTime={showTime}
              needConfirm={needConfirm}
              size={size}
            />
            <div>
              <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
            </div>
          </>
        )
      }}
    />
  )
}
export default SAPPRangePicker
