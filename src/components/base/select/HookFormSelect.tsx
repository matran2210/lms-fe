import Icon from '@components/icons'
import React, { ReactNode } from 'react'
import Select, { type DropdownIndicatorProps, components } from 'react-select'
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
  isResultSelect?: boolean
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  maxMenuHeight?: number
  isLoading?: boolean
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
  isResultSelect = false,
  onFocus,
  onBlur,
  isLoading = false,
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
        className={`${isResultSelect ? 'select-result' : 'select-single'} ${className}`}
        classNamePrefix="select"
        instanceId="selectInstanceId"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        isDisabled={isDisabled}
        onMenuScrollToBottom={onMenuScrollToBottom}
        isClearable={isClearable}
        components={{ DropdownIndicator }}
        maxMenuHeight={maxMenuHeight}
        onMenuOpen={onMenuOpen}
        onFocus={(e) => {
          onFocus && onFocus(e)
        }}
        onBlur={(e) => {
          onBlur && onBlur(e)
        }}
        isLoading={isLoading}
      />
    </div>
  )
}

export default HookFormSelect
