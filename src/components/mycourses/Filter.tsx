// components/SearchForm.tsx

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { buildQueryString, convertSnakeCaseToHumanReadable } from '@utils/index'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useForm } from 'react-hook-form'
import { ICourseAll } from 'src/type/courses'

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
          placeholder="Categoty"
        />
      </div>
      <div className="filter pl-6 flex self-center">
        <SappHookFormSelect
          control={control}
          name="status"
          options={defaultCategory.concat(
            courses?.status?.map((status: any) => ({
              label: convertSnakeCaseToHumanReadable(status?.status),
              value: status?.status,
            })),
          )}
          placeholder="Status"
        />
      </div>
    </div>
  )
}

export default Filter
