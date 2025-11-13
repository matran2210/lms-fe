import { Control, Controller } from 'react-hook-form'
import ErrorMessage from '@components/common/ErrorMessage'
import SAPPCheckbox from './SAPPCheckbox'

interface IHookFormCheckBoxProps {
  name: string
  control: Control<any>
  defaultValue?: string | boolean
  title?: string
  className?: string
  onChange?: React.ChangeEventHandler<any>
  checked?: string | boolean
  label?: string | undefined
  required?: boolean
  disabled?: boolean
  classNameTitle?: string
  state?: 'default' | 'error' | 'success' | 'primary' // Thêm prop state
  size?: 'small' | 'medium' | 'large' // Thêm prop size
  inputStyle?: string
}

const HookFormCheckBox = ({
  name,
  control,
  defaultValue,
  title,
  className = '',
  onChange,
  checked,
  // label,
  // required,
  disabled,
  classNameTitle,
  size = 'small',
  state,
  inputStyle,
}: IHookFormCheckBoxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <>
          <label
            className={`flex w-fit items-center justify-center ${
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
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
              size={size}
              state={state}
              inputStyle={inputStyle}
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
