import React from 'react'
import { DatePicker, Skeleton } from 'antd'
const { RangePicker } = DatePicker
import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import dayjs, { Dayjs } from 'dayjs'

interface IProps {
  name: string
  control: Control<any>
  defaultValue?: [Dayjs, Dayjs]
  className?: string
  disabled?: boolean
  skeleton?: boolean
  style?: React.CSSProperties
}

const HookFormDateRangePicker = ({
  name,
  control,
  defaultValue,
  className = '',
  disabled,
  skeleton,
  style,
}: IProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="h-full w-full">
            {skeleton ? (
              <div className="flex items-center">
                <Skeleton.Button active shape={`default`} block size="large" />
              </div>
            ) : (
              <div>
                <RangePicker
                  {...field}
                  style={style}
                  className={className}
                  disabled={disabled}
                  allowClear
                  size="large"
                />
                {error?.message && (
                  <div>
                    <ErrorMessage>{error?.message ?? ''}</ErrorMessage>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }}
    />
  )
}

export default HookFormDateRangePicker
