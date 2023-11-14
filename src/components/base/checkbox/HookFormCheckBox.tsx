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
}

const HookFormCheckBox = ({
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
}: IHookFormCheckBoxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          <label
            className={`flex justify-center items-center w-fit ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <SAPPCheckbox
              className={`me-2 ${className}`}
              checked={checked ?? field.value}
              onChange={(event: React.ChangeEvent<any>) => {
                field.onChange(event.target.checked)
                onChange && onChange(event.target.checked)
              }}
              disabled={disabled}
              isWrong={isWrong}
            />
            <span
              className={`${classNameTitle ?? ''} form-check-label fw-semibold`}
            >
              {title}
            </span>
          </label>
          <ErrorMessage>{error?.message}</ErrorMessage>
        </>
      )}
    />
  )
}

export default HookFormCheckBox
