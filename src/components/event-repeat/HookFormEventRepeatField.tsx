import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import { IEventRepeatFieldValues } from 'src/type/my-calendar'
import EventRepeatField from './EventRepeatField'
import { ISelect } from 'src/type/course'

interface IProps {
  name: string
  control: Control<any>
  className?: string
  label?: string
  labelClass?: string
  defaultDate?: Date
  defaultValue?: IEventRepeatFieldValues
  required?: boolean
  skeleton?: boolean
  repeatOption?: ISelect
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
                onChange={(val) => field.onChange(val)}
                className={className}
                repeatOption={repeatOption}
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

export default HookFormEventRepeat
