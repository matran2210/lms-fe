'use client'
import React from 'react'
import clsx from 'clsx'
import { IStudentAttendanceItem } from '@lms/core'
import { useFeature } from '@lms/contexts'
import { useQuery } from 'react-query'
import { CalendarIconOutline, ClockIcon, ClockInClassIcon, CloseModalIcon, DeviceIcon } from '@lms/assets'
import { formatDateToSlash } from '../../../../../../libs/utils'

interface AttendanceHistoryProps {
  isOpen: boolean
  onClose: () => void
  record: IStudentAttendanceItem | null
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { classApi } = useFeature()
  const useGetClassAttendanceHistory = () => {
    const fetchData = async () => {
      const { data } = await classApi.getClassAttendanceHistory(record?.class_schedule_user_id as string)
      return data
    }


    return useQuery(["class-attendance-history"], fetchData, {
      enabled: record?.class_schedule_user_id !== undefined && isOpen,
      retry: false,
    })
  }


  const {
    data: classAttendanceHistoryData,
  } = useGetClassAttendanceHistory()
  return (
    <div
      className={clsx(
        'h-full overflow-y-auto rounded-xl shadow-small bg-white p-8 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
    >
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            Attendance History
          </h3>
          <p className="text-sm text-gray-600">
            This Attendance History for Lesson {record?.lesson}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <CloseModalIcon />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-10">
        {/* Date, Check in/out, Device */}
        <div className="flex flex-col gap-6">
          {/* Date */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIconOutline className="w-5 h-5 text-gray-400" />
              <span className='text-gray-500'>Date:</span>
            </div>
            <div className="text-sm text-gray-900">{formatDateToSlash(record?.lesson_date.start_date as string, true)}</div>
          </div>

          {/* Check in - Check out */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm ">
              <ClockInClassIcon className="w-5 h-5 text-gray-400" />
              <span className='text-gray-500'>Check in - Check out:</span>
            </div>
            <div className="text-sm text-gray-900">
              {classAttendanceHistoryData?.checkin_time} - {classAttendanceHistoryData?.checkout_time}
            </div>
          </div>

          {/* Device */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm">
              <DeviceIcon />
              <span className='text-gray-500'>Device:</span>
            </div>
            <div className="text-sm text-gray-900">{classAttendanceHistoryData?.device as string || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceHistory
