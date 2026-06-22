'use client'
import { AlarmClockIcon, BookInClassIcon, CalendarIconOutline, ClockInClassIcon, CloseModalIcon, DeviceTeacherIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { ITeacherTeachingAttendanceItem } from '@lms/core'
import { buildLocalLessonDateTime, formatDateFromUTC } from '@lms/utils'
import { Divider } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import AttendanceInfoRow from './AttendanceInfoRow'

interface AttendanceHistoryProps {
  isOpen: boolean
  onClose: () => void
  record: ITeacherTeachingAttendanceItem | null
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { userApi } = useFeature()
  const attendanceHistoryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen || !attendanceHistoryRef.current) return

    requestAnimationFrame(() => {
      attendanceHistoryRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    })
  }, [isOpen, record?.teacher_schedule_id])

  const useGetTeacherTeachingAttendanceHistory = () => {
    const fetchData = async () => {
      const { data } = await userApi.getTeacherTeachingAttendanceHistory(record?.teacher_schedule_id as string)
      return data
    }


    return useQuery(["teacher-teaching-attendance-history", record?.teacher_schedule_id], fetchData, {
      enabled: record?.teacher_schedule_id !== undefined && isOpen,
      retry: false,
    })
  }

  const {
    data: teacherTeachingAttendanceHistoryData,
  } = useGetTeacherTeachingAttendanceHistory()

  const localStartDate = buildLocalLessonDateTime(
    record?.start_date,
    record?.start_time
  )
  const localEndDate = buildLocalLessonDateTime(
    record?.start_date,
    record?.end_time
  )


  return (
    <div
      ref={attendanceHistoryRef}
      className={clsx(
        'flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">
            Attendance History
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <CloseModalIcon />
          </button>
        </div>
        <div className="text-gray-800">
          This Attendance History for <b>{record?.lesson}</b>
        </div>
      </div>

      <Divider className='my-8 bg-gray-6' />

      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <AttendanceInfoRow icon={<BookInClassIcon className='h-5 w-5 text-gray-400' />} label="Class" labelClassName='line-clamp-2' value={record?.class || '-'} />
        <AttendanceInfoRow
          icon={<CalendarIconOutline className="h-5 w-5 text-gray-400" />}
          label="Date"
          value={`${localStartDate?.isValid() ? localStartDate.format('DD/MM/YYYY') : '-'} ${localStartDate?.isValid() ? localStartDate.format('HH:mm') : '-'} : ${localEndDate?.isValid() ? localEndDate.format('HH:mm') : '-'}`}
        />
        <AttendanceInfoRow icon={<ClockInClassIcon className="h-5 w-5 text-gray-400" />} label="Actual Workload" valueClassName='text-[#025EFF]' value={record?.workload || '0'} />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-2">
          {(teacherTeachingAttendanceHistoryData?.data || []).map((historyRecord, index) => (
            <div key={index} className="flex flex-col gap-3 border-t border-gray-[#F1F1F4] py-3">
              <AttendanceInfoRow
              icon={<AlarmClockIcon className='h-5 w-5 text-gray-400' />}
                label="Check In - Check Out"
                value={`${historyRecord?.checkin_time ? formatDateFromUTC(historyRecord.checkin_time) : '-'} - ${historyRecord?.checkout_time ? formatDateFromUTC(historyRecord.checkout_time) : '-'}`}
              />
              <AttendanceInfoRow icon={<DeviceTeacherIcon />} label="Device" value={historyRecord?.device || '-'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AttendanceHistory
