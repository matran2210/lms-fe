import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import { ISelect } from 'src/type/course'
import { IEventRepeatFieldValues } from 'src/type/my-calendar'
import EventRepeatField from './EventRepeatField'

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
  resetRepeat?: boolean
  setResetRepeat?: React.Dispatch<React.SetStateAction<boolean>>
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
                resetRepeat={resetRepeat}
                setResetRepeat={setResetRepeat}
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
