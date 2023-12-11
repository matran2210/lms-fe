// components/SearchForm.tsx

import React, { useState } from 'react'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { useRouter } from 'next/router'

const Filter = ({ courses, totalResult }: any) => {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<any>(null)

  const handleChange = (selected: any) => {
    setSelectedOption(selected)
    router.push(
      `/courses?name=${router.query.name ?? ''}&type=${selected.label}`,
    )
  }

  return (
    <div className="filter flex">
      <div className="pr-6 border-r border-gray-1">
        {totalResult ? (
          <div className="font-normal text-sm text-gray-1">
            {totalResult} result
          </div>
        ) : (
          <HookFormSelect
            options={courses?.total?.map((category: any) => ({
              label: category?.categoryName,
              value: category?.categoryName,
            }))}
            className={'text-medium-sm font-normal text-gray-1 h-[17px]'}
            placeholder="Status"
            onChange={handleChange}
            defaultValue={selectedOption} // Set the default value based on the state
          />
        )}
      </div>
      <div className="filter pl-6 flex self-center">
        <HookFormSelect
          options={[]}
          className={'text-medium-sm font-normal text-gray-1 h-[17px]'}
          placeholder="Status"
        />
      </div>
    </div>
  )
}

export default Filter
