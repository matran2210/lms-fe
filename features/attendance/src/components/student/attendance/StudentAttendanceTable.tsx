'use client'
import {
  NameNoActionCell,
  SAPPBadge,
  SAPPRangePicker,
  SAPPSelect,
  SappTable,
  TableActionCell
} from '@lms/ui'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export interface AttendanceRecord {
  id: string
  lessonTitle: string
  eventName: string
  className: string
  date: string
  checkIn: string
  checkOut: string
  device: string
  status: 'Attended' | 'Absent'
}

interface FilterForm {
  lesson?: string
  rangeDate?: any[]
  status?: string
}

interface StudentAttendanceTableProps {
  onOpenHistory?: (record: AttendanceRecord) => void
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

const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
  onOpenHistory,
}) => {
  const initialPagination: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: 24,
  }

  const [pagination, setPagination] = useState<TablePaginationConfig>(
    initialPagination,
  )
  const [isLoading, setIsLoading] = useState(false)
  const buildMockData = (pageSize = initialPagination.pageSize ?? 10) =>
    Array.from({ length: pageSize }, (_, i) => ({
      id: (i + 1).toString(),
      lessonTitle: 'CFA1_Sec5.1: Financial Reporting & Analysis',
      eventName: 'CFA Level 1 - June 2026',
      className: 'CFA1_T3_HCM_Weekday_Morning',
      date: '24/03/2026',
      checkIn: '17:55',
      checkOut: '21:10',
      device: 'Mobile',
      status: i % 5 === 0 ? 'Absent' : 'Attended' as 'Attended' | 'Absent',
    }))

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(
    () => buildMockData(),
  )
  const { control, reset } = useForm<FilterForm>()

  // Mock data - replace with actual API call
  const refetchAttendanceData = (page = 1) => {
    const pageSize = pagination.pageSize ?? initialPagination.pageSize ?? 10

    setIsLoading(true)
    setPagination((currentPagination) => ({
      ...currentPagination,
      current: page,
      pageSize,
      total: initialPagination.total,
    }))
    setAttendanceData(buildMockData(pageSize))
    setIsLoading(false)
  }

  const handleResetFilter = () => {
    reset({
      lesson: undefined,
      rangeDate: undefined,
      status: undefined,
    })
    refetchAttendanceData()
  }

  const handleOpenHistory = (record: AttendanceRecord) => {
    if (onOpenHistory) {
      onOpenHistory(record)
    }
  }

  const columns: ColumnsType<AttendanceRecord> = [

    {
      title: 'Lesson',
      render: (record) => (
          <NameNoActionCell dataColumn={record.lessonTitle} />
      ),
      width: 200,
    },
    {
      title: 'Date',
      render: (record) => <NameNoActionCell dataColumn={record.date} />,
      width: 120,
    },
    {
      title: 'Check In',
      render: (record) => <NameNoActionCell dataColumn={record.checkIn} />,
      width: 100,
    },
    {
      title: 'Check Out',
      render: (record) => <NameNoActionCell dataColumn={record.checkOut} />,
      width: 100,
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
      fixed: 'right',
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
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-end">
          <div className="w-1/2 flex justify-end items-center gap-4">
          <button
            type="button"
            className="shrink-0 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            onClick={handleResetFilter}
          >
            Reset
          </button>
          <div className="shrink-0 text-right justify-center text-gray-800 text-sm">24 Results</div>
          <SAPPSelect
            name="lesson"
            control={control}
            size="middle"
            placeholder="Lesson"
            options={[
              { label: 'All', value: '' }
            ]}
          />
          <SAPPSelect
            name="status"
            control={control}
            size="middle"
            placeholder="Status"
            options={[
              { label: 'All', value: '' },
              { label: 'Attended', value: 'attended' },
              { label: 'Absent', value: 'absent' },
            ]}
          />
          <SAPPRangePicker name="rangeDate" control={control} size="small" className="!w-1/2 shrink-0" />
        </div>
        </div>
        
      </div>

      {/* Table Section */}
      <SappTable
        isShowIndex
        columns={columns}
        data={attendanceData}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
      />
    </div>
  )
}

export default StudentAttendanceTable
