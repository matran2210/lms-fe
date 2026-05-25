'use client'
import { useFeature, UserType } from '@lms/contexts'
import { DEFAULT_PAGE_SIZE, IStudentAttendanceItem, ITabs } from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { LayoutTeacher } from '@lms/ui'
import { Divider } from 'antd'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { TeacherAttendanceTable } from '.'
import {
  AttendanceHistory
} from '../../../components/student/attendance'
import LearningAttendanceStatistics from './LearningAttendanceStatistics'


const LearningAttendance = () => {
  const { pageLink, courseApi, params, classApi } = useFeature()

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
const breadcrumbs: ITabs[] = [
    { link: pageLink.MY_CALENDAR, title: 'Home' },
    { link: pageLink.TEACHER_MY_COURSE, title: 'My Course' },
    {
      link: `${pageLink.TEACHER_MY_COURSE}/my-course/${params.courseId as string}`,
      title: courseData?.courseDetail?.data?.name || '',
    },
  ]
  return (
    <LayoutTeacher
      title={"Attendance"}
      breadcrumbs={breadcrumbs}
      isCourseDetail
      className={"p-8 bg-white"}
    >
      <div className={clsx("flex items-start", { 'gap-6': historyOpen })}>
        {/* Main Content */}

        <div
          ref={mainContentRef}
          className={clsx(
            'bg-white transition-all duration-300 ease-in-out',
            historyOpen ? 'flex-1 min-w-0' : 'w-full flex-1',
          )}
        >
          <div className="w-full">
            {/* Statistics Cards */}
            <LearningAttendanceStatistics
              totalSessions={statisticsData?.total || 0}
              attendedSessions={statisticsData?.attended || 0}
              absentSessions={statisticsData?.absent || 0}
              attendanceRate={statisticsData?.attendance_rate || 0}
            />
          </div>
          <Divider className="my-8" />

          {/* Attendance Table */}
          <TeacherAttendanceTable onOpenHistory={handleViewDetails} classId={courseData?.courseDetail?.class.id as string} />
        </div>

        {/* Attendance History Side Panel */}
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
              />
            </div>
          )}
        </div>
      </div>
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(LearningAttendance)
