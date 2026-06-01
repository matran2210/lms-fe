'use client'
import { useFeature, UserType } from '@lms/contexts'
import { DEFAULT_PAGE_SIZE, IStudentAttendanceItem } from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { useTailwindBreakpoint } from '@lms/hooks'
import { HeaderMobile, Layout, SappBreadCrumbs } from '@lms/ui'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import {
  AttendanceHistory,
  AttendanceStatistics,
} from '../../../components/student/attendance'
import StudentAttendanceTable from '../../../components/student/attendance/StudentAttendanceTable'

const StudentAttendancePage = () => {
  const { pageLink, courseApi, params, router, classApi } = useFeature()
  const { isAlwaysShowSidebar, isTabletView, isMobileView } = useTailwindBreakpoint()

  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async ({
    pageParam,
  }: {
    pageParam: number
  }) => {
    const { data } = await courseApi.getCourseDetail(
      params.courseId,
      pageParam || 1,
      DEFAULT_PAGE_SIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }
  const { data: courseData } = useQuery({
    queryKey: ['courseDetail'],
    queryFn: ({ pageParam }) =>
      fetchCourseDetail({ pageParam }),
    refetchOnWindowFocus: true,
    retry: false,
  })
    const fetchAttendanceStatistics = async ({
    class_id,
  }: {
    class_id: string
  }) => {
    const { data } = await classApi.getStudentAttendanceSummary(
      class_id,)
    return data
  }
  const { data: statisticsData } = useQuery({
    queryKey: ['attendanceStatistics', courseData?.courseDetail?.class.id],
    queryFn: () => fetchAttendanceStatistics({ class_id: courseData?.courseDetail?.class.id as string }),
    refetchOnWindowFocus: true,
    retry: false,
    enabled: courseData?.courseDetail?.class.id !== undefined
  })  

  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<IStudentAttendanceItem | null>(
    null,
  )
  const mainContentRef = useRef<HTMLDivElement | null>(null)
  const [panelHeight, setPanelHeight] = useState<number>()

  useEffect(() => {
    const element = mainContentRef.current

    if (!element) return

    const updateHeight = () => {
      setPanelHeight(element.getBoundingClientRect().height)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const handleViewDetails = (record: IStudentAttendanceItem) => {
    setSelectedRecord(record)
    setHistoryOpen(true)
  }

  const handleCloseHistory = () => {
    setHistoryOpen(false)
    setSelectedRecord(null)
  }

  return (
    <Layout
      title="Class Attendance"
      className="pb-4"
      showSidebar={isAlwaysShowSidebar}
    >
      {isAlwaysShowSidebar && (
        <div className="mb-2 mt-4 flex w-full">
          <SappBreadCrumbs
            isTeacher={false}
            breadcrumbs={[
              { title: 'My Course', link: pageLink.COURSES },
              {
                title: courseData?.courseDetail?.data?.name || '',
                link: pageLink.COURSE_DETAIL.replace(
                  '[courseId]',
                  params.courseId as string,
                ),
              },
              { title: "Class Attendance", link: '' },
            ]}
          />
        </div>
      )}

      <HeaderMobile
        title={"Class Attendance"}
        showIcon={true}
        onBack={() => {
          router.push(`/courses/my-course/${params?.courseId}`)
        }}
        className="my-8 flex w-full"

      />
      <div className="mb-8 lg:mb-6 w-full">
        {/* Statistics Cards */}
          <AttendanceStatistics
            totalSessions={statisticsData?.total || 0}
            attendedSessions={statisticsData?.attended || 0}
            absentSessions={statisticsData?.absent || 0}
            attendanceRate={statisticsData?.attendance_rate || 0}
          />
      </div>
                        
      <div className={clsx("flex items-start", { 'gap-6': historyOpen && isAlwaysShowSidebar } )}>
        {/* Main Content */}

        <div
          ref={mainContentRef}
          className={clsx(
            'flex flex-col gap-6 transition-all duration-300 ease-in-out',
            historyOpen && isAlwaysShowSidebar ? 'flex-1 min-w-0' : 'w-full flex-1',
          )}
        >
          {/* Attendance Table */}
          <StudentAttendanceTable onOpenHistory={handleViewDetails} classId={courseData?.courseDetail?.class.id as string}
          classUserId={courseData?.courseDetail?.class_user_id as string} />
        </div>

        {isAlwaysShowSidebar && (
          <div
            className={clsx(
              'overflow-hidden transition-all duration-300 ease-in-out',
              historyOpen ? 'w-[393px]' : 'w-0',
            )}
          >
            {historyOpen && (
              <div className="w-[393px]" style={panelHeight ? { height: panelHeight } : undefined}>
                <AttendanceHistory
                  isOpen={historyOpen}
                  onClose={handleCloseHistory}
                  record={selectedRecord}
                  classId={courseData?.courseDetail?.class.id as string}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {(isTabletView || isMobileView) && (
        <AttendanceHistory
          isOpen={historyOpen}
          onClose={handleCloseHistory}
          record={selectedRecord}
          classId={courseData?.courseDetail?.class.id as string}
        />
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(StudentAttendancePage)
