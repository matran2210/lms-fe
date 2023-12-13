import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPCheckbox from './SAPPCheckbox'
import YourAnswer from '../tags/YourAnswer'

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
  multiple?: boolean
  state?: 'default' | 'error' | 'success' // Thêm prop state
  size?: 'small' | 'medium' | 'lager' // Thêm prop size
  corrects?: { [key: string]: boolean }
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
  multiple = false,
  size = 'small',
  state,
  corrects,
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
              {options.map((option, index) => {
                let state: 'error' | 'default' | 'success' | undefined
                let stateLabel: string = 'text-bw-1'

                let checked: boolean = multiple
                  ? field.value?.includes(option.value.toString())
                  : option.value.toString() === field.value

                if (!!corrects && checked) {
                  if (corrects?.[option.value as string]) {
                    state = 'success'
                    stateLabel = 'text-state-success'
                  } else {
                    state = 'error'
                    stateLabel = 'text-state-error'
                  }
                }

                return (
                  <label
                    className={`flex justify-center items-center w-fit ${
                      disabled
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer'
                    } ${corrects && 'pointer-events-none'}`}
                    key={option.label}
                  >
                    <SAPPCheckbox
                      className={`me-2 ${className} `}
                      checked={
                        multiple
                          ? field.value?.includes(option.value.toString())
                          : option.value.toString() === field.value
                      }
                      onChange={(event: React.ChangeEvent<any>) => {
                        if (multiple) {
                          let arr = [] as any
                          if (field.value?.length > 0) {
                            arr = [...field.value]
                            if (arr.includes(event.target.value)) {
                              const newArr = arr.filter(
                                (e: any) => e !== event.target.value,
                              )
                              arr = [...newArr]
                            } else {
                              arr.push(event.target.value)
                            }
                          } else {
                            arr.push(event.target.value)
                          }
                          field.onChange(arr)
                          onChange && onChange(arr)
                        } else {
                          field.onChange(event.target.value)
                          onChange && onChange(event.target.value)
                        }
                      }}
                      disabled={disabled}
                      state={state}
                      value={option.value.toString()}
                      size={size}
                    />
                    <span
                      className={`${
                        classNameTitle ?? ''
                      } ${stateLabel}  form-check-label fw-semibold`}
                    >
                      {option.label}
                      <YourAnswer show={checked && !!corrects}></YourAnswer>
                    </span>
                  </label>
                )
              })}
            </div>
            <ErrorMessage>{error?.message}</ErrorMessage>
          </>
        )
      }}
    />
  )
}

export default HookFormCheckBoxGroup
