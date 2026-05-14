'use client'
import { useFeature, UserType } from '@lms/contexts'
import { DEFAULT_PAGE_SIZE } from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { useTailwindBreakpoint } from '@lms/hooks'
import { HeaderMobile, Layout, SappBreadCrumbs } from '@lms/ui'
import clsx from 'clsx'
import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  AttendanceHistory,
  AttendanceRecord,
  AttendanceStatistics,
} from '../../../components/student/attendance'
import StudentAttendanceTable from '../../../components/student/attendance/StudentAttendanceTable'

// Mock data - replace with actual API calls
const mockStatistics = {
  totalSessions: 40,
  attendedSessions: 35,
  absentSessions: 2,
  attendanceRate: 87.5,
}

const StudentAttendancePage = () => {
  const { pageLink, courseApi, params, router, classApi } = useFeature()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()

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
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null,
  )

  const handleViewDetails = (record: AttendanceRecord) => {
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
        className="mb-2 mt-4 flex w-full"

      />
      <div className="mb-6 w-full">
        {/* Statistics Cards */}
          <AttendanceStatistics
            totalSessions={statisticsData?.total || 0}
            attendedSessions={statisticsData?.attended || 0}
            absentSessions={statisticsData?.absent || 0}
            attendanceRate={statisticsData?.attendance_rate || 0}
          />
      </div>
                        
      <div className={clsx("flex", { 'gap-6': historyOpen } )}>
        {/* Main Content */}

        <div
          className={clsx(
            'flex flex-col gap-6 transition-all duration-300 ease-in-out',
            historyOpen ? 'flex-1 min-w-0' : 'w-full flex-1',
          )}
        >


          {/* Attendance Table */}
          <StudentAttendanceTable onOpenHistory={handleViewDetails} classId={courseData?.courseDetail?.class.id as string} />
        </div>

        {/* Attendance History Side Panel */}
        <div
          className={clsx(
            'overflow-hidden transition-all duration-300 ease-in-out',
            historyOpen ? 'w-[393px]' : 'w-0',
          )}
        >
          <div className="h-full w-[393px]">
            <AttendanceHistory
              isOpen={historyOpen}
              onClose={handleCloseHistory}
              record={selectedRecord}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(StudentAttendancePage)
