import { Control, Controller } from 'react-hook-form'
import ErrorMessage from 'src/common/ErrorMessage'
import SAPPRadio from './SAPPRadio'
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
}: IHookFormRadioGroupProps) => {
  const count_items = options?.length - 1
  gap = gap ? gap : direction === 'horizontal' ? 'gap-6' : 'gap-4'

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
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
              <div key={option.label || index}>
                <div className="flex flex-row">
                  <label
                    className={`flex flex-row items-center ${
                      (
                        option.disabled !== undefined
                          ? option.disabled
                          : disabled
                      )
                        ? 'opacity-60 cursor-not-allowed'
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
                      key={option.label}
                      value={option.value.toString()}
                      checked={option.value.toString() === field.value}
                      className="me-2"
                    />
                    <span>
                      <div
                        className={`${
                          option.value === field.value
                            ? `text-black ${
                                labelClassChecked
                                  ? labelClassChecked
                                  : 'fw-bold fs-6'
                              }`
                            : `text-black ${
                                labelClass ? labelClass : 'fw-bold fs-6'
                              }`
                        }`}
                      >
                        {option.label}
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
            ))}
          </div>
          <ErrorMessage>{error?.message}</ErrorMessage>
        </>
      )}
    />
  )
}

export default HookFormRadioGroup
