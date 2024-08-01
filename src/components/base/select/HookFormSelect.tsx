import React, { ReactNode } from 'react'
import Select, { type DropdownIndicatorProps, components } from 'react-select'
import Icon from '@components/icons'
import { ISelect } from 'src/type'

interface IProps {
  defaultValue?: any
  className?: string
  required?: boolean
  options?: any
  isMulti?: boolean
  children?: ReactNode
  placeholder?: string
  onChange?: (select: any) => void
  value?: string | null | undefined | ISelect
  isDisabled?: boolean
  onMenuScrollToBottom?: any
  classParent?: string
  isClearable?: boolean
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
  isClearable = false,
}: IProps) => {
  const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon type="arrow-bottom" />
      </components.DropdownIndicator>
    )
  }

  const onMenuOpen = () => {
    setTimeout(() => {
      const selectedEl = document.querySelector('[aria-selected="true"]')
      if (selectedEl) {
        selectedEl.scrollIntoView({
          behavior: 'instant',
          block: 'center',
          inline: 'center',
        })
      }
    }, 15)
  }

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
        isClearable={isClearable}
        components={{ DropdownIndicator }}
        onMenuOpen={onMenuOpen}
      />
    </div>
  )
}

export default HookFormSelect
