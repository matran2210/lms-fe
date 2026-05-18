'use client'
import { useFeature } from '@lms/contexts'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, IStudentAttendanceItem, IStudentAttendanceListParams } from '@lms/core'
import {
  NameNoActionCell,
  SAPPBadge,
  SappTable,
  TableActionCell
} from '@lms/ui'
import { ColumnsType } from 'antd/es/table'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { formatDateFromUTC } from '../../../../../../libs/utils'
import FilterAttendanceTable from './FilterAttendanceTable'

interface StudentAttendanceTableProps {
  onOpenHistory?: (record: IStudentAttendanceItem) => void
  classId: string
}

// Status badge mapping
const statusToBadge = {
  ATTENDED: {
    label: 'Attended',
    type: 'success' as const,
  },
  ABSENT: {
    label: 'Absent',
    type: 'error' as const,
  },
}

const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
  onOpenHistory,
  classId
}) => {
  const { classApi } = useFeature()
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
      render: (record) => <NameNoActionCell dataColumn={formatDateFromUTC(record.lesson_date.start_date)} />,
      width: 120,
    },
    {
      title: 'Check In',
      render: (record) => <NameNoActionCell dataColumn={record.checkin_time} />,
      width: 120,
    },
    {
      title: 'Check Out',
      render: (record) => <NameNoActionCell dataColumn={record.checkout_time} />,
      width: 120,
    },
    {
      title: 'Status',
      render: (record) => (
        <SAPPBadge
          label={statusToBadge[record.status as keyof typeof statusToBadge].label}
          type={statusToBadge[record.status as keyof typeof statusToBadge].type}
        />
      ),
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
    <div className="w-full rounded-xl bg-white p-6">
      {/* Filters Section */}
      <FilterAttendanceTable queryParams={queryParams} setQueryParams={setQueryParams} classId={classId} />
      {/* Table Section */}
      <SappTable
        isShowIndex
        columns={columns}
        data={studentAttendanceData?.attendances || []}
        loading={isLoading}
        pagination={{
          current: queryParams.page_index,
          pageSize: queryParams.page_size,
          total: studentAttendanceData?.metadata.total_records || 0,
        }}
        handleChangeParams={(currentPage, pageSize) => {
          setQueryParams((prev) => ({
            ...prev,
            page_index: currentPage,
            page_size: pageSize,
          }))
        }}
      />
    </div>
  )
}

export default StudentAttendanceTable
