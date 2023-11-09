import React from 'react'
import { ControllerRenderProps } from 'react-hook-form'

interface IProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  type?: 'number' | 'password' | 'email' | 'text'
  placeholder?: string
  className?: string
  value?: any
  defaultValue?: string
  disabled?: boolean
  label?: string
  labelClass?: string
  tooltipIcon?: string | undefined
  required?: boolean
  maxLength?: number
  field?: ControllerRenderProps<any, string>
}

const SAPPTextFiled = ({
  type,
  value,
  defaultValue,
  onChange,
  className,
  placeholder,
  disabled,
  label,
  labelClass = 'text-base block font-medium mb-2',
  required,
  maxLength,
  field,
}: IProps) => {
  return (
    <>
      {label && (
        <label className={labelClass}>
          {label} {`${required ? '*' : ''}`}
        </label>
      )}
      <div className={`${className ?? ''} position-relative w-full`}>
        <div className="">
          <input
            {...field}
            type={type}
            value={value ?? ''}
            defaultValue={value ? defaultValue : undefined}
            onChange={onChange}
            className={`${
              className ?? ''
            } form-control bg-transparent border py-3 px-4 shadow-0 focus:shadow-0 focus:outline-none text-base leading-4.5 font-medium text-bw-1 placeholder:text-base placeholder:leading-4.5  placeholder:font-medium placeholder:text-gray-1`}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
          />
        </div>
      </div>
    </>
  )
}

export default SAPPTextFiled
