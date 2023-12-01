import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPCheckbox from './SAPPCheckbox'

interface IHookFormCheckBoxProps {
  name: string
  control: Control<any>
  defaultValue?: string | boolean
  title?: string
  className?: string
  onChange?: React.ChangeEventHandler<any>
  checked?: string | boolean
  isWrong?: boolean
  label?: string | undefined
  required?: boolean
  disabled?: boolean
  classNameTitle?: string
  options: Array<{
    label?: string
    value: string | boolean
    description?: string
  }>
  direction?: 'horizontal' | 'vertical'
  gap?: string
  justify?: 'between' | 'start' | 'center' | 'end'
}

const HookFormCheckBoxGroup = ({
  name,
  control,
  defaultValue,
  title,
  className = '',
  onChange,
  checked,
  isWrong,
  // label,
  // required,
  disabled,
  classNameTitle,
  options,
  direction = 'vertical',
  gap,
  justify,
}: IHookFormCheckBoxProps) => {
  gap = gap ? gap : direction === 'horizontal' ? 'gap-6' : 'gap-4'

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <div
              className={
                (direction === 'horizontal'
                  ? '_horizontal flex flex-wrap'
                  : '_vertical flex flex-col') +
                ` ${gap} ` +
                ` ${
                  justify === 'between'
                    ? 'justify-between'
                    : justify == 'center'
                    ? 'justify-center'
                    : justify === 'start'
                    ? 'justify-start'
                    : 'justify-end'
                }`
              }
            >
              {options.map((option, index) => (
                <label
                  className={`flex justify-center items-center w-fit ${
                    disabled
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  key={option.label}
                >
                  <SAPPCheckbox
                    name={field.name}
                    className={`me-2 ${className}`}
                    checked={option.value.toString() === field.value}
                    onChange={(event: React.ChangeEvent<any>) => {
                      field.onChange(event.target.value)
                      onChange && onChange(event.target.value)
                    }}
                    disabled={disabled}
                    isWrong={isWrong}
                    value={option.value.toString()}
                  />
                  <span
                    className={`${
                      classNameTitle ?? ''
                    } form-check-label fw-semibold`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <ErrorMessage>{error?.message}</ErrorMessage>
          </>
        )
      }}
    />
  )
}

export default HookFormCheckBoxGroup
