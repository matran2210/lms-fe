// components/SearchForm.tsx

import TotalResullt from '@components/common/TotalResullt'
import { defaultStatusCourse, ICourseAll } from '@lms/core'
import { SappHookFormSelect } from '@lms/ui'
import { buildQueryString } from '@lms/utils'
import { getUserPrefix } from '@utils/helpers'
import { isEmpty } from 'lodash'
import { useParams, useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
interface IProps {
  courses: ICourseAll
  setPage?: Dispatch<SetStateAction<number>>
  isTeacher?: boolean
}

const Filter = ({ courses, setPage, isTeacher = false }: IProps) => {
  const router = useRouter()
  const params = useParams()
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
  let apiUrl = `${getUserPrefix(isTeacher)}/courses`

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
      router.push(`${apiUrl}?name=${params.name || ''}${queryString}`)
      setPage && setPage(9)
    }
  }, [apiUrl, queryString, watch])

  useEffect(() => {
    setIsFirstRender(false)
  }, [setIsFirstRender])

  /**
   * @description set lại value của status khi router query rỗng
   */
  useEffect(() => {
    if (isEmpty(params?.status)) {
      setValue('status', '')
    }
  }, [params?.status])

  /**
   * @description set lại value của type khi router query rỗng
   */
  useEffect(() => {
    if (isEmpty(params?.type)) {
      setValue('type', '')
    }
  }, [params?.type])

  return (
    <div className="flex items-center filter">
      <TotalResullt total={totalResults} className="mr-6" />
      <div
        className={`border-r border-gray-1 pr-6 ${
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
      <div className="flex self-center pl-6 filter">
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
