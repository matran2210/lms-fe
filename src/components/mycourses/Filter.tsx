// components/SearchForm.tsx

import React, { useEffect, useState } from 'react'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { useRouter } from 'next/router'
import { convertSnakeCaseToHumanReadable } from '@utils/index'

const Filter = ({ courses, totalResult }: any) => {
  const router = useRouter()
  const [selectCategory, setSelectedCategory] = useState<any>(null)
  const [selectedStatus, setSelectedStatus] = useState<any>(null)

  const handleChange = (selected: any) => {
    setSelectedCategory(selected)
    router.push(
      `/courses?name=${router.query.name ?? ''}&type=${selected.value ?? ''}&status=${router.query.status ?? ''}`,
    )
  }

  const handleChangeStatus = (selected: any) => {
    setSelectedStatus(selected)
    router.push(
      `/courses?name=${router.query.name ?? ''}&type=${router.query.type ?? ''}&status=${selected.value}`,
    )
  }

  const defaultCategory = [
    {
      label: 'All',
      value: ''
    }
  ]

  useEffect(() => {
    // Check if router.query.status is an empty string
    if (router.query.status === undefined) {
      setSelectedStatus(null);
    }

    if (router.query.type === undefined) {
      setSelectedCategory(null);
    }
  }, [router.query.status, setSelectedStatus, router.query.type, selectCategory]);

  return (
    <div className="filter flex">
      <div className="pr-6 border-r border-gray-1">
        {totalResult ? (
          <div className="font-normal text-sm text-gray-1">
            {totalResult} result
          </div>
        ) : (
          <HookFormSelect
            options={defaultCategory.concat(courses?.total?.map((category: any) => ({
              label: category?.categoryName,
              value: category?.categoryName,
            })))}
            className={'text-medium-sm font-normal text-gray-1 h-[17px]'}
            placeholder="Category"
            onChange={handleChange}
            value={selectCategory}
          />
        )}
      </div>
      <div className="filter pl-6 flex self-center">
        <HookFormSelect
          options={defaultCategory.concat(courses?.status?.map((status: any) => ({
            label: convertSnakeCaseToHumanReadable(status?.status),
            value: status?.status,
          })))}
          className={'text-medium-sm font-normal text-gray-1 h-[17px]'}
          placeholder="Status"
          value={selectedStatus}
          onChange={handleChangeStatus}
        />
      </div>
    </div>
  )
}

export default Filter
