import { UserType } from '@lms/contexts'
import {
  AppType,
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IListClassResourceParams,
  TEST_AND_QUIZ_TITLE,
} from '@lms/core'
import { useSappPaging, useTailwindBreakpoint } from '@lms/hooks'
import {
  HeaderMobile,
  Layout,
  SappBreadCrumbs,
  SearchWithMenuToggle,
} from '@lms/ui'
import { CoursesAPI } from '@pages/api/courses'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { FilterCourseIcon } from '@lms/assets'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import ClassResourceTable from './ClassResourceTable'
import FilterClassResource from './FilterClassResource'
import { ClassAPI } from '@pages/api/class'
import SearchClassResource from './SearchClassResource'

const ClassResource = () => {
  const router = useRouter()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [params, setParams] = useState<IListClassResourceParams>({
    page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
  })
  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async ({
    pageParam,
    params,
  }: {
    pageParam: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.getCourseDetail(
      router.query.courseId,
      pageParam || 1,
      DEFAULT_PAGE_SIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: ClassKey.ClassResource,
      queryFn: () =>
        ClassAPI.getClassResource(router.query.courseId as string, params),
      params,
    })

  const paramsCourseDetail = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

  const { data: courseData } = useQuery({
    queryKey: ['courseDetail'],
    queryFn: ({ pageParam }) =>
      fetchCourseDetail({ pageParam, params: paramsCourseDetail }),
    refetchOnWindowFocus: true,
    retry: false,
  })

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = courseData?.courseDetail?.data?.name

  return (
    <Layout title={'Class Resource'} showSidebar={isAlwaysShowSidebar}>
      {isAlwaysShowSidebar && (
        <div className="mb-2 mt-4 flex w-full">
          <SappBreadCrumbs
            isTeacher={false}
            breadcrumbs={[
              {
                title: 'My Course',
                link: PageLink.COURSES,
              },
              {
                title: courseNameDetail || '',
                link: PageLink.COURSE_DETAIL.replace(
                  '[courseId]',
                  router.query.courseId as string,
                ),
              },
              {
                title: 'Class Resource',
                link: '',
              },
            ]}
          />
        </div>
      )}
      <div className="mb-8">
        <SearchClassResource
          handleOpenSidebar={() => {}}
          isShowToggle
          redirectLink={PageLink.COURSES}
          appType={AppType.LMS_PRO}
        />
      </div>
      <div className="mb-6 flex w-full justify-end">
        <FilterClassResource
          setFilter={setParams}
          filter={params}
          totalResult={pagination?.total || 0}
        />
      </div>
      <ClassResourceTable
        data={data}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        setParams={setParams}
      />
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ClassResource)
