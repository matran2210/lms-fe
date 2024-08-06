import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPCheckbox from './SAPPCheckbox'
import YourAnswer from '../tags/YourAnswer'
import { uniqueId } from 'lodash'

interface IHookFormCheckBoxProps {
  name: string
  control: Control<any>
  defaultValue?: string | boolean
  title?: string
  className?: string
  onChange?: (e: any) => void
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
  toggle?: boolean
  positionCheckBox?: 'start' | 'center' | 'bottom'
  lowerOptions?: boolean
  seprateLine?: boolean
  widthOptions?: string
  maxWidthContent?: boolean
}

const HookFormCheckBoxGroup = ({
  name,
  control,
  defaultValue,
  // title,
  className = '',
  onChange,
  // checked,
  // isWrong,
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
  // state,
  corrects,
  toggle = false,
  positionCheckBox = 'center',
  lowerOptions = false,
  seprateLine = false,
  widthOptions = '',
  maxWidthContent = false,
}: IHookFormCheckBoxProps) => {
  gap = !seprateLine
    ? gap
      ? gap
      : direction === 'horizontal'
        ? 'gap-6'
        : 'gap-4'
    : ''

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
                } ${seprateLine && 'sapp-separateLine'} ${
                  maxWidthContent && 'w-max'
                }`
              }
            >
              {options.map((option, index) => {
                let state: 'error' | 'default' | 'success' | undefined
                let stateLabel: string = ''

                let checked: boolean = multiple
                  ? field.value?.includes(option.value.toString())
                  : option.value.toString() === field.value
                // let correctCheck: boolean =
                //   corrects?.[option.value as string] || false
                if (!!corrects) {
                  if (corrects?.[option.value as string]) {
                    state = 'success'
                    stateLabel = 'text-state-success'
                  } else if (checked) {
                    state = 'error'
                    stateLabel = 'text-state-error'
                  }
                }
                const checkHasChecked = multiple
                  ? field.value?.length > 0
                  : false

                return (
                  <label
                    className={`flex justify-center items-${positionCheckBox} w-fit ${
                      disabled
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer'
                    } ${corrects && 'pointer-events-none'} ${
                      seprateLine && 'py-2'
                    } ${widthOptions}`}
                    key={uniqueId(option.label)}
                  >
                    <SAPPCheckbox
                      className={`me-2 ${className} ${
                        positionCheckBox === 'start' && 'mt-[2px]'
                      }`}
                      checked={checked}
                      lowerOptions={lowerOptions && !checked && checkHasChecked}
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
                          if (toggle) {
                            if (event.target.value === field.value) {
                              field.onChange(undefined)
                              onChange && onChange(undefined as any)
                            } else {
                              field.onChange(event.target.value)
                              onChange && onChange(event.target.value)
                            }
                          } else {
                            field.onChange(event.target.value)
                            onChange && onChange(event.target.value)
                          }
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
                      } ${stateLabel}  form-check-label fw-semibold ${
                        lowerOptions &&
                        !checked &&
                        checkHasChecked &&
                        'text-gray-1'
                      }`}
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
