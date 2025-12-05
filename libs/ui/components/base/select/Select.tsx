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
            hoverBorderColor: '#FFB800',
            activeBorderColor: '#FFB800',
          },
        },
      }}
    >
      <AntSelect {...props} className={clsx('sapp-select h-12', className)} />
    </ConfigProvider>
  )
}

export default Select
