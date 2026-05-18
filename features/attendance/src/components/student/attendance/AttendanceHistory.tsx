'use client'
import React from 'react'
import clsx from 'clsx'
import { IStudentAttendanceItem } from '@lms/core'
import { useFeature } from '@lms/contexts'
import { useTailwindBreakpoint } from '@lms/hooks'
import { SappDrawerV3 } from '@lms/ui'
import { useQuery } from 'react-query'
import { CalendarIconOutline, ClockInClassIcon, CloseModalIcon, DeviceIcon } from '@lms/assets'
import { formatDateToSlash } from '@lms/utils'

interface AttendanceHistoryProps {
  isOpen: boolean
  onClose: () => void
  record: IStudentAttendanceItem | null
}

interface AttendanceHistoryContentProps {
  record: IStudentAttendanceItem | null
  checkinTime?: string
  checkoutTime?: string
  device?: string
}

const AttendanceHistoryContent: React.FC<AttendanceHistoryContentProps> = ({
  record,
  checkinTime,
  checkoutTime,
  device,
}) => (
    <div className="flex flex-col gap-4 xl:gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-base">
          <CalendarIconOutline className="h-5 w-5 text-gray-400" />
          <span className="text-gray-500">Date:</span>
        </div>
        <div className="text-base text-gray-900">
          {formatDateToSlash(record?.lesson_date.start_date as string, true)}
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-sm ">
          <ClockInClassIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-500">Check in - Check out:</span>
        </div>
        <div className="text-sm text-gray-900">
          {checkinTime} - {checkoutTime}
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-sm">
          <DeviceIcon />
          <span className="text-gray-500">Device:</span>
        </div>
        <div className="text-sm text-gray-900">{device || '-'}</div>
      </div>
    </div>
)

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { classApi } = useFeature()
  const { isTabletView, isMobileView } = useTailwindBreakpoint()
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

  if (isTabletView || isMobileView) {
    return (
      <SappDrawerV3
        open={isOpen}
        handleCancel={onClose}
        title="Attendance History"
        closable
        isShowBtnClose
        placement="bottom"
        height="auto"
        rootClassName={clsx('profile-subject-drawer')}
        classNameBody='p-4 md:!p-0'
        titleClassName='text-lg'
      >
        <div className="mb-4 flex flex-col gap-4">
          <p className="text-base text-gray-600">
            This Attendance History for Lesson: <span className='font-semibold'>{record?.lesson}</span>
          </p>
        </div>
        <AttendanceHistoryContent
          record={record}
          checkinTime={classAttendanceHistoryData?.checkin_time}
          checkoutTime={classAttendanceHistoryData?.checkout_time}
          device={classAttendanceHistoryData?.device as string}
        />
      </SappDrawerV3>
    )
  }

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
          <p className="text-base text-gray-600">
            This Attendance History for Lesson <span className='font-semibold'>{record?.lesson}</span>
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
        <AttendanceHistoryContent
          record={record}
          checkinTime={classAttendanceHistoryData?.checkin_time}
          checkoutTime={classAttendanceHistoryData?.checkout_time}
          device={classAttendanceHistoryData?.device as string}
        />
      </div>
    </div>
  )
}

export default AttendanceHistory
