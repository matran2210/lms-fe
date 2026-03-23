'use client'
import { useFeature, UserType } from '@lms/contexts'
import {
  ANIMATION,
  COURSE_TYPE,
  ICourseInfo,
  IMockTestResult,
  ITopicProgress,
  IWeeklyReport,
} from '@lms/core'
import {
  ContinueLearning,
  CourseDashboard,
  ExamDashboard,
} from '@lms/feature-dashboard'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  DashboardSkeleton,
  HeaderMobile,
  Layout,
  SappBreadCrumbs,
} from '@lms/ui'
import { DashboardAPI } from 'src/api/dashboard'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import { extractNotActivatedData } from '@lms/utils'
import {
  selectPopupActivateCourse,
  showPopupActivatedCourse,
} from '@lms/contexts/redux/slice/Popup/ActivatedCourse'

const Dashboard = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dispatch, useAppSelector } = useFeature()
  const selector = useAppSelector?.(selectPopupActivateCourse)
  const params = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [infoCourse, setInfoCourse] = useState<ICourseInfo>({
    course_type: COURSE_TYPE.NORMAL_COURSE,
    course_name: '',
  })
  const [topicProgressData, setTopicProgressData] = useState<
    ITopicProgress[] | null
  >(null)
  const [overallProgressData, setOverallProgressData] = useState<any>(null)
  const [weeklyReportData, setWeeklyReportData] =
    useState<IWeeklyReport | null>(null)
  const [mockTestResultsData, setMockTestResultsData] =
    useState<IMockTestResult | null>(null)
  const [isLoadingTopicProgress, setIsLoadingTopicProgress] = useState(true)
  const [isLoadingOverallProgress, setIsLoadingOverallProgress] = useState(true)
  const [isLoadingWeeklyReport, setIsLoadingWeeklyReport] = useState(true)
  const [isLoadingMockTestResults, setIsLoadingMockTestResults] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const getTopicProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getTopicProgress(id)
      if (res && res.success && res?.data) {
        setTopicProgressData(res.data)
        // Cập nhật course_type và course_name từ response
        if (res.data[0]) {
          setInfoCourse({
            course_type: res.data[0].course_type,
            course_name: res.data[0].course_name,
          })
        }
      }
    } catch (error) {
      setTopicProgressData(null)
    } finally {
      setIsLoadingTopicProgress(false)
    }
  }

  const getOverProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getOverProgress(id)
      if (res && res.success) {
        setOverallProgressData(res.data)
      }
    } catch (error: any) {
      const data = extractNotActivatedData(error)
      if (data) {
        dispatch?.(showPopupActivatedCourse(data))
      }
    } finally {
      setIsLoadingOverallProgress(false)
    }
  }

  const getWeeklyReport = async (id: string) => {
    try {
      const res = await DashboardAPI.getWeeklyReport(id)
      if (res && res.success) {
        setWeeklyReportData(res.data)
      }
    } catch (error) {
      setWeeklyReportData(null)
    } finally {
      setIsLoadingWeeklyReport(false)
    }
  }

  const getMockTestResults = async (id: string) => {
    try {
      const res = await DashboardAPI.getMockTestResults(id)
      if (res && res.success) {
        setMockTestResultsData(res.data)
      }
    } catch (error) {
      setMockTestResultsData(null)
    } finally {
      setIsLoadingMockTestResults(false)
    }
  }

  useEffect(() => {
    if (infoCourse?.course_type === COURSE_TYPE.NORMAL_COURSE) {
      if (
        !isLoadingOverallProgress &&
        !isLoadingWeeklyReport &&
        !isLoadingTopicProgress
      ) {
        setIsLoading(false)
      }
    } else {
      if (!isLoadingMockTestResults && !isLoadingTopicProgress) {
        setIsLoading(false)
      }
    }
  }, [
    isLoadingOverallProgress,
    isLoadingWeeklyReport,
    isLoadingMockTestResults,
    isLoadingTopicProgress,
    infoCourse?.course_type,
  ])

  useEffect(() => {
    if (params?.courseId) {
      setIsLoading(true)
      const courseId = params.courseId as string

      // Reset states
      setIsLoadingTopicProgress(true)
      setTopicProgressData(null)
      setOverallProgressData(null)
      setWeeklyReportData(null)
      setMockTestResultsData(null)

      // Gọi getTopicProgress trước để biết course_type
      getTopicProgress(courseId)
    }
  }, [params?.courseId])

  // Sau khi có course_type, gọi API tương ứng
  useEffect(() => {
    if (params?.courseId && infoCourse?.course_type) {
      const courseId = params.courseId as string
      if (infoCourse.course_type === COURSE_TYPE.NORMAL_COURSE) {
        setIsLoadingOverallProgress(true)
        setIsLoadingWeeklyReport(true)
        getOverProgress(courseId)
        getWeeklyReport(courseId)
      } else {
        setIsLoadingMockTestResults(true)
        getMockTestResults(courseId)
      }
    }
  }, [infoCourse?.course_type, params?.courseId])
  return (
    <Layout title="Dashboard" showSidebar={isAlwaysShowSidebar} size="xl">
      {isLoading || selector?.openActive ? (
        <DashboardSkeleton />
      ) : (
        <div data-aos={ANIMATION.DATA_AOS}>
          <div>
            <div className="main relative mx-auto my-0">
              <div className="mt-4 hidden w-full items-center justify-between xl:flex">
                <SappBreadCrumbs
                  isTeacher={false}
                  breadcrumbs={[
                    {
                      title: 'My Course',
                      link: PageLink.COURSES,
                    },
                    {
                      title: infoCourse.course_name,
                      link: PageLink.COURSE_DETAIL.replace(
                        '[courseId]',
                        params.courseId as string,
                      ),
                    },
                    {
                      title: 'Student Dashboard',
                      link: '',
                    },
                  ]}
                />
              </div>
              <div className="mb-6 mt-2 grid md:mb-7 xl:mb-8">
                <HeaderMobile
                  title="Student Dashboard"
                  onBack={() => router.back()}
                />
              </div>
            </div>
          </div>
          <div className="text-ink-700 mx-auto flex min-h-[calc(100vh-5rem)] font-sans">
            {infoCourse?.course_type == COURSE_TYPE.NORMAL_COURSE
              ? infoCourse && (
                  <CourseDashboard
                    topicProgressData={topicProgressData}
                    overallProgressData={overallProgressData}
                    weeklyReportData={weeklyReportData}
                  />
                )
              : infoCourse && (
                  <ExamDashboard
                    topicProgressData={topicProgressData}
                    mockTestResultsData={mockTestResultsData}
                  />
                )}
          </div>
          <ContinueLearning />
        </div>
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(Dashboard)
