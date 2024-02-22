// components/SearchForm.tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { buildQueryString, convertSnakeCaseToHumanReadable } from '@utils/index'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useForm } from 'react-hook-form'
import { ICourseAll } from 'src/type/courses'
import { defaultStatusCourse } from 'src/constants'

const Filter = ({ courses }: { courses: ICourseAll }) => {
  const router = useRouter()
  const { control, watch, setValue } = useForm()
  const [activeStatus, setActiveStatus] = useState<boolean>(false)
  const totalCourse = courses?.total.reduce(
    (total: number, item: any) => total + parseInt(item.count, 10),
    0,
  )

  const defaultCategory = [
    {
      label: `All (${totalCourse})`,
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
        // userSectionLearningStatus !== '' || userSectionLearningType !== ''
        // ?
        `${apiUrl}?name=${router.query.name || ''}${queryString}`,
        // : apiUrl,
      )
    }
  }, [apiUrl, queryString, watch('status'), watch('type')])
  useEffect(() => {
    setValue('type', { label: `All (${totalCourse})`, value: '' })
  }, [totalCourse])

  return (
    <div className="filter flex">
      <div
        className={`pr-6 border-r border-gray-1 ${
          !activeStatus ? 'inactive-filter' : ''
        }`}
      >
        <SappHookFormSelect
          control={control}
          name="type"
          options={defaultCategory.concat(
            courses?.total?.map((category: any) => ({
              label: `${category?.categoryName} (${category?.count})`,
              value: category?.categoryName,
            })),
          )}
          defaultValue={{ label: `All (${totalCourse})`, value: '' }}
          onChange={() => setActiveStatus(true)}
          placeholder="Category"
          className="status-course"
          isSearchable={false}
        />
      </div>
      <div className="filter pl-6 flex self-center">
        <SappHookFormSelect
          control={control}
          name="status"
          options={defaultStatusCourse}
          placeholder="Status"
          className="status-course"
          isSearchable={false}
        />
      </div>
    </div>
  )
}

export default Filter
