import React from 'react'
import { Select as AntSelect, ConfigProvider, SelectProps } from 'antd'
import clsx from 'clsx'

interface CustomSelectProps extends SelectProps {
  label?: string
}

const Select: React.FC<CustomSelectProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            hoverBorderColor: '#EF5941',
            activeBorderColor: '#EF5941',
            optionSelectedBg: '#EF594112',
            optionSelectedColor: '#EF5941',
            optionActiveBg: '#EF594112',
            controlItemBgHover: '#EF594112',
          },
        },
      }}
    >
      <AntSelect {...props} className={clsx('sapp-select h-12', className)} />
    </ConfigProvider>
  )
}

export default Select
