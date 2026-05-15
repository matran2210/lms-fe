'use client'
import { RequestProvider, useFeature, UserType } from '@lms/contexts'
import { ITabs, ITeacherTeachingAttendanceItem } from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { LayoutTeacher } from '@lms/ui'
import clsx from 'clsx'
import { useState } from 'react'
import {
  AttendanceHistory,
  TeachingAttendance
} from '../../../components/teacher/attendance'

const TeacherAttendancePage = () => {
  const { pageLink } = useFeature()
  const breadcrumbs: ITabs[] = [
    {
      link: pageLink.MY_CALENDAR,
      title: 'Home',
    },
    {
      link: pageLink.TEACHER_ATTENDANCE,
      title: 'Attendance',
    },
  ]

  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] =
    useState<ITeacherTeachingAttendanceItem | null>(null)


  const handleOpenHistory = (record: ITeacherTeachingAttendanceItem) => {
    setSelectedRecord(record)
    setHistoryOpen(true)
  }

  const handleCloseHistory = () => {
    setHistoryOpen(false)
    setSelectedRecord(null)
  }

  return (
    <RequestProvider>
      <LayoutTeacher
        title="Attendance"
        breadcrumbs={breadcrumbs}
        className="bg-[#F2F4F7] p-0"
        layoutClassname={clsx(
          'transition-all duration-300 ease-in-out',
          historyOpen ? 'pr-8' : '',
        )}
      >
        <div className="flex gap-6 items-stretch">
          {/* Main Content - Tabs */}
          <div
            className={clsx(
              'rounded-xl bg-white p-8 transition-all duration-300 ease-in-out',
              historyOpen ? 'flex-1 min-w-0' : 'w-full flex-1 ',
            )}
          >
            <div className="w-full rounded-xl bg-white">
              <TeachingAttendance onOpenHistory={handleOpenHistory} />
            </div>
          </div>

          {/* Attendance History Side Panel */}
          <div
            className={clsx(
              'overflow-hidden transition-all duration-300 ease-in-out',
              historyOpen ? 'w-[440px]' : 'w-0',
            )}
          >
            <div
              className={'h-full w-[440px'}
            >
              <AttendanceHistory
                isOpen={historyOpen}
                onClose={handleCloseHistory}
                record={selectedRecord}
              />
            </div>
          </div>
        </div>
      </LayoutTeacher>
    </RequestProvider>
  )
}

export default withAuthorization([UserType.TEACHER])(TeacherAttendancePage)
