'use client'
import { useFeature } from '@lms/contexts'
import { DATE_FORMAT, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, IStudentAttendanceItem, IStudentAttendanceListParams } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  NameNoActionCell,
  PaginationSapp,
  SAPPBadge,
  SappTable,
  TableActionCell
} from '@lms/ui'
import { buildLocalLessonDateTime, formatDateFromUTC } from '@lms/utils'
import { ColumnsType } from 'antd/es/table'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import FilterAttendanceTable from './FilterAttendanceTable'

interface StudentAttendanceTableProps {
  onOpenHistory?: (record: IStudentAttendanceItem) => void
  classId: string
}

// Status badge mapping
const statusToBadge = {
  PRESENT: {
    label: 'Attended',
    type: 'success' as const,
  },
  ABSENT: {
    label: 'Absent',
    type: 'error' as const,
  },
}

const getStatusConfig = (status: string) =>
  statusToBadge[status as keyof typeof statusToBadge] || {
    label: status || '-',
    type: 'default' as const,
  }

const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
  onOpenHistory,
  classId
}) => {
  const { classApi } = useFeature()
  const { isMobileView } = useTailwindBreakpoint()
  const [queryParams, setQueryParams] = useState<IStudentAttendanceListParams>(
    {
      page_index: DEFAULT_PAGE_NUMBER,
      page_size: DEFAULT_PAGE_SIZE,
    }
  )

  const handleOpenHistory = (record: IStudentAttendanceItem) => {
    if (onOpenHistory) {
      onOpenHistory(record)
    }
  }
  const useGetStudentAttendanceList = () => {
    const fetchData = async () => {
      const { data } = await classApi.getStudentAttendance(
        classId,
        queryParams,
      )
      return data
    }


    return useQuery(["student-attendance", queryParams], fetchData, {
      enabled: classId !== undefined,
      retry: false,
    })
  }


  const {
    data: studentAttendanceData,
    isLoading,
  } = useGetStudentAttendanceList()

  const attendances = studentAttendanceData?.attendances || []
  const totalRecords = studentAttendanceData?.metadata.total_records || 0


  const columns: ColumnsType<IStudentAttendanceItem> = [

    {
      title: 'Lesson',
      render: (record) => (
        <NameNoActionCell dataColumn={record.lesson} />
      ),
      width: 200,
    },
    {
      title: 'Date',
      width: 150,
      render: (record) => {
        const localStartDate = buildLocalLessonDateTime(
          record.lesson_date.start_date,
          record.lesson_date.start_time
        )
        const localEndDate = buildLocalLessonDateTime(
          record.lesson_date.end_date,
          record.lesson_date.end_time
        )

        return <NameNoActionCell dataColumn={`${localStartDate?.isValid() ? localStartDate.format('DD/MM/YYYY') : '-'} ${localStartDate?.isValid() ? localStartDate.format('HH:mm') : '-'} : ${localEndDate?.isValid() ? localEndDate.format('HH:mm') : '-'}`} />
      },
    },
    {
      title: 'Check In',
      render: (record) => <NameNoActionCell dataColumn={formatDateFromUTC(record.checkin_time, DATE_FORMAT.DATE_TIME_DATE_FIRST)} />,
      width: 130,
    },
    {
      title: 'Check Out',
      render: (record) => <NameNoActionCell dataColumn={formatDateFromUTC(record.checkout_time, DATE_FORMAT.DATE_TIME_DATE_FIRST)} />,
      width: 135,
    },
    {
      title: 'Status',
      render: (record) => {
        const statusConfig = getStatusConfig(record.status)

        return (
          <SAPPBadge
            label={statusConfig.label}
            type={statusConfig.type}
          />
        )
      },
      width: 120,
    },
    {
      title: 'Action',
      // fixed: 'right',
      render: (record) => (
        <TableActionCell>
          {(closeDropdown) => (
            <div
              className="cursor-pointer px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                handleOpenHistory(record)
                closeDropdown()
              }}
            >
              Attendance History
            </div>
          )}
        </TableActionCell>
      ),
      width: 80,
    },
  ]

  return (
    <div className="w-full rounded-xl bg-white p-4 md:p-6">
      {/* Filters Section */}
      <FilterAttendanceTable queryParams={queryParams} setQueryParams={setQueryParams} classId={classId} />
      {/* Table Section */}
      {isMobileView ? (
        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              Loading attendance...
            </div>
          ) : attendances.length ? (
            <>
              {attendances.map((record) => {
                const statusConfig = getStatusConfig(record.status)
                const localStartDate = buildLocalLessonDateTime(
                  record.lesson_date.start_date,
                  record.lesson_date.start_time
                )
                const localEndDate = buildLocalLessonDateTime(
                  record.lesson_date.end_date,
                  record.lesson_date.end_time
                )
                return (
                  <div
                    key={record.class_schedule_user_id}
                    className={clsx(
                      'rounded-xl bg-gray-50 p-4',
                      onOpenHistory && 'cursor-pointer'
                    )}
                    onClick={() => handleOpenHistory(record)}
                  >
                    <div className="space-y-4">
                      <div className="truncate text-base font-semibold leading-6 text-gray-800">
                        {record.lesson}
                      </div>
                      <div className="space-y-3 text-sm leading-[22px]">
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-gray-400">Date:</span>
                          <div className="flex min-w-0 flex-wrap items-center gap-2 text-gray-800">
                            <span>{localStartDate?.isValid() ? localStartDate.format('DD/MM/YYYY') : '-'}</span>
                            <span className="text-gray-300">|</span>
                            <span>{`${localStartDate?.isValid() ? localStartDate.format('HH:mm') : '-'} : ${localEndDate?.isValid() ? localEndDate.format('HH:mm') : '-'}`}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-gray-400">Check in:</span>
                          <span className="text-gray-800">{formatDateFromUTC(record.checkin_time, DATE_FORMAT.DATE_TIME_DATE_FIRST) || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-gray-400">Check out:</span>
                          <span className="text-gray-800">{formatDateFromUTC(record.checkout_time, DATE_FORMAT.DATE_TIME_DATE_FIRST) || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-gray-400">Status:</span>
                          <SAPPBadge
                            label={statusConfig.label}
                            type={statusConfig.type}
                            className="w-fit px-2 py-0.5 text-sm font-normal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <PaginationSapp
                currentPage={queryParams.page_index}
                pageSize={queryParams.page_size}
                totalItems={totalRecords}
                classname="mt-6 flex-col items-end gap-3 sm:flex-row sm:items-center"
                setCurrentPage={(page) => {
                  setQueryParams((prev) => ({
                    ...prev,
                    page_index: page,
                  }))
                }}
                setPageSize={(pageSize) => {
                  setQueryParams((prev) => ({
                    ...prev,
                    page_index: DEFAULT_PAGE_NUMBER,
                    page_size: pageSize,
                  }))
                }}
              />
            </>
          ) : (
            <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No attendance records found.
            </div>
          )}
        </div>
      ) : (
        <SappTable
          isShowIndex
          columns={columns}
          data={attendances}
          loading={isLoading}
          pagination={{
            current: queryParams.page_index,
            pageSize: queryParams.page_size,
            total: totalRecords,
          }}
          handleChangeParams={(currentPage, pageSize) => {
            setQueryParams((prev) => ({
              ...prev,
              page_index: currentPage,
              page_size: pageSize,
            }))
          }}
        />
      )}
    </div>
  )
}

export default StudentAttendanceTable
