import Select from 'react-select'
import { ReactNode } from 'react'

interface IProps {
  defaultValue?: any
  className?: string
  required?: boolean
  options?: any
  isMulti?: boolean
  children?: ReactNode
  placeholder?: string
  onChange?: (select: any) => void
  value?: string | null | undefined
  isDisabled?: boolean
  onMenuScrollToBottom?: any
  classParent?: string
}

const HookFormSelect = ({
  className,
  defaultValue,
  required = false,
  options,
  isMulti = false,
  onChange,
  placeholder,
  value,
  isDisabled,
  onMenuScrollToBottom,
  classParent = '',
}: IProps) => {
  return (
    <div className={`select-options ${classParent}`}>
      <Select
        required={required}
        isMulti={isMulti}
        options={options}
        defaultValue={defaultValue}
        className={`select-single ${className}`}
        classNamePrefix="select"
        instanceId="selectInstanceId"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        isDisabled={isDisabled}
        onMenuScrollToBottom={onMenuScrollToBottom}
      />
    </div>
  )
}

export default HookFormSelect
