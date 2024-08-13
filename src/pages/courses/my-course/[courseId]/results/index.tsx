import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import Heading from '@components/mycourses/Heading'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { CoursesAPI } from 'src/pages/api/courses'
import ResultsTable from './ResultsTable'
import SearchForm from '@components/mycourses/Search'
import Layout from '@components/layout'

const DEFAULT_PAGESIZE = 10

const Results = () => {
  const router = useRouter()

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
      DEFAULT_PAGESIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }

  const params = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

  const {
    data: courseData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['courseDetail'],
    queryFn: ({ pageParam }) => fetchCourseDetail({ pageParam, params }),
    enabled: router.isReady,
  })

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = courseData?.courseDetail?.data?.name
  const courseId = courseData?.courseDetail?.data?.id

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Course Result">
        <div className="header bg-white border-b border-default h-[70px]">
          <div className="max-w-xxl my-0 mx-auto flex py-6 xl-max:mx-5">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="container">
          <div className="main max-w-xxl my-0 mx-auto relative">
            <div className="flex justify-between pt-6 pb-4 w-full items-center">
              {isSuccess && (
                <BreadcrumbFilter
                  name={courseNameDetail}
                  subpath="Results"
                  courseId={router.query.courseId}
                />
              )}
              {/* <FilterCourseDetail totalResult={courses?.length || 0} /> */}
            </div>
          </div>
          <div className="bg-white max-w-xxl my-0 mx-auto flex">
            <Heading greeting="" title={'Results'} />
          </div>
          <div className="max-w-xxl my-0 mx-auto xl-max:container bg-white px-8 pt-8 pb-3 mt-6 mb-6">
            <ResultsTable courseId={courseId} />
          </div>
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default Results
