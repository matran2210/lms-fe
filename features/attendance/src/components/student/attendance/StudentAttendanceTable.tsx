'use client'
import { ArrowDownIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, IStudentAttendanceItem, IStudentAttendanceListParams } from '@lms/core'
import {
  NameNoActionCell,
  SAPPBadge,
  SAPPRangePicker,
  SAPPSelect,
  SappSelectMultiple,
  SappTable,
  TableActionCell
} from '@lms/ui'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { formatDateFromUTC } from '../../../../../../libs/utils'
import useInfiniteStudentLesson from '../../../hooks/useInfiniteStudentLesson'

interface FilterForm {
  lesson?: string
  rangeDate?: any[]
  status?: string
}

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
  const { control } = useForm<FilterForm>()

  // const handleResetFilter = () => {
  //   reset({
  //     lesson: undefined,
  //     rangeDate: undefined,
  //     status: undefined,
  //   })
  //   setQueryParams({
  //     page_index: DEFAULT_PAGE_NUMBER,
  //     page_size: DEFAULT_PAGE_SIZE,
  //   })
  // }

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
    refetch,
  } = useGetStudentAttendanceList()

  const {
    data: studentLessonData,
    refetch: refetchStudentLesson,
    hasNextPage: hasNextPageStudentLesson,
    fetchNextPage: fetchNextPageStudentLesson,
    debounceSearch,
  } = useInfiniteStudentLesson(!!classId, { class_ids: [classId] })
  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setQueryParams((prev) => ({
      ...prev,
      start_date: dates?.[0]?.toISOString(),
      end_date: dates?.[1]?.toISOString(),
    }))
  }
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
      width: 100,
    },
    {
      title: 'Check Out',
      render: (record) => <NameNoActionCell dataColumn={record.checkout_time} />,
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
            {/* <button
            type="button"
            className="shrink-0 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            onClick={handleResetFilter}
          >
            Reset
          </button> */}
            <div className="shrink-0 text-right justify-center text-gray-800 text-sm">24 Results</div>
            <SappSelectMultiple
              name="lesson"
              control={control}
              className="min-w-32 font-medium"
              heightCustom="h-10"
              defaultValue={[]}
              size="middle"
              placeholder="Lesson"
              options={[
                { label: 'All', value: '' },
                ...((studentLessonData || []).map((lesson) => ({
                  label: lesson.class_schedule_user?.schedule_name,
                  value: lesson.class_schedule_user?.schedule_id,
                })))
              ]}
              onSearch={(text) => {
                debounceSearch(text)
              }}
              onMenuScrollToBottom={hasNextPageStudentLesson ? fetchNextPageStudentLesson : undefined}
              onDropdownVisibleChange={(open) => {
                if (open && !studentLessonData) {
                  refetchStudentLesson()
                  return
                }
              }}
              onChange={(value) => {
                const lessonIds = value.filter((v) => v !== '')
                setQueryParams((prev) => ({
                  ...prev,
                  lesson_ids: lessonIds, // lessonIds,
                }))
              }}
              suffixIcon={<ArrowDownIcon className="text-gray-300" />}
            />
            <SAPPSelect
              className="min-w-28"
              name="status"
              control={control}
              size="middle"
              placeholder="Status"
              options={[
                { label: 'All', value: '' },
                { label: 'Attended', value: 'PRESENT' },
                { label: 'Absent', value: 'ABSENT' },
              ]}
              onChange={(value) => {
                setQueryParams((prev) => ({
                  ...prev,
                  status: value === '' ? undefined : value,
                }))
              }}
            />
            <SAPPRangePicker name="rangeDate" control={control} size="small" onChange={handleDateChange} className="!w-1/2 shrink-0" />
          </div>
        </div>

      </div>

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
