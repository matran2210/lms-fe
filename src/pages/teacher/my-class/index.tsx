import Layout from '@components/layout/Teacher'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import PopupStep from '@components/user-guide/PopupStep'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION, UserGuide } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { active, increment, reset } from 'src/redux/slice/Course/UserGuide'
import { MY_COURSES } from 'src/constants/lang'
import { Typography } from 'antd'
import LayoutFilter from '@components/layout/Filter/index'
import Search from '@components/classes/Search'
import { useForm } from 'react-hook-form'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import ItemClassesByStatus from '@components/classes/ItemClassesByStatus'
import { EntranceTestAPI } from 'src/pages/api/entrance-test'
const { Title } = Typography

const fieldNames = [
  'class_name',
  'class_code',
  'course_category_id',
  'course_level_id',
  'facility_id',
  'status',
  'class_type',
  'subject_id',
  'fromDate',
  'toDate',
]

const initialValues: Record<string, any> = {
  class_name: '',
  class_code: '',
  course_category_id: '',
  course_level_id: '',
  facility_id: '',
  status: '',
  class_type: '',
  subject_id: '',
  fromDate: '',
  toDate: '',
}
const DEFAULT_PAGESIZE = 10
const MyClass = () => {
  const router = useRouter()
  const [listUniverPrograms, setListUniverPrograms] = useState<any>()
  const { control, getValues, reset, setValue, watch } = useForm({
    mode: 'onSubmit',
  })
  /**
   * @description Gọi API My Class
   * @param {pageParam, params} pageParam: number, params: Object
   */
  const fetchMyClass = async ({
    pageParam,
    params,
  }: {
    pageParam: number
    params: Object
  }) => {
    const { classes, metadata } = await TeacherAPI.getListClass(
      pageParam || 1,
      DEFAULT_PAGESIZE,
      params,
    )
    return { data: classes || [], metadata: metadata }
  }

  /**
   * @description config params khi filter
   */
  const params = {
    name: router.query.name || undefined,
    status: router.query.status || undefined,
    type: router.query.type || undefined,
  }
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['myClass'],
    queryFn: ({ pageParam }) => fetchMyClass({ pageParam, params }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data.length ? allPages.length + 1 : undefined
    },
    retry: false,
  })
  const getListUniverPrograms = async () => {
    const res = await EntranceTestAPI.getListUniversProgram()
    let optionUniverProgram = []
    for (let e of res?.data) {
      optionUniverProgram?.push({ value: e?.id, label: e?.name })
    }
    setListUniverPrograms(optionUniverProgram)
    // return res?.data?.[0]
  }
  const getClassById = async () => {
    const res = await TeacherAPI.getClassById(
      'c74237ce-cc06-4b6b-ac6a-3fddb6e3095c',
    )
  }
  const handleResetFilter = () => {
    reset()
    fieldNames.forEach((fieldName) => {
      setValue(fieldName, initialValues[fieldName])
    })
    // navigate(PageLink.CLASSES)
    fetchMyClass({ pageParam: 1, params })
  }
  let cleanedParams = {}
  const onSubmit = () => {
    cleanedParams = {
      class_name: getValues('class_name') || undefined,
      class_code: getValues('class_code') || undefined,
      course_category_id: getValues('course_category_id') || undefined,
      facility_id: getValues('facility_id') || undefined,
      sortType: getValues('sortType') || undefined,
      fromDate: getValues('fromDate') || undefined,
      status: getValues('status') || undefined,
      instruction_mode: getValues('instruction_mode') || undefined,
      class_type: getValues('class_type') || undefined,
      subject_id: getValues('subject_id') || undefined,
      dateField: 'updated_at',
    }
    fetchMyClass({ pageParam: 1, params: cleanedParams })
    // setPagination({ current: 1 })
    // handleChangeParams(1, queryParams.page_size || 10)
  }

  useEffect(() => {
    getClassById()
    getListUniverPrograms()
  }, [])
  return (
    <SappLoadingGlobal loading={false}>
      <Layout title="My Class">
        <LayoutFilter
          listFilter={
            <Search control={control} listUniverPrograms={listUniverPrograms} />
          }
          loading={false}
          onReset={handleResetFilter}
          onSubmit={onSubmit}
        />
        <div className="">
          <Title level={4} className="mb-3 mt-6 text-gray-700">
            In Progress
          </Title>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.pages?.[0]?.data?.map((item: any, index: number) => (
              <ItemClassesByStatus key={index} classes={item} index={index} />
            ))}
          </div>
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default MyClass
