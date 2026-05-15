'use client'
import { CloseModalIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { ITeacherTeachingAttendanceItem } from '@lms/core'
import { SAPPBadge } from '@lms/ui'
import { formatDateToSlash } from '@lms/utils'
import clsx from 'clsx'
import React from 'react'
import { useQuery } from 'react-query'

interface AttendanceHistoryProps {
  isOpen: boolean
  onClose: () => void
  record: ITeacherTeachingAttendanceItem | null
}

// Status badge mapping
const statusToBadge = {
  Attended: {
    label: 'Attended',
    type: 'success' as const,
  },
  Absent: {
    label: 'Absent',
    type: 'error' as const,
  },
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { userApi } = useFeature()
  const useGetTeacherTeachingAttendanceHistory = () => {
    const fetchData = async () => {
      const { data } = await userApi.getTeacherTeachingAttendanceHistory(record?.class_schedule_id as string)
      return data
    }


    return useQuery(["teahcer-teaching-attendance-history"], fetchData, {
      enabled: record?.class_schedule_id !== undefined && isOpen,
      retry: false,
    })
  }


  const {
    data: teacherTeachingAttendanceHistoryData,
  } = useGetTeacherTeachingAttendanceHistory()

  return (
    <div
      className={clsx(
        'h-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Attendance History
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <CloseModalIcon />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Class Information */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500">Class</div>
          <div className="text-base text-gray-900">{record?.class || '-'}</div>
        </div>

        {/* Lesson Information */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500">Lesson</div>
          <div className="text-base text-gray-900">{record?.lesson || '-'}</div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500">Date</div>
          <div className="text-base text-gray-900">{formatDateToSlash(record?.start_date as string, true) || '-'}</div>
        </div>

        {/* Check In */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500">Check In</div>
          <div className="text-base text-gray-900">
            {record?.checkin_time || '-'}
          </div>
        </div>

        {/* Check Out */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500">Check Out</div>
          <div className="text-base text-gray-900">
            {record?.checkout_time || '-'}
          </div>
        </div>

        {/* Actual Workload (only for Teaching Attendance) */}
        {record?.workload && (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-500">
              Actual Workload
            </div>
            <div className="text-base text-gray-900">
              {record.workload}
            </div>
          </div>
        )}

        {/* Device */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-500">Device</div>
          <div className="text-base text-gray-900">{record?.device || '-'}</div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceHistory
