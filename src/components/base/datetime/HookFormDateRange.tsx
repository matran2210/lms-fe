'use client'

import { Calendar, DatePicker } from 'antd'
import { Controller, Control } from 'react-hook-form'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
import ErrorMessage from 'src/common/ErrorMessage'
import { IconCalendar } from '@assets/icons'

const { RangePicker } = DatePicker

interface IProps {
  control: Control<any>
  name: string
  defaultValue?: any
  placeholder?: boolean
  label?: string
  className?: string
  guideline?: string[]
  onChange?: (data: Date | null) => void
  required?: boolean
  disabled?: boolean
  format?: string
  showTime?: any
  showNow?: boolean
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year'
  needConfirm?: boolean
  labelClass?: string
  disabledDate?: (current: Dayjs) => boolean
}

const HookFormDateRange = ({
  control,
  name,
  placeholder = true,
  label,
  className,
  required,
  disabled = false,
  format = 'YYYY-MM-DD',
  showTime,
  showNow,
  picker,
  labelClass = 'text-base block font-medium mb-2',
  needConfirm = false,
  defaultValue,
  disabledDate,
}: IProps) => {
  return (
    <div>
      {label && (
        <label className={labelClass}>
          <span className={`${required ? 'required' : ''}`}>{label}</span>
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          const value =
            field.value?.length === 2
              ? [dayjs(field.value[0]), dayjs(field.value[1])]
              : null

          return (
            <>
              <RangePicker
                {...field}
                value={value as [Dayjs | null, Dayjs | null] | null}
                format={format}
                ref={field.ref}
                status={fieldState.error ? 'error' : undefined}
                name={field.name}
                disabled={disabled}
                showTime={showTime}
                showNow={showNow}
                picker={picker}
                className={`w-full rounded border p-2  ${className} min-h-[50px]`}
                suffixIcon={<IconCalendar />}
                allowClear
                placeholder={placeholder ? ['From Date', 'To Date'] : ['', '']}
                needConfirm={needConfirm}
                onChange={(dates) => {
                  const formattedDates =
                    dates?.length === 2
                      ? [dates[0]?.toISOString(), dates[1]?.toISOString()]
                      : []
                  field.onChange(formattedDates) // ✅ Correct way to update form state
                }}
                disabledDate={disabledDate}
                minDate={dayjs()}
              />
              {fieldState.error && (
                <div>
                  <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                </div>
              )}
            </>
          )
        }}
      />
    </div>
  )
}

export default HookFormDateRange
