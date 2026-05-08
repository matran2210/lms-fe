'use client'
import React, { useState, useMemo } from 'react'
import {
  SappTable,
  NameNoActionCell,
  FilterGrid,
  SAPPInput,
  SAPPSelect,
  SAPPRangePicker,
  SAPPButtonCustom,
  EChart,
  TableActionCell,
} from '@lms/ui'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useForm } from 'react-hook-form'
import { EChartsOption } from 'echarts'
import { AttendanceHistoryRecord } from './AttendanceHistory'
import { ChartPieIcon, HugeClockIcon, UserCheckIcon, UserCloseIcon, UsersGroupIcon, WidgetIcon } from '@lms/assets'
import { Divider } from 'antd'

interface AttendanceRecord {
  id: number
  class: string
  lesson: string
  date: string
  checkIn: string
  checkOut: string
  actualWorkload: string
}

interface FilterForm {
  class?: string
  lesson?: string
  rangeDate?: any[]
  status?: any
}

interface TeachingAttendanceProps {
  onOpenHistory?: (record: AttendanceHistoryRecord) => void
}

const TeachingAttendance: React.FC<TeachingAttendanceProps> = ({
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
  const mockData: AttendanceRecord[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    class: 'Certificate in International Financial Reporting (CertIFR)',
    lesson: 'CFA1_Sec5.1: Financial Reporting & Analysis',
    date: '24/03/2026',
    checkIn: '17:55',
    checkOut: '21:10',
    actualWorkload: '3.0000',
  }))

  const handleOpenHistory = (record: AttendanceRecord) => {
    if (onOpenHistory) {
      onOpenHistory({
        ...record,
        device: 'Desktop - Chrome Browser',
      })
    }
  }

  // Pie chart data
  const totalLessons = 40
  const attended = 20
  const actualWorkload = 3

  const pieChartOption = useMemo(
    () => ({
      title: {
        text: `${totalLessons}`,
        left: 'center',
        top: '42%',
        textStyle: {
          fontSize: 36,
          fontWeight: '700',
          color: '#1F2937',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Attendance',
          type: 'pie',
          radius: ['40%', '85%'],
          avoidLabelOverlap: false,
          labelLine: { show: false },
          label: { show: false },
          emphasis: {
            label: {
              show: false,
            },
          },
          data: [
            {
              value: attended,
              name: 'Attended',
              itemStyle: { color: '#10B981' },
            },
            {
              value: actualWorkload,
              name: 'Actual Workload',
              itemStyle: { color: '#F59E0B' },
            },
            {
              value: totalLessons - attended - actualWorkload,
              name: 'Remaining',
              itemStyle: { color: '#E5E7EB' },
            },
          ],
        },
      ],
    }),
    [totalLessons, attended, actualWorkload],
  )

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

  const columns: ColumnsType<AttendanceRecord> = [
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
      title: 'Act. Workload',
      render: (record) => (
        <NameNoActionCell dataColumn={record.actualWorkload} />
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
      {/* Overview Section */}

      <div className="flex justify-start items-center gap-6">
        <div className="flex-1 h-80 p-6 rounded-2xl shadow-small inline-flex flex-col justify-between items-center">
          <div className="self-stretch inline-flex justify-center items-center gap-4">
            <div className="p-1.5 bg-info rounded-md flex justify-start items-center gap-2.5">
              <WidgetIcon />
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
              <div className="self-stretch justify-center text-gray-800 text-lg font-semibold font-['Roboto'] leading-7">Overview</div>
            </div>
          </div>
          <div className="w-56 h-36 relative">
            <EChart
              option={pieChartOption as EChartsOption}
              minHeight='144px'
            />
          </div>
          <div className="inline-flex justify-center items-center flex-wrap">
            <div className="p-1 flex justify-start items-center gap-1 overflow-hidden">
              <div className="w-4 h-4 relative">
                <div className="w-px h-px left-[8px] top-[8px] absolute">
                  <div className="w-2 h-2 left-[-4px] top-[-4px] absolute bg-orange-400 rounded-full border border-UniversalPalette-border-white" />
                </div>
              </div>
              <div className="justify-start text-gray-800 text-sm">Total Lessons</div>
            </div>
            <div className="p-1 flex justify-start items-center gap-1 overflow-hidden">
              <div className="w-4 h-4 relative">
                <div className="w-px h-px left-[8px] top-[8px] absolute">
                  <div className="w-2 h-2 left-[-4px] top-[-4px] absolute bg-emerald-300 rounded-full border border-UniversalPalette-border-white" />
                </div>
              </div>
              <div className="justify-start text-gray-800 text-sm ">Attended</div>
            </div>
            <div className="p-1 flex justify-start items-center gap-1 overflow-hidden">
              <div className="w-4 h-4 relative">
                <div className="w-px h-px left-[8px] top-[8px] absolute">
                  <div className="w-2 h-2 left-[-4px] top-[-4px] absolute bg-rose-400 rounded-full border border-UniversalPalette-border-white" />
                </div>
              </div>
              <div className="justify-start text-gray-800 text-sm ">Actual Workload</div>
            </div>
          </div>
        </div>

        <div className="w-[918px] self-stretch inline-flex flex-col justify-start items-start gap-6">
          <div className="self-stretch flex-1 inline-flex justify-start items-center gap-6">
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-yellow rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative">
                    <UsersGroupIcon />
                  </div>
                </div>
                <div className="w-36 justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Total Lessons</div>
              </div>
              <div className="self-stretch text-center justify-center"><span className="text-dashboard-yellow text-3xl font-semibold font-['Roboto'] leading-[48px]">40</span><span className="text-orange-400 text-xl font-semibold font-['Roboto'] leading-7"> </span><span className="text-orange-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-lightGreen rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <UserCheckIcon />
                  </div>
                </div>
                <div className="w-48 self-stretch justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Attended</div>
              </div>
              <div className="self-stretch flex-1 pl-12 flex flex-col justify-between items-start">
                <div className="justify-center"><span className="text-dashboard-lightGreen text-2xl font-semibold font-['Roboto'] leading-9">20/40 </span><span className="text-emerald-300 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
                <div className="self-stretch h-2.5 relative rounded-[100px] overflow-hidden">
                  <div className="w-48 h-2.5 left-0 top-[0.50px] absolute bg-gray-200 rounded-[100px] inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="w-24 flex-1 bg-emerald-300 rounded-[100px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small flex justify-center items-start gap-4">
              <div className="p-1.5 bg-dashboard-lightRed rounded-md flex justify-start items-center gap-2.5">
                <div className="w-6 h-6 relative overflow-hidden">
                  <UserCloseIcon />
                </div>
              </div>
              <div className="flex-1 self-stretch inline-flex flex-col justify-between items-start">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-center text-gray-800 text-lg font-semibold font-['Roboto'] leading-7">Actual Workload</div>
                </div>
                <div className="self-stretch h-14 flex flex-col justify-between items-start">
                  <div className="justify-center"><span className="text-dashboard-lightRed text-2xl font-semibold font-['Roboto'] leading-9">3/40 </span><span className="text-rose-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
                  <div className="self-stretch h-2.5 relative rounded-[100px] overflow-hidden">
                    <div className="w-48 h-2.5 left-0 top-[0.50px] absolute bg-gray-200 rounded-[100px] inline-flex flex-col justify-start items-start gap-2.5">
                      <div className="w-8 flex-1 bg-rose-400 rounded-[100px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 inline-flex justify-start items-center gap-6">
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="p-1.5 bg-cyan-400 rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <ChartPieIcon />
                  </div>
                </div>
                <div className="justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Standard Workload</div>
              </div>
              <div className="self-stretch pl-12 inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-center"><span className="text-cyan-400 text-3xl font-semibold font-['Roboto'] leading-[48px]">40</span><span className="text-cyan-400 text-xl font-semibold font-['Roboto'] leading-7"> </span><span className="text-cyan-400 text-sm font-medium font-['Roboto'] leading-5">Class Sessions</span></div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small inline-flex flex-col justify-start items-center gap-4">
              <div className="self-stretch inline-flex justify-start items-center gap-4">
                <div className="w-9 h-9 p-1.5 bg-dashboard-blue rounded-md flex justify-center items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <HugeClockIcon />
                  </div>
                </div>
                <div className="justify-center text-gray-700 text-lg font-semibold font-['Roboto'] leading-7">Workload Ratio</div>
              </div>
              <div className="self-stretch pl-12 inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-center text-dashboard-blue text-3xl font-semibold font-['Roboto'] leading-[48px]">26.6600/40</div>
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

export default TeachingAttendance
