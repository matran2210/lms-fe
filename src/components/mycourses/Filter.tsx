// components/SearchForm.tsx

import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { buildQueryString, convertSnakeCaseToHumanReadable } from '@utils/index'
import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { useForm } from 'react-hook-form'
import { ICourseAll } from 'src/type/courses'
import { defaultStatusCourse } from 'src/constants'

interface IProps {
  courses: ICourseAll
  setPage?: Dispatch<SetStateAction<number>>
}

const Filter = ({ courses, setPage }: IProps) => {
  const router = useRouter()
  const { control, watch, setValue } = useForm()
  const [activeStatus, setActiveStatus] = useState<boolean>(false)
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)
  const totalResults = courses?.metadata?.total_records || 0

  const defaultCategory = [
    {
      label: `All`,
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
    // Check undefined vì nếu để rỗng thì ko filter theo all được
    if (
      !isFirstRender &&
      (userSectionLearningType !== undefined ||
        userSectionLearningStatus !== undefined)
    ) {
      router.push(`${apiUrl}?name=${router.query.name || ''}${queryString}`)
      setPage && setPage(9)
    }
  }, [apiUrl, queryString, watch])

  useEffect(() => {
    setIsFirstRender(false)
  }, [setIsFirstRender])

  return (
    <div className="filter flex items-center">
      <div className="pr-6 border-r border-gray-1 mr-6 text-medium-sm font-normal text-gray-1">
        {`${totalResults} ${totalResults > 1 ? 'Results' : 'Result'}`}
      </div>
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
              label: `${category?.categoryName}`,
              value: category?.categoryName,
            })),
          )}
          defaultValue={{ label: `All`, value: '' }}
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
