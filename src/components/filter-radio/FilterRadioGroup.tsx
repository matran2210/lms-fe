import { CloseCircleIcon } from '@assets/icons'
import { uniqueId } from 'lodash'
import { Control, Controller } from 'react-hook-form'
import SAPPFilterRadio from './SappFilterRadio'

interface IFilterRadioGroupProps {
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
  optionClassName?: string
  disabled?: boolean
  corrects?: { [key: string]: boolean }
}

const FilterRadioGroup = ({
  name,
  control,
  defaultValue,
  options,
  direction,
  gap,
  onChange,
  justify = 'between',
  labelClass = '',
  labelClassChecked = '',
  disabled,
  corrects,
}: IFilterRadioGroupProps) => {
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
                let stateLabel: string = ''
                let checked: boolean = option.value.toString() === field.value

                return (
                  <div
                    key={uniqueId('check')}
                    className={`${!!corrects && 'pointer-events-none'}`}
                  >
                    <div className="flex">
                      <label
                        className={`flex items-center gap-2 ${
                          (
                            option.disabled !== undefined
                              ? option.disabled
                              : disabled
                          )
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-pointer'
                        }`}
                      >
                        <SAPPFilterRadio
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
                          className="flex-none"
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
                            } fw-bold flex-1 text-base leading-4 ${checked && '!text-primary'}`}
                          >
                            {option.label}
                          </div>
                          {option.description && (
                            <div className={'text-sm text-[#6b7280]'}>
                              {option.description}
                            </div>
                          )}
                        </span>
                        {checked && (
                          <button
                            onClick={(e) => {
                              field.onChange()
                            }}
                            className="text-ink-300 hover:text-[#FF524E]"
                          >
                            <CloseCircleIcon color="currentColor" />
                          </button>
                        )}
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )
      }}
    />
  )
}

export default FilterRadioGroup
