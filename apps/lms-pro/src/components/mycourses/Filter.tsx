// components/SearchForm.tsx

import SappHookFormSelect from '@components/base/select/SappHookFormSelect'
import { getUserPrefix } from '@utils/helpers'
import { buildQueryString } from '@utils/index'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import TotalResullt from 'src/common/TotalResullt'
import { defaultStatusCourse } from '@lms/core'
import { ICourseAll } from 'src/type/courses'

interface IProps {
  courses: ICourseAll
  setPage?: Dispatch<SetStateAction<number>>
  tourGuideActive?: boolean
  isTeacher: boolean
}

const Filter = ({ courses, setPage, tourGuideActive, isTeacher }: IProps) => {
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
      router.push(`${apiUrl}?name=${router.query.name || ''}${queryString}`)
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
    if (isEmpty(router?.query?.status)) {
      setValue('status', '')
    }
  }, [router?.query?.status])

  /**
   * @description set lại value của type khi router query rỗng
   */
  useEffect(() => {
    if (isEmpty(router?.query?.type)) {
      setValue('type', '')
    }
  }, [router?.query?.type])

  return (
    <div className="flex items-center font-normal filter">
      <TotalResullt total={totalResults} className="border-r-0" />
      <div
        className={clsx({
          'mr-1 border-x border-[#A1A1A1] py-2 pl-5 pr-6': true,
          'inactive-filter': !activeStatus,
          'z-50 rounded-lg bg-white': tourGuideActive,
        })}
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
      <div
        className={clsx(
          `ml-1 flex self-center rounded-lg py-2 pl-5 pr-6 filter`,
          {
            'z-50 bg-white': tourGuideActive,
          },
        )}
      >
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
