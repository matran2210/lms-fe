/* eslint-disable react-hooks/exhaustive-deps */
// components/SearchForm.tsx

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { defaultStatusDetail } from 'src/constants'
import { useForm } from 'react-hook-form'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'

const FilterCourseDetail = ({ totalResult }: { totalResult: number }) => {
  const router = useRouter()
  let apiUrl = `/courses/my-course/${router.query.courseId}`

  const { control, watch } = useForm()

  useEffect(() => {
    const userSectionLearningStatus = watch('user_section_learning_status')
      ?.value

    if (userSectionLearningStatus !== undefined) {
      router.push(
        userSectionLearningStatus !== ''
          ? `${apiUrl}?user_section_learning_status=${userSectionLearningStatus}`
          : apiUrl,
      )
    }
  }, [watch('user_section_learning_status')])

  return (
    <div className="filter flex">
      <div className="pr-6 border-r border-gray-1">
        <div className="font-normal text-sm text-gray-1">
          {totalResult} result
        </div>
      </div>
      <div className="filter pl-6 flex self-center">
        <SappHookFormSelect
          control={control}
          name="user_section_learning_status"
          options={defaultStatusDetail}
          className={'text-medium-sm font-normal text-gray-1 h-[17px]'}
          placeholder="Status"
        />
      </div>
    </div>
  )
}

export default FilterCourseDetail
