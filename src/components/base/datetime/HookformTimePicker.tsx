import { Control, Controller } from 'react-hook-form'
import { TimePicker } from 'antd'
import dayjs from 'dayjs'
import ErrorMessage from 'src/common/ErrorMessage'
import { EDateTime } from 'src/type'

const { RangePicker } = TimePicker

interface IProps {
  control: Control<any>
  name: string
  defaultValue?: any
  format?: string
  placeholder?: [string, string]
  needConfirm?: boolean
  required?: boolean
  disabled?: boolean
  disabledTime?: any
  className?: string
  label?: string
}

const HookformTimePicker = ({
  name,
  control,
  format = EDateTime.timepicker,
  placeholder = ['Start Time', 'End Time'],
  className = 'h-11.25',
  label,
  required,
  needConfirm = false,
  disabled = false,
  disabledTime,
}: IProps) => {
  const requiredMark = required ? <span className="text-danger">*</span> : null
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <div className="float-label">
          <label className="mb-2.5 block text-sm font-medium">
            {label || placeholder} {requiredMark}
          </label>
          <RangePicker
            format={format}
            value={
              value
                ? [
                    dayjs(value[0], EDateTime.timepicker),
                    dayjs(value[1], EDateTime.timepicker),
                  ]
                : null
            }
            onChange={(times) => {
              if (times) {
                onChange([
                  times[0]?.format(EDateTime.timepicker),
                  times[1]?.format(EDateTime.timepicker),
                ])
              } else {
                onChange(null)
              }
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            status={error ? 'error' : undefined}
            className={className}
            style={{ width: '-webkit-fill-available' }}
            needConfirm={needConfirm}
            disabled={disabled}
            disabledTime={disabledTime}
          />
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
        </div>
      )}
    />
  )
}

export default HookformTimePicker
