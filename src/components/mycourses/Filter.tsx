// components/SearchForm.tsx

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { buildQueryString, convertSnakeCaseToHumanReadable } from '@utils/index'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useForm } from 'react-hook-form'
import { ICourseAll } from 'src/type/courses'
import { defaultStatusDetail } from 'src/constants'

const Filter = ({ courses }: { courses: ICourseAll }) => {
  const router = useRouter()
  const { control, watch } = useForm()

  const defaultCategory = [
    {
      label: 'All',
      value: '',
    },
  ]

  let apiUrl = `/courses`

  const queryString = buildQueryString({
    status: watch('status')?.value || '',
    type: watch('type')?.value || '',
  })

  useEffect(() => {
    const userSectionLearningType = watch('type')?.value
    const userSectionLearningStatus = watch('status')?.value

    if (
      userSectionLearningType !== undefined ||
      userSectionLearningStatus !== undefined
    ) {
      router.push(
        userSectionLearningStatus !== '' || userSectionLearningType !== ''
          ? `${apiUrl}?name=${router.query.name || ''}${queryString}`
          : apiUrl,
      )
    }
  }, [apiUrl, queryString, watch('status'), watch('type')])

  return (
    <div className="filter flex">
      <div className="pr-6 border-r border-gray-1">
        <SappHookFormSelect
          control={control}
          name="type"
          options={defaultCategory.concat(
            courses?.total?.map((category: any) => ({
              label: category?.categoryName,
              value: category?.categoryName,
            })),
          )}
          value={{
            label: 'All',
            value: '',
          }}
          placeholder="Category"
          className="status-course"
          isSearchable={false}
        />
      </div>
      <div className="filter pl-6 flex self-center">
        <SappHookFormSelect
          control={control}
          name="status"
          options={defaultStatusDetail}
          placeholder="Status"
          className="status-course"
          isSearchable={true}
        />
      </div>
    </div>
  )
}

export default Filter
