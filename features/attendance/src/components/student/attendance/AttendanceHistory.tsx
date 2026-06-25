'use client'
import { CalendarIconOutline, ClockInClassIcon, CloseModalIcon, DeviceIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { DATE_FORMAT, IClassAttendanceHistoryResponse, IStudentAttendanceItem } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { SappDivider, SappDrawerV3 } from '@lms/ui'
import { buildLocalLessonDateTime, formatDateFromUTC } from '@lms/utils'
import clsx from 'clsx'
import React from 'react'
import { useQuery } from 'react-query'

interface AttendanceHistoryProps {
  isOpen: boolean
  onClose: () => void
  record: IStudentAttendanceItem | null
  classId: string
}

interface AttendanceHistoryContentProps {
  record: IStudentAttendanceItem | null
  listCheckIn?: IClassAttendanceHistoryResponse[]
  isCompactHeight?: boolean
  isPanelScroll?: boolean
}

const AttendanceHistoryContent: React.FC<AttendanceHistoryContentProps> = ({
  record,
  listCheckIn,
  isCompactHeight = false,
  isPanelScroll = false,
}) => {

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
      className={clsx(
        'flex flex-col gap-4 xl:gap-6',
        isPanelScroll && 'min-h-0 flex-1',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-base">
          <CalendarIconOutline className="h-5 w-5 text-gray-400" />
          <span className="text-gray-500">Date:</span>
        </div>
        <div className="text-base text-gray-900">
          {`${localStartDate?.isValid() ? localStartDate.format('DD/MM/YYYY') : '-'} ${localStartDate?.isValid() ? localStartDate.format('HH:mm') : '-'} : ${localEndDate?.isValid() ? localEndDate.format('HH:mm') : '-'}`}
        </div>
      </div>
      <div
        className={clsx(
          'flex flex-col gap-4 xl:gap-6',
          isCompactHeight && 'h-[300px] overflow-y-auto',
          isPanelScroll && 'min-h-0 flex-1 overflow-y-auto pr-2',
        )}
      >
        {listCheckIn?.map((item, index) => (
          <div className='flex flex-col gap-4 xl:gap-6' key={index}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm ">
                <ClockInClassIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">Check in - Check out:</span>
              </div>
              <div className="text-sm text-gray-900">
                {item?.checkin_time ? formatDateFromUTC(item?.checkin_time, DATE_FORMAT.DATE_TIME_DATE_FIRST) : '-'} - {item?.checkout_time ? formatDateFromUTC(item?.checkout_time, DATE_FORMAT.DATE_TIME_DATE_FIRST) : '-'}
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm">
                <DeviceIcon />
                <span className="text-gray-500">Device:</span>
              </div>
              <div className="text-sm text-gray-900">{item?.device || '-'}</div>
            </div>
            {index < listCheckIn.length - 1 && <SappDivider className='!my-0' />}
          </div>
        ))}
      </div>
    </div>
  )
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  isOpen,
  onClose,
  record,
  classId
}) => {
  const { classApi } = useFeature()
  const { isTabletView, isMobileView } = useTailwindBreakpoint()
  const useGetClassAttendanceHistory = () => {
    const fetchData = async () => {
      const { data } = await classApi.getClassAttendanceHistory(classId, record?.id as string)
      return data
    }


    return useQuery(["class-attendance-history", record?.id, classId], fetchData, {
      enabled: record?.id !== undefined && isOpen,
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
            This Attendance History for Lesson: <span className='font-semibold'>{record?.name}</span>
          </p>
        </div>
     
          <AttendanceHistoryContent
            record={record}
            listCheckIn={classAttendanceHistoryData?.classScheduleUserAttendance || []}
            isCompactHeight
          />
      </SappDrawerV3>
    )
  }

  return (
    <div
      className={clsx(
        'flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white p-8 shadow-small transition-opacity duration-300',
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
            This Attendance History for Lesson <span className='font-semibold'>{record?.name}</span>
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
      <div className="flex min-h-0 flex-1 flex-col gap-10">
          <AttendanceHistoryContent
            record={record}
            listCheckIn={classAttendanceHistoryData?.classScheduleUserAttendance || []}
            isPanelScroll
          />
      </div>
    </div>
  )
}

export default AttendanceHistory
