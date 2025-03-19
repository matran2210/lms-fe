import React, { ReactNode } from 'react'
import SappFilterButton from 'src/components/base/button/SAPPFIlterButton'

interface IProps {
  listFilter: ReactNode
  onSubmit: () => void
  onReset: () => void
  loading: boolean
  layoutAction?: ReactNode
  className?: string
}

const LayoutFilter = ({
  listFilter,
  loading,
  onReset,
  onSubmit,
  layoutAction,
  className,
}: IProps) => {
  return (
    <div className={`main bg-white ${className}`}>
      {listFilter}
      <div className="mt-4">
        <div className="flex">
          <SappFilterButton
            titleReset="Reset"
            titleSubmit="Search"
            okClick={onSubmit}
            resetClick={onReset}
            disabled={loading}
            loading={loading}
          />
        </div>
        {layoutAction}
      </div>
    </div>
  )
}

export default LayoutFilter
