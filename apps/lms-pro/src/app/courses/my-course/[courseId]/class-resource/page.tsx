'use client'
import { UserType } from '@lms/contexts'
import {
  AppType,
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IListClassResourceParams,
} from '@lms/core'
import { useSappPaging, useTailwindBreakpoint } from '@lms/hooks'
import { ClassResourceSkeleton, Layout, SappBreadCrumbs } from '@lms/ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import ClassResourceTable from './ClassResourceTable'
import FilterClassResource from './FilterClassResource'
import SearchClassResource from './SearchClassResource'
import { normalizeToArray } from '@lms/utils'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'
import { ClassAPI } from 'src/api/class'

const ClassResource = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const param = useParams()
  const query = Object.fromEntries(searchParams.entries())
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
      param.courseId,
      pageParam || 1,
      DEFAULT_PAGE_SIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }

  const { data, pagination, isLoading, setPagination } = useSappPaging({
    uniqueKey: ClassKey.ClassResource,
    queryFn: () => ClassAPI.getClassResource(param.courseId as string, params),
    params,
  })

  const paramsCourseDetail = {
    user_section_learning_status:
      query.user_section_learning_status || undefined,
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

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      page_index: query.page_index
        ? Number(query.page_index)
        : DEFAULT_PAGE_NUMBER,

      suffix_types: normalizeToArray(query.suffix_types),
      schedule_ids: normalizeToArray(query.schedule_ids),

      search_key:
        typeof query.search_key === 'string' ? query.search_key : undefined,
    }))
  }, [
    query.page_index,
    query.suffix_types,
    query.schedule_ids,
    query.search_key,
  ])

  return (
    <Layout title="Class Resource" showSidebar={isAlwaysShowSidebar}>
      {isLoading ? (
        <ClassResourceSkeleton />
      ) : (
        <>
          {isAlwaysShowSidebar && (
            <div className="mb-2 mt-4 flex w-full">
              <SappBreadCrumbs
                isTeacher={false}
                breadcrumbs={[
                  { title: 'My Course', link: PageLink.COURSES },
                  {
                    title: courseNameDetail || '',
                    link: PageLink.COURSE_DETAIL.replace(
                      '[courseId]',
                      router.query.courseId as string,
                    ),
                  },
                  { title: 'Class Resource', link: '' },
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

          <div className="mb-6 flex w-full justify-between">
            <div className="text-2xl font-semibold text-gray-800">
              Class Resource
            </div>
            <FilterClassResource totalResult={pagination?.total || 0} />
          </div>

          <ClassResourceTable
            data={data}
            pagination={pagination}
            setPagination={setPagination}
            isLoading={false}
          />
        </>
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ClassResource)
