import React, { ReactNode } from 'react'
import SappFilterButton from 'src/components/base/button/SAPPFIlterButton'

interface IProps {
  listFilter: ReactNode
  onSubmit: () => void
  onReset: () => void
  loading: boolean
}

const LayoutFilter = ({ listFilter, loading, onReset, onSubmit }: IProps) => {
  return (
    <div className="main bg-white px-7.5 py-7.5">
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
      </div>
    </div>
  )
}

export default LayoutFilter
