'use client'
import { RequestProvider, useFeature, UserType } from '@lms/contexts'
import { ITabs } from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { LayoutTeacher, SappTabs } from '@lms/ui'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {
  TeachingAttendance,
  LearningAttendance,
  AttendanceHistory,
  AttendanceHistoryRecord,
} from '../../../components/teacher/attendance'

const tabs = [
  {
    id: 1,
    title: 'Teaching Attendance',
    urlTitle: 'teachingattendance',
  },
  {
    id: 2,
    title: 'Learning Attendance',
    urlTitle: 'learningattendance',
  },
]

const TeacherAttendancePage = () => {
  const { pageLink, query } = useFeature()
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

  const [selected, setSelected] = useState<number>(() => {
    if (query.tab) {
      return (
        tabs.find((item) => item.urlTitle === query.tabId)?.id ?? tabs[0].id
      )
    }
    return tabs[0].id
  })

  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] =
    useState<AttendanceHistoryRecord | null>(null)

  // Sync selected tab with URL query parameter
  useEffect(() => {
    console.log(selected, query.tabId, '909090')

    if (query.tabId) {
      const tabId = tabs.find((item) => item.urlTitle === query.tabId)?.id
      if (tabId && tabId !== selected) {
        setSelected(tabId)
      }
    }
  }, [query.tabId])

  const handleOpenHistory = (record: AttendanceHistoryRecord) => {
    setSelectedRecord(record)
    setHistoryOpen(true)
  }

  const handleCloseHistory = () => {
    setHistoryOpen(false)
    setSelectedRecord(null)
  }

  const renderAttendanceDetail = (selected: number) => {
    switch (selected) {
      case 1:
        return <TeachingAttendance onOpenHistory={handleOpenHistory} />
      case 2:
        return <LearningAttendance onOpenHistory={handleOpenHistory} />
      default:
        return null
    }
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
              'rounded-xl bg-white px-8 py-5 transition-all duration-300 ease-in-out',
              historyOpen ? 'flex-1 min-w-0' : 'w-full flex-1 ',
            )}
          >
            <SappTabs
              tabs={tabs}
              setSelected={setSelected}
              selected={selected}
              bordered
            />
            <div className="w-full rounded-xl bg-white pt-6">
              {renderAttendanceDetail(selected)}
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
