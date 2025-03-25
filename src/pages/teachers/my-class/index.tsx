import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
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

const breadcrumbs: ITabs[] = [
  { link: PageLink.TEACHERS, title: 'LMS' },
  { link: PageLink.TEACHER_MY_CLASS, title: 'My Class' },
]

interface FilterParams {
  course_name?: string
  program?: string
  status?: string
  belong_to?: string
}

const initialValues: FilterParams = {
  course_name: '',
  program: '',
  status: '',
  belong_to: '',
}

const MyClass = () => {
  const router = useRouter()
  const [listUniverPrograms, setListUniverPrograms] = useState<
    { value: string; label: string }[]
  >([])
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [params, setParams] = useState<FilterParams>(initialValues)

  const { control, getValues, reset } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      course_name: router.query.course_name || '',
      program: router.query.program || '',
      status: router.query.status || '',
      belong_to: router.query.belong_to || '',
    },
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: [TeacherKey.MyClass, pageIndex, pageSize, params],
    queryFn: async () => {
      try {
        return await TeacherAPI.getListClass(pageIndex, pageSize, params)
      } catch (error) {
        return null
      }
    },
    retry: false,
  })

  const handleResetFilter = () => {
    reset(initialValues)
    router.replace(router.pathname, undefined, { shallow: true })
    setParams(initialValues)
  }

  const onSubmit = () => {
    const searchParams: FilterParams = {
      course_name: (getValues('course_name') as string) || undefined,
      // program: getValues('program')?.value || undefined,
      status: (getValues('status') as string) || undefined,
      belong_to: (getValues('belong_to') as string) || undefined,
    }
    setParams(searchParams)
  }

  useEffect(() => {
    EntranceTestAPI.getListUniversProgram().then((res) => {
      setListUniverPrograms(
        res?.data?.map((e: any) => ({ value: e.id, label: e.name })) || [],
      )
    })
  }, [])

  useEffect(() => {
    refetch()
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_index: pageIndex,
          page_size: pageSize,
          ...params,
        },
      },
      undefined,
      { shallow: true },
    )
  }, [pageIndex, pageSize, params])

  return (
    <SappLoadingGlobal loading={isLoading}>
      <LayoutTeacher title="My Class" breadcrumbs={breadcrumbs}>
        <LayoutFilter
          listFilter={
            <Search control={control} listUniverPrograms={listUniverPrograms} />
          }
          loading={isLoading}
          onReset={handleResetFilter}
          onSubmit={onSubmit}
        />
        <div className="mb-10 mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.classes?.map((item: any, index: number) => (
              <ItemClassesByStatus key={index} classes={item} index={index} />
            ))}
          </div>
        </div>
        <PaginationSAPP
          currentPage={data?.metadata?.page_index ?? 1}
          pageSize={data?.metadata?.page_size ?? 10}
          totalItems={data?.metadata?.total_records ?? 0}
          setCurrentPage={setPageIndex}
          setPageSize={setPageSize}
          type="table"
          classname="mt-3"
        />
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default MyClass
