// components/SearchForm.tsx

import React, { useState } from 'react'
import HookFormSelect from '@components/base/select/HookFormSelect'

const Filter: React.FC = () => {
  // Select
  const selectOptions = [
    { value: 'status', label: 'Status' },
    { value: 'day-left', label: 'Day left' },
    { value: 'year', label: 'Year' },
  ]

  return (
    <div className="flex justify-between py-6">
      <h2 className="text-medium-sm font-semibold text-bw-1">My Course</h2>
      <div className="result filter flex">
        <div className="result pr-6 border-r border-gray-1">
          <p className="text-medium-sm font-normal text-gray-1">5 results</p>
        </div>
        <div className="filter pl-6">
          <HookFormSelect
            options={selectOptions}
            defaultValue={{ value: 'vanilla', label: 'Vanilla' }}
            className={'text-medium-sm font-normal text-gray-1 h-[17px]'}
          ></HookFormSelect>
        </div>
      </div>
    </div>
  )
}

export default Filter
