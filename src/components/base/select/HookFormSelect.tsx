import Select from 'react-select'
import { ReactNode } from 'react'

interface IProps {
  defaultValue?: any
  className?: string
  required?: boolean
  options?: any
  isMulti?: boolean
  children?: ReactNode
}

const HookFormSelect = ({
  className,
  defaultValue,
  required = false,
  options,
  isMulti = false,
}: IProps) => {
  return (
    <div className="select-options">
      <Select
        required={required}
        isMulti={isMulti}
        options={options}
        defaultValue={defaultValue}
        className={`select-single ${className}`}
        classNamePrefix="select"
      />
    </div>
  )
}

export default HookFormSelect
