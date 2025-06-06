import Layout from '@components/layout'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { MY_COURSES } from 'src/constants/lang'
import { CoursesAPI } from 'src/pages/api/courses'
import ResultsTable from './ResultsTable'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

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
    refetchOnWindowFocus: true,
    retry: false,
  })

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = courseData?.courseDetail?.data?.name

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Course Result">
        <div className="h-[70px] border-b border-[#DCDDDD] bg-white">
          <div className="mx-auto my-0 flex max-w-[1144px] py-6 max-[1199px]:mx-5">
            <SearchForm
              placeholder={MY_COURSES.placeholderSearch}
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="mx-auto my-0 max-w-[1144px] max-[1199px]:mx-6">
          {isLoading ? (
            <CourseSkeleton className="pt-6" />
          ) : (
            <>
              <div className="main relative mx-auto my-0 max-w-[1144px]">
                <div className="flex w-full items-center justify-between pb-4 pt-6">
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
              <div className="mx-auto my-0 flex max-w-[1144px] bg-white">
                <Heading greeting="" title={'Results'} />
              </div>
              <div className="mx-auto my-0 mb-6 mt-6 max-w-[1144px] bg-white px-8 pb-3 pt-8 max-[1199px]:container">
                {isSuccess && <ResultsTable />}
              </div>
            </>
          )}
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(Results)
