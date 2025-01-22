import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPRadio from './SAPPRadio'
import YourAnswer from '../tags/YourAnswer'
import { uniqueId } from 'lodash'
// import './HookFormRadioGroup.scss'

interface IHookFormRadioGroupProps {
  name: string
  control: Control<any>
  defaultValue?: unknown
  options: Array<{
    label?: string
    value: string | boolean
    description?: string
    disabled?: boolean
  }>
  direction?: 'horizontal' | 'vertical'
  separator?: boolean
  justify?: 'between' | 'start' | 'center' | 'end'
  gap?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  labelClass?: string
  labelClassChecked?: string
  disabled?: boolean
  corrects?: { [key: string]: boolean }
}

const HookFormRadioGroup = ({
  name,
  control,
  defaultValue,
  options,
  direction,
  separator,
  gap,
  onChange,
  justify = 'between',
  labelClass = '',
  labelClassChecked = '',
  disabled,
  corrects,
}: IHookFormRadioGroupProps) => {
  const count_items = options?.length - 1
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
                let stateLabel: string = ''
                let checked: boolean = option.value.toString() === field.value
                let correctCheck: boolean =
                  corrects?.[option.value as string] || false
                if (!!corrects) {
                  if (corrects?.[option.value as string]) {
                    state = 'success'
                    stateLabel = 'text-state-success'
                  } else if (checked) {
                    state = 'error'
                    stateLabel = 'text-state-error'
                  }
                }

                return (
                  <div
                    key={uniqueId('check')}
                    className={`${!!corrects && 'pointer-events-none'}`}
                  >
                    <div className="flex flex-row">
                      <label
                        className={`flex flex-row items-start gap-3 ${
                          (
                            option.disabled !== undefined
                              ? option.disabled
                              : disabled
                          )
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-pointer'
                        }`}
                      >
                        <SAPPRadio
                          name={field.name}
                          disabled={
                            option.disabled !== undefined
                              ? option.disabled
                              : disabled
                          }
                          onChange={(e) => {
                            onChange && onChange(e)
                            field.onChange(e.target.value)
                          }}
                          key={index}
                          value={option.value.toString()}
                          checked={checked}
                          className="mt-[0.1875rem] flex-none"
                          size="small"
                          state={state}
                        />
                        <span className="flex-1">
                          <div
                            className={`${
                              option.value === field.value
                                ? ` ${stateLabel} ${
                                    labelClassChecked ? labelClassChecked : ''
                                  }`
                                : ` ${stateLabel} ${
                                    labelClass ? labelClass : ''
                                  }`
                            } fw-bold flex-1 text-base`}
                          >
                            {option.label}
                            <YourAnswer
                              show={checked && !!corrects}
                            ></YourAnswer>
                          </div>
                          {option.description && (
                            <div className="text-sm text-gray-500">
                              {option.description}
                            </div>
                          )}
                        </span>
                      </label>
                    </div>
                    {false &&
                      index !== count_items &&
                      (separator === undefined || separator === true) && (
                        <div className="separator separator-dashed my-5"></div>
                      )}
                  </div>
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

export default HookFormRadioGroup
