import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'

import { TimeIcon } from '@components/icons'
import { IconCalendar } from '@assets/icons'

interface IProps {
  control: Control<any>
  defaultValue?: any
  name: string
  placeholder?: string
  label?: string
  className?: string
  guideline?: string[]
  onChange?: (data: Date | null) => void
  required?: boolean
  disabled?: boolean
  format?: string | undefined
  showTime?: any
  showNow?: boolean
  disabledDate?: (current: dayjs.Dayjs) => any
  disabledTime?: (current: dayjs.Dayjs | null) => any
  isListScreen?: boolean
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined
  needConfirm?: boolean
  labelClass?: string
}

const HookFormDateTime = ({
  control,
  defaultValue,
  name,
  placeholder,
  label,
  className,
  guideline,
  onChange,
  required,
  disabled = false,
  format,
  showTime,
  showNow,
  disabledDate,
  disabledTime,
  isListScreen,
  picker,
  labelClass = 'text-base block font-medium mb-2',
  needConfirm = false,
}: IProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        return (
          <>
            {label && (
              <label className={labelClass}>
                <span className={`${required ? 'required' : ''}`}>{label}</span>
              </label>
            )}
            <DatePicker
              placeholder={placeholder}
              status={fieldState.error ? 'error' : undefined}
              ref={field.ref}
              name={field.name}
              format={format}
              onBlur={field.onBlur}
              value={field.value ? dayjs(field.value) : null} // Convert the date to dayjs object for the DateTimePicker
              className={`create-date-range-picker w-full placeholder:font-bold ${className ?? ''} ${
                isListScreen ? 'h-[45px]' : 'h-[50px]'
              }`}
              disabled={disabled}
              showTime={showTime}
              showNow={showNow}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
              picker={picker}
              needConfirm={needConfirm}
              suffixIcon={<IconCalendar />}
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

export default HookFormDateTime
