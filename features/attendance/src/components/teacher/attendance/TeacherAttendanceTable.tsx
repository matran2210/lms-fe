'use client'
import { ArrowDownIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { DATE_FORMAT, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, IStudentAttendanceItem, IStudentAttendanceListParams } from '@lms/core'
import {
  NameNoActionCell,
  SAPPBadge,
  SAPPButtonCustom,
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
import { convertUTCToLocal, formatDateFromUTC } from '@lms/utils'
import useInfiniteStudentLesson from '../../../hooks/useInfiniteStudentLesson'

interface FilterForm {
  lesson_ids?: string[]
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
  const { control, getValues, reset } = useForm<FilterForm>()

  const handleResetFilter = () => {
    reset()
    setQueryParams({
      page_index: DEFAULT_PAGE_NUMBER,
      page_size: DEFAULT_PAGE_SIZE,
    })
  }
  const handleFilter = () => {
    const rangeDate = getValues('rangeDate')
    setQueryParams((prev) => ({
      ...prev,
      lesson_ids: getValues('lesson_ids')?.filter((id) => id !== '') || undefined,
      status: getValues('status') || undefined,
      fromDate: rangeDate?.[0].toISOString() || undefined,
      toDate: rangeDate?.[1].toISOString() || undefined,
    }))
  }
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


    return useQuery(["teacher-learning-attendance", queryParams], fetchData, {
      enabled: classId !== undefined,
      retry: false,
    })
  }


  const {
    data: studentAttendanceData,
    isLoading,
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
      width: 150,
      render: (record) => {
        const localStartDate = record.lesson_date.start_date && record.start_time
          ? dayjs(convertUTCToLocal(`${record.lesson_date.start_date}T${record.start_time}`))
          : null
        const localEndDate = record.lesson_date.start_date && record.end_time
          ? dayjs(convertUTCToLocal(`${record.lesson_date.start_date}T${record.end_time}`))
          : null

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
      render: (record) => (
        <SAPPBadge
          label={statusToBadge[record.status as keyof typeof statusToBadge].label}
          type={statusToBadge[record.status as keyof typeof statusToBadge].type}
        />
      ),
      width: 120,
    },
    {
      title: '',
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
      width: 50,
    },
  ]

  return (
    <div className="w-full">
      {/* Filters Section */}
      <div className="mb-6 flex flex-col gap-4 flex-wrap">
        <div className="flex justify-between gap-6">
          <SappSelectMultiple
            name="lesson_ids"
            control={control}
            classNameWrapper="flex-1 w-full"
            className="font-medium"
            heightCustom="h-10"
            size="middle"
            placeholder="Lesson"
            options={[
              // { label: 'All', value: '' },
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
            suffixIcon={<ArrowDownIcon className="text-gray-300" />}
          />
          <SAPPSelect
            className="flex-1 w-full"
            name="status"
            control={control}
            size="middle"
            placeholder="Status"
            options={[
              // { label: 'All', value: '' },
              { label: 'Attended', value: 'PRESENT' },
              { label: 'Absent', value: 'ABSENT' },
            ]}
            suffixIcon={<ArrowDownIcon className="text-gray-300" />}
          />
          <SAPPRangePicker name="rangeDate" control={control} size="small" onChange={handleDateChange} className="flex-1 w-full" />
        </div>
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
