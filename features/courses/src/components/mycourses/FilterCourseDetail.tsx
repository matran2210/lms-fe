/* eslint-disable react-hooks/exhaustive-deps */
// components/SearchForm.tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { defaultStatusDetail } from '@lms/core'
import { useForm } from 'react-hook-form'
import { SappHookFormSelect, TotalResullt } from '@lms/ui'
import { getUserPrefix } from '@lms/utils'
import { useFeature } from '@lms/contexts'

const FilterCourseDetail = ({
  totalResult,
  isTeacher = false,
}: {
  totalResult: number
  isTeacher?: boolean
}) => {
      const {router, pageLink} = useFeature();
  
  let apiUrl = `${getUserPrefix(isTeacher, pageLink)}/courses/my-course/${router.query.courseId}`
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

  // defailtvalue của status
  const statusDetail = defaultStatusDetail?.find(
    (item) => item?.value === router.query.user_section_learning_status,
  )

  return (
    <div className="flex filter">
      <TotalResullt total={totalResult} />
      <div className="flex self-center pl-6 filter">
        <SappHookFormSelect
          control={control}
          name="user_section_learning_status"
          options={defaultStatusDetail}
          className={'status-course'}
          placeholder="Status"
          isSearchable={false}
          defaultValue={statusDetail}
        />
      </div>
    </div>
  )
}

export default FilterCourseDetail
