/* eslint-disable react-hooks/exhaustive-deps */
// components/SearchForm.tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { defaultStatusDetail } from 'src/constants'
import { useForm } from 'react-hook-form'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import TotalResullt from 'src/common/TotalResullt'

const FilterCourseDetail = ({ totalResult }: { totalResult: number }) => {
  const router = useRouter()
  let apiUrl = `/courses/my-course/${router.query.courseId}`
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

  const { control, watch } = useForm()
  const userSectionLearningStatus = watch('user_section_learning_status')?.value

  useEffect(() => {
    if (!isFirstRender) {
      router.push(
        userSectionLearningStatus !== undefined
          ? `${apiUrl}?user_section_learning_status=${userSectionLearningStatus}`
          : apiUrl,
      )
    }
  }, [watch('user_section_learning_status')])

  useEffect(() => {
    setIsFirstRender(false)
  }, [setIsFirstRender])

  return (
    <div className="filter flex absolute right-0">
      <TotalResullt total={totalResult} />
      <div className="filter pl-6 flex self-center">
        <SappHookFormSelect
          control={control}
          name="user_section_learning_status"
          options={defaultStatusDetail}
          className={'status-course'}
          placeholder="Status"
          isSearchable={false}
        />
      </div>
    </div>
  )
}

export default FilterCourseDetail
