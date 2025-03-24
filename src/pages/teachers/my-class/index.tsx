import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { Typography } from 'antd'
import LayoutFilter from '@components/layout/Filter/index'
import Search from '@components/classes/Search'
import { useForm } from 'react-hook-form'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import ItemClassesByStatus from '@components/classes/ItemClassesByStatus'
import { EntranceTestAPI } from 'src/pages/api/entrance-test'
import { ITabs } from 'src/type'
import { PageLink } from 'src/constants'
import PaginationSAPP from '@components/base/pagination/PaginationSAPP'
import { TeacherKey } from '@pages/api/queryKey'

const { Title } = Typography

const breadcrumbs: ITabs[] = [
  {
    link: `${PageLink.TEACHERS}`,
    title: 'LMS',
  },
  {
    link: `${PageLink.TEACHER_MY_CLASS}`,
    title: 'My Class',
  },
]
interface FilterParams {
  course_name: string
  program: string
  status: string
  belong_to: string
}

// Sử dụng
const initialValues: FilterParams = {
  course_name: '',
  program: '',
  status: '',
  belong_to: '',
}

const MyClass = () => {
  const router = useRouter()
  const [listUniverPrograms, setListUniverPrograms] = useState<any>()
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [params, setParams] = useState<FilterParams>(initialValues)
  const { control, getValues, reset, setValue, watch } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      course_name: router.query.course_name || '',
      program: router.query.program || '',
      status: router.query.status || '',
      belong_to: router.query.belong_to || '',
    },
  })

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [TeacherKey.MyClass, params],
    queryFn: () => TeacherAPI.getListClass(pageIndex, pageSize, params),
    select: (data) => {
      return data
    },
    retry: false,
  })
  const handleResetFilter = () => {
    reset(initialValues)
    router.push({
      pathname: router.pathname,
      query: {},
    })
    setParams(initialValues)
  }

  const onSubmit = () => {
    const cleanedParams = {
      course_name: getValues('course_name') || undefined,
      program: getValues('program')?.value || undefined,
      status: getValues('status') || undefined,
      belong_to: getValues('belong_to') || undefined,
    }
    setParams(cleanedParams as FilterParams)
  }
  const getListUniverPrograms = async () => {
    const res = await EntranceTestAPI.getListUniversProgram()
    let optionUniverProgram = []
    for (let e of res?.data) {
      optionUniverProgram?.push({ value: e?.id, label: e?.name })
    }
    setListUniverPrograms(optionUniverProgram)
  }
  useEffect(() => {
    refetch()
    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...params },
    })
  }, [params])
  useEffect(() => {
    getListUniverPrograms()
  }, [])

  return (
    <SappLoadingGlobal loading={false}>
      <LayoutTeacher title="My Class" breadcrumbs={breadcrumbs}>
        <LayoutFilter
          listFilter={
            <Search control={control} listUniverPrograms={listUniverPrograms} />
          }
          loading={false}
          onReset={handleResetFilter}
          onSubmit={onSubmit}
        />
        <div className="mb-10 mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.classes.map((item: any, index: number) => (
              <ItemClassesByStatus key={index} classes={item} index={index} />
            ))}
          </div>
        </div>
        <PaginationSAPP
          currentPage={data?.metadata.page_index as number}
          pageSize={data?.metadata?.page_size as number}
          totalItems={data?.metadata?.total_records as number}
          setCurrentPage={setPageIndex}
          setPageSize={setPageSize}
          type={'table'}
          classname="mt-3"
        />
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default MyClass
