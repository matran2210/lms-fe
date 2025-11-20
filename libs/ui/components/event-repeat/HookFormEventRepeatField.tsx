import { Control, Controller } from 'react-hook-form'
import { ErrorMessage } from '@lms/ui'
import { ISelect } from '@lms/core'
import { IEventRepeatFieldValues } from '@lms/core'
import EventRepeatField from './EventRepeatField'
import { Skeleton } from 'antd'
import { IBaseFormFieldProps } from '@lms/core'

interface IProps extends IBaseFormFieldProps {
  defaultDate?: Date
  defaultValue?: IEventRepeatFieldValues
  repeatOption?: ISelect
  resetRepeat?: boolean
  setResetRepeat?: React.Dispatch<React.SetStateAction<boolean>>
  rangeDate?: [Date, Date]
  defaultEndOn?: Date | string
}

const HookFormEventRepeat = ({
  className = '',
  label,
  labelClass = '',
  name,
  control,
  defaultDate,
  defaultValue,
  required,
  skeleton,
  repeatOption,
  resetRepeat,
  setResetRepeat,
  disabled,
  rangeDate,
  defaultEndOn,
}: IProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className="h-full w-full">
          {!skeleton ? (
            <div>
              <EventRepeatField
                label={label}
                labelClass={labelClass}
                required={required}
                defaultDate={defaultDate || new Date()}
                onChange={(val) => {
                  const current = field.value || {}
                  field.onChange({
                    ...current,
                    ...val, // new or updated values overwrite the existing ones
                  })
                }}
                className={className}
                repeatOption={repeatOption}
                resetRepeat={resetRepeat}
                setResetRepeat={setResetRepeat}
                disabled={disabled}
                rangeDate={rangeDate}
                defaultEndOn={defaultEndOn}
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
            <Skeleton.Input active className={className} />
          )}
        </div>
      )}
    />
  )
}

export default HookFormEventRepeat
