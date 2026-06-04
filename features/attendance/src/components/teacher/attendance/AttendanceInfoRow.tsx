import clsx from 'clsx'
import React from 'react'

interface AttendanceInfoRowProps {
  icon?: React.ReactNode
  label: React.ReactNode
  value: React.ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

const AttendanceInfoRow: React.FC<AttendanceInfoRowProps> = ({
  icon,
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}) => (
  <div className={clsx('flex justify-between gap-2', className)}>
    <div className="flex items-center gap-2">
      <div>
        {icon}
      </div>    
      <div className={clsx('text-base text-gray-400', labelClassName)}>{label}</div>
    </div>
    <div className={clsx('text-base font-medium text-gray-800', valueClassName)}>{value}</div>
  </div>
)

export default AttendanceInfoRow
