'use client'
import React, { useState } from 'react'
import {
  SappTable,
  NameNoActionCell,
  FilterGrid,
  SAPPInput,
  SAPPSelect,
  SAPPRangePicker,
  SAPPButtonCustom,
  SAPPBadge,
  TableActionCell,
} from '@lms/ui'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useForm } from 'react-hook-form'
import { AttendanceHistoryRecord } from './AttendanceHistory'
import { ChartPieIcon, UserCheckIcon, UserCloseIcon, UsersGroupIcon } from '@lms/assets'
import { Divider } from 'antd'

interface LearningAttendanceRecord {
  id: number
  class: string
  lesson: string
  date: string
  checkIn: string
  checkOut: string
  status: 'Attended' | 'Absent'
}

interface FilterForm {
  class?: string
  lesson?: string
  rangeDate?: any[]
  status?: any
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

interface LearningAttendanceProps {
  onOpenHistory?: (record: AttendanceHistoryRecord) => void
}

const LearningAttendance: React.FC<LearningAttendanceProps> = ({
  onOpenHistory,
}) => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 40,
  })
  const [isLoading, setIsLoading] = useState(false)

  const { control, getValues, reset } = useForm<FilterForm>()

  // Mock data - replace with actual API call
  const mockData: LearningAttendanceRecord[] = Array.from(
    { length: 6 },
    (_, i) => ({
      id: i + 1,
      class: 'Certificate in International Financial Reporting (CertIFR)',
      lesson: 'CFA1_Sec5.1: Financial Reporting & Analysis',
      date: '24/03/2026',
      checkIn: '17:55',
      checkOut: '21:10',
      status: 'Attended' as const,
    }),
  )

  const handleOpenHistory = (record: LearningAttendanceRecord) => {
    if (onOpenHistory) {
      onOpenHistory({
        ...record,
        device: 'Desktop - Chrome Browser',
      })
    }
  }

  const handleFilter = () => {
    // TODO: Implement filter logic with API call
    console.log('Filter values:', {
      class: getValues('class'),
      lesson: getValues('lesson'),
      rangeDate: getValues('rangeDate'),
      status: getValues('status'),
    })
  }

  const handleResetFilter = () => {
    reset()
    // TODO: Reset and refetch data
  }

  const columns: ColumnsType<LearningAttendanceRecord> = [
    {
      title: 'No',
      render: (_, __, index) => (
        <NameNoActionCell
          dataColumn={(
            ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) +
            index +
            1
          ).toString()}
        />
      ),
      width: 60,
    },
    {
      title: 'Class',
      render: (record) => <NameNoActionCell dataColumn={record.class} />,
    },
    {
      title: 'Lesson',
      render: (record) => <NameNoActionCell dataColumn={record.lesson} />,
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
          label={statusToBadge[record.status].label}
          type={statusToBadge[record.status].type}
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
    <div className="w-full">
      {/* Stats Section */}
      <div className="w-full self-stretch inline-flex justify-start items-center gap-6">
        <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start gap-6">
          <div className="self-stretch h-36 inline-flex justify-start items-center gap-6">
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-yellow rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative">
                    <UsersGroupIcon />
                  </div>
                </div>
                <div className="w-36 justify-center text-gray-700 text-lg font-semibold">Total Lessons</div>
              </div>
              <div className="self-stretch pl-12 inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-center"><span className="text-dashboard-yellow text-3xl font-semibold font-['Roboto'] leading-[48px]">40 </span><span className="text-orange-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-lightGreen rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <UserCheckIcon />
                  </div>
                </div>
                <div className="w-48 self-stretch justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Attended</div>
              </div>
              <div className="self-stretch flex-1 pl-12 flex flex-col justify-between items-start">
                <div className="justify-center"><span className="text-dashboard-lightGreen text-2xl font-semibold font-['Roboto'] leading-9">30/40</span><span className="text-gray-400 text-2xl font-semibold font-['Roboto'] leading-9"> </span><span className="text-emerald-300 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
                <div className="self-stretch h-2.5 relative rounded-[100px] overflow-hidden">
                  <div className="w-48 h-2.5 left-0 top-[0.50px] absolute bg-gray-200 rounded-[100px] inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="w-36 flex-1 bg-dashboard-lightGreen rounded-[100px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-lightRed rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <UserCloseIcon />
                  </div>
                </div>
                <div className="flex-1 self-stretch justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Absent</div>
              </div>
              <div className="self-stretch flex-1 pl-12 flex flex-col justify-between items-start">
                <div className="justify-center"><span className="text-dashboard-lightRed text-2xl font-semibold font-['Roboto'] leading-9">3/40</span><span className="text-gray-400 text-2xl font-semibold font-['Roboto'] leading-9"> </span><span className="text-rose-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
                <div className="self-stretch h-2.5 relative rounded-[100px] overflow-hidden">
                  <div className="w-48 h-2.5 left-0 top-[0.50px] absolute bg-gray-200 rounded-[100px] inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="w-8 flex-1 bg-dashboard-lightRed rounded-[100px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="w-9 h-9 p-1.5 bg-dashboard-blue rounded-md flex justify-center items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <ChartPieIcon />
                  </div>
                </div>
                <div className="justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Attendance Rate</div>
              </div>
              <div className="self-stretch pl-12 inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-center text-dashboard-blue text-3xl font-semibold font-['Roboto'] leading-[48px]">87.5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Divider */}
      <Divider className="my-8" />

      {/* Filters Section */}
      <div className="mb-6 flex flex-col gap-4">
        <FilterGrid>
          <SAPPInput name="class" control={control} placeholder="Class" />
          <SAPPInput name="lesson" control={control} placeholder="Lesson" />
          <SAPPRangePicker name="rangeDate" control={control} />
          <SAPPSelect
            name="status"
            control={control}
            placeholder="Status"
            options={[
              { label: 'All', value: '' },
              { label: 'Attended', value: 'attended' },
              { label: 'Absent', value: 'absent' },
            ]}
          />
        </FilterGrid>
        <div className="flex gap-3">
          <SAPPButtonCustom
            title="Reset"
            color="secondary"
            onClick={handleResetFilter}
            disabled={isLoading}
          />
          <SAPPButtonCustom
            title="Search"
            onClick={handleFilter}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Table Section */}
      <SappTable
        columns={columns}
        data={mockData}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
      />
    </div>
  )
}

export default LearningAttendance
