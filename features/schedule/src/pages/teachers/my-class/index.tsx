'use client'
import { useFeature, UserType } from '@lms/contexts'
import { IMyClass, ITabs, TeacherKey } from '@lms/core'
import { LayoutFilter, LayoutTeacher, OldPaginationSAPP } from '@lms/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { withAuthorization } from '@lms/hoc'
import MyClassFilter from '../../../components/teacher/MyClassFilter'
import ItemClassesByStatus from '../../../components/teacher/ItemClassesByStatus'



interface FilterParams {
  search?: string
  course_category_id?: string
  class_teacher_status?: string
  subject_id?: string
}

const initialValues: FilterParams = {
  search: undefined,
  course_category_id: undefined,
  class_teacher_status: undefined,
  subject_id: undefined,
}

const MyClassPage = () => {
  const { router, pageLink, teacherApi, pathname } = useFeature()
  const breadcrumbs: ITabs[] = [
    { link: pageLink.TEACHERS, title: 'LMS' },
    { link: pageLink.TEACHER_MY_CLASS, title: 'My Class' },
  ]
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [params, setParams] = useState<FilterParams>(initialValues)

  const { control, getValues, reset, setValue, watch } = useForm()
  const courseCategoryId = watch('course_category_id')
  const { data, isLoading } = useQuery({
    queryKey: [TeacherKey.MyClass, pageIndex, pageSize, params],
    queryFn: async () => {
      try {
        return await teacherApi?.getListClass(pageIndex, pageSize, params)
      } catch (error) {
        return null
      }
    },
    retry: false,
  })

  const handleResetFilter = () => {
    reset({
      search: '',
      course_category_id: '',
      class_teacher_status: '',
      subject_id: '',
    })
    router.replace(pathname)
    setParams(initialValues)
  }

  const onSubmit = () => {
    const searchParams: FilterParams = {
      search: (getValues('search') as string) || undefined,
      course_category_id: getValues('course_category_id')?.value || undefined,
      class_teacher_status:
        getValues('class_teacher_status')?.value || undefined,
      subject_id: getValues('subject_id')?.value || undefined,
    }
    setParams(searchParams)
  }

  return (
    <LayoutTeacher title="My Class" breadcrumbs={breadcrumbs}>
      <LayoutFilter
        listFilter={
          <MyClassFilter
            control={control}
            setValue={setValue}
            courseCategoryId={courseCategoryId}
          />
        }
        loading={isLoading}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <div className="flex min-h-screen flex-col">
        {/* Danh sách lớp */}
        <div className="mb-10 mt-8 flex-grow">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.classes?.map((item: IMyClass, index: number) => (
              <ItemClassesByStatus key={index} classes={item} index={index} />
            ))}
          </div>
        </div>
        {data?.metadata?.total_records && (
          <div className="mt-auto">
            <OldPaginationSAPP
              currentPage={data?.metadata?.page_index ?? 1}
              pageSize={data?.metadata?.page_size ?? 10}
              totalItems={data?.metadata?.total_records ?? 0}
              setCurrentPage={setPageIndex}
              setPageSize={setPageSize}
              type="table"
              classname="mt-3"
            />
          </div>
        )}
      </div>
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(MyClassPage)
