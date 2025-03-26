import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import LayoutFilter from '@components/layout/Filter/index'
import ChapterTestFilter from 'src/pages/teachers/my-class/[id]/test-quiz-list/chapter-test/components/ChapterTestFilter'
import { useForm } from 'react-hook-form'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import ItemClassesByStatus from '@components/classes/ItemClassesByStatus'
import { EntranceTestAPI } from 'src/pages/api/entrance-test'
import { ITabs } from 'src/type'
import { PageLink } from 'src/constants'
import SappTable from '@components/table/SappTable'
import { TeacherKey } from '@pages/api/queryKey'
import { TablePaginationConfig } from 'antd'
import StudentCell from '@pages/teachers/my-class/components/StudentCell'
import { formatDateFromUTC } from '@utils/index'

interface FilterParams {
  status?: string
}

const initialValues: FilterParams = {
  status: undefined,
}

const ChapterTest = () => {
  const router = useRouter()
  const classId = router?.query?.id as string
  const chapterTestId = router?.query?.chapterTestId as string
  const [listUniverPrograms, setListUniverPrograms] = useState<
    { value: string; label: string }[]
  >([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [params, setParams] = useState<FilterParams>(initialValues)

  const { control, getValues, reset } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      course_name: router.query.course_name || '',
      program: router.query.program || '',
      status: router.query.status || undefined,
      belong_to: router.query.belong_to || '',
    },
  })
  const breadcrumbs: ITabs[] = [
    { link: PageLink.TEACHERS, title: 'LMS' },
    { link: PageLink.TEACHER_MY_CLASS, title: 'My Class' },
    { link: `${PageLink.TEACHER_MY_CLASS}/${classId}`, title: 'Class Detail' },
    {
      link: `${PageLink.TEACHER_MY_CLASS}/${classId}`,
      title: 'Test/Quiz List',
    },
    { link: '', title: 'Chapter Test' },
  ]
  const { data, isLoading, refetch } = useQuery({
    queryKey: [TeacherKey.ChapterTest, pageIndex, pageSize, params],
    queryFn: async () => {
      try {
        return await TeacherAPI.getDetailTestQuiz(
          classId,
          chapterTestId,
          pageIndex,
          pageSize,
          params,
        )
      } catch (error) {
        return null
      }
    },
    retry: false,
  })
  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }
  const handleResetFilter = () => {
    reset(initialValues)
    router.replace(router.pathname, undefined, { shallow: true })
    setParams(initialValues)
  }

  const onSubmit = () => {
    const searchParams: FilterParams = {
      status: getValues('status')?.value || undefined,
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

  const columnsValue = [
    {
      title: 'Student ID',
      render: (record: any) => <StudentCell data={record?.user?.id ?? ''} />,
    },
    {
      title: 'Name',
      render: (record: any) => (
        <StudentCell data={record?.user?.detail?.full_name ?? ''} />
      ),
    },
    {
      title: 'Email',
      render: (record: any) => (
        <StudentCell data={record?.user?.user_contacts?.[0]?.email ?? ''} />
      ),
    },
    {
      title: 'Access Period',
      render: (record: any) => <StudentCell data={''} />,
    },
    {
      title: 'Level',
      render: (record: any) => (
        <StudentCell data={record?.user?.detail?.level ?? ''} />
      ),
    },
    {
      title: 'Duration',
      render: (record: any) => (
        <StudentCell
          data={`${formatDateFromUTC(record?.started_at ?? '')} - ${formatDateFromUTC(
            record?.updated_at ?? '',
          )}`}
        />
      ),
    },
    {
      title: 'Progress',
      render: (record: any) => (
        <StudentCell
          data={`${Math.round(
            ((record?.learning_progress?.total_course_sections_completed ?? 0) /
              (record?.learning_progress?.total_course_sections || 1)) *
              100,
          )}%`}
        />
      ),
    },
    {
      title: 'Exam Date',
      render: (record: any) => <StudentCell data={record?.examDate ?? ''} />,
    },
  ]

  return (
    <SappLoadingGlobal loading={isLoading}>
      <LayoutTeacher title="My Class" breadcrumbs={breadcrumbs}>
        <LayoutFilter
          listFilter={
            <ChapterTestFilter
              control={control}
              //   listUniverPrograms={listUniverPrograms}
            />
          }
          className="mb-6"
          loading={isLoading}
          onReset={handleResetFilter}
          onSubmit={onSubmit}
        />
        <SappTable
          handleChangeParams={handleChangeParams}
          filterParams={params}
          fetchData={() => {}}
          fetchTableData={() => {}}
          columns={columnsValue}
          data={data?.data?.class_user_quizzes ?? []}
          pagination={pagination}
          setPagination={setPagination}
          loading={isLoading}
          showCheckbox={false}
          setSelection={() => {}}
          selections={new Map()}
        />
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default ChapterTest
