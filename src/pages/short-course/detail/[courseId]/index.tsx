import Breadcrumb3Level from '@components/courses/shared/Breadcrumb'
import SearchForm3Level from '@components/courses/shared/SearchForm'
import { useCourseContext } from '@contexts/index'
import { CoursesAPI } from '@pages/api/courses'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { MY_COURSES } from 'src/constants/lang'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs } from 'src/type'
import { ICourseSection, ISubSection } from 'src/type/courses-3-level'
import LayoutCourses3Level from '@components/layout/Courses3level'
import { CourseAccordion } from '@components/courses'

const DEFAULT_PAGESIZE = 18

const CourseDetail = () => {
  const router = useRouter()

  const params = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async (
    courseId: string | string[] | undefined,
    params: Object,
  ) => {
    const { data } = await CoursesAPI.getShortCourseDetail(
      courseId,
      1,
      DEFAULT_PAGESIZE,
      params,
    )

    const sections = data?.data?.course_sections_with_progress || []

    const sectionsWithSubsections: ICourseSection[] = await Promise.all(
      sections.map(async (section: ICourseSection) => {
        const { data: subsectionData } =
          await CoursesAPI.getCourseDetailActivity(courseId, section.id)

        const matchedSubsection = subsectionData.course_section_tree.find(
          (subsection: ISubSection) => subsection.id === section.id,
        )

        const subsections: ISubSection[] = matchedSubsection
          ? matchedSubsection.children
          : []

        return {
          ...section,
          subsections: subsections,
        }
      }),
    )

    return {
      class_user_id: data?.class_user_id,
      is_passed: data?.is_passed,
      data: sectionsWithSubsections,
      courseDetail: data,
    }
  }

  const { data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: ['courseDetail', router.query.courseId, params],
    queryFn: () => fetchCourseDetail(router.query.courseId, params),
    enabled: !!router.query.courseId,
    retry: false,
  })

  useEffect(() => {
    if (router.query.courseId !== undefined) {
      refetch()
    }
  }, [params.user_section_learning_status, refetch])

  const courseNameDetail = data?.courseDetail?.data?.name || ''

  const breadcrumbs: ITabs[] = [
    {
      link: `/short-course`,
      title: `My Course`,
      disable: false,
    },
    {
      link: '/',
      title: courseNameDetail,
      disable: false,
    },
  ]

  const { setCourseType } = useCourseContext()

  useEffect(() => {
    setCourseType(data?.courseDetail?.data?.course_type || '')
  })

  return (
    <LayoutCourses3Level>
      <div className="hidden pt-4 md:block">
        <SearchForm3Level placeholder={MY_COURSES.placeholderSearch3Level} />
      </div>
      <div className="relative mx-auto my-0 max-w-xxl xl-max:mx-4">
        <Breadcrumb3Level
          tabs={breadcrumbs}
          currentPage={courseNameDetail}
          className="2xl-max:py-4"
        />
        <h1 className="mt-2 text-lg font-semibold leading-6.5 text-bw-15 md:mt-0 md:text-3xl md:leading-11">
          {courseNameDetail}
        </h1>
        <CourseAccordion
          class_user_id={data?.class_user_id || ''}
          data={data?.data || []}
        />
      </div>
    </LayoutCourses3Level>
  )
}

export default withAuthorization([UserType.STUDENT])(CourseDetail)
