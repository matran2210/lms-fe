import { CircleInfoIcon } from '@assets/icons'
import clsx from 'clsx'
import React from 'react'
interface IProps {
  isShowWarning: boolean
  className?: string
}
const WarningSection = ({ isShowWarning, className = '' }: IProps) => {
  return (
    <div>
      {isShowWarning && (
        <div className={clsx('mb-4 mt-6 flex gap-2 text-warning', className)}>
          <CircleInfoIcon />
          <div className="text-base font-normal">
            You should select an answer before clicking “Submit”, because once
            you submit, the correct answer will be displayed.
          </div>
        </div>
      )}
    </div>
  )
}

export default WarningSection
