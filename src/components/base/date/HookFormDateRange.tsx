import type { GetProps } from 'antd'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SappIcon from 'src/common/SappIcon'
import SAPPLabel from '../Label/SAPPLabel'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

interface IProps {
  name: string
  control: Control<any>
  defaultValue?: [Date, Date] | null
  onChange?: RangePickerProps['onChange']
  placeholder?: [string, string]
  className?: string
  disabled?: boolean
  label?: string
  labelClass?: string
  guideline?: Array<string> | undefined
  skeleton?: boolean
  showTime?: RangePickerProps['showTime']
  format?: string
  required?: boolean
  inputClassName?: string | undefined
  suffixIcon?: React.ReactNode
  allowClear?: boolean
}

const HookFormDateRange = ({
  name,
  control,
  defaultValue,
  onChange,
  placeholder,
  className,
  disabled,
  label,
  labelClass = 'text-base block font-medium mb-2',
  skeleton,
  showTime = { format: 'HH:mm' },
  format = 'DD/MM/YYYY | HH:mm',
  required,
  inputClassName = 'h-12.5 w-full rounded-none',
  suffixIcon = <SappIcon icon="input_calendar" />,
}: IProps) => {
  const formattedDefaultValue = defaultValue
    ? [dayjs(defaultValue[0]), dayjs(defaultValue[1])]
    : null

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={formattedDefaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className="h-full w-full">
          {!skeleton ? (
            <div className={className}>
              {label && (
                <SAPPLabel
                  title={label}
                  required={required}
                  className={labelClass}
                />
              )}
              <DatePicker.RangePicker
                {...field}
                className={inputClassName}
                showTime={showTime}
                format={format}
                value={
                  field.value
                    ? [dayjs(field.value[0]), dayjs(field.value[1])]
                    : null
                }
                onChange={(dates, dateStrings) => {
                  field.onChange(
                    dates ? [dates[0]?.toDate(), dates[1]?.toDate()] : [],
                  )

                  onChange && onChange(dates, dateStrings)
                }}
                suffixIcon={suffixIcon}
                disabled={disabled}
                placeholder={placeholder}
              />

              <>
                {error?.message && (
                  <div>
                    <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                  </div>
                )}
              </>
            </div>
          ) : (
            <div className="flex items-center">Loading...</div>
          )}
        </div>
      )}
    />
  )
}

export default HookFormDateRange
