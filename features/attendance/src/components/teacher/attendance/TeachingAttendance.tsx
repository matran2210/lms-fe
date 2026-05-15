'use client'
import { ArrowDownIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, ITeacherTeachingAttendanceItem, ITeacherTeachingAttendanceListParams } from '@lms/core'
import {
  NameNoActionCell,
  SAPPButtonCustom,
  SappSelectMultiple,
  SappTable,
  TableActionCell
} from '@lms/ui'
import { formatDateFromUTC } from '@lms/utils'
import { Divider, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import clsx from 'clsx'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import useInfiniteTeacherClass from '../../../hooks/useInfiniteTeacherClass'
import useInfiniteTeacherLesson from '../../../hooks/useInfiniteTeacherLesson'
import TeacherAttendanceStatistics from './TeacherAttendanceStatistics'

interface FilterForm {
  class_ids?: string[]
  lesson_ids?: string[]
  fromDate?: string
  toDate?: string
  workload_status?: string[]
}

interface TeachingAttendanceProps {
  onOpenHistory?: (record: ITeacherTeachingAttendanceItem) => void
}

const TeachingAttendance: React.FC<TeachingAttendanceProps> = ({
  onOpenHistory,
}) => {
   const { userApi } = useFeature()
    const [queryParams, setQueryParams] = useState<ITeacherTeachingAttendanceListParams>(
      {
        page_index: DEFAULT_PAGE_NUMBER,
        page_size: DEFAULT_PAGE_SIZE,
      }
    )
    const [monthSelectKey, setMonthSelectKey] = useState(1)
  const { control, getValues, setValue, reset, watch, setError, clearErrors, formState: { errors }} = useForm<FilterForm>({
    defaultValues: {
      fromDate: dayjs().startOf('month').toISOString(),
      toDate: dayjs().endOf('month').toISOString(),
    }
  })

  // Mock data - replace with actual API call
  const useGetTeacherTeachingAttendanceList = () => {
    const fetchData = async () => {
      const { data } = await userApi.getTeacherTeachingAttendance(
        queryParams
      )
      return data
    }


    return useQuery(["student-attendance", queryParams], fetchData, {
      retry: false,
    })
  }


  const {
    data: teacherTeachingAttendanceData,
    isLoading,
    refetch,
  } = useGetTeacherTeachingAttendanceList()


  const {
    data: teacherClassData,
    refetch: refetchTeacherClass,
    hasNextPage: hasNextPageTeacherClass,
    fetchNextPage: fetchNextPageTeacherClass,
    debounceSearch: debounceSearchTeacherClass,
  } = useInfiniteTeacherClass(true)

  const class_ids = watch('class_ids')

    const {
    data: teacherLessonData,
    refetch: refetchTeacherLesson,
    hasNextPage: hasNextPageTeacherLesson,
    fetchNextPage: fetchNextPageTeacherLesson,
    debounceSearch,
  } = useInfiniteTeacherLesson(!!class_ids?.length, { class_ids: class_ids })

  const handleOpenHistory = (record: ITeacherTeachingAttendanceItem) => {
    if (onOpenHistory) {
      onOpenHistory(record)
    }
  }

  const handleFilter = () => {
    setQueryParams((prev) => ({
      ...prev,
      class_ids: getValues('class_ids')?.filter((id) => id !== '') || undefined,
      lesson_ids: getValues('lesson_ids')?.filter((id) => id !== '') || undefined,
      workload_status: getValues('workload_status')?.filter((id) => id !== '') || undefined,
      from_date: getValues('fromDate') || undefined,
      to_date: getValues('toDate') || undefined,
    }))
  }

  const handleResetFilter = () => {
    reset()
    setMonthSelectKey((prev) => prev + 1) // Reset month select
    setQueryParams({
       page_index: DEFAULT_PAGE_NUMBER,
       page_size: DEFAULT_PAGE_SIZE,
     })
     refetch()
   
    // TODO: Reset and refetch data
  }

  const columns: ColumnsType<ITeacherTeachingAttendanceItem> = [
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
      render: (record) => <NameNoActionCell dataColumn={formatDateFromUTC(record.start_date)} />,
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
      title: 'Act. Workload',
      render: (record) => (
        <NameNoActionCell dataColumn={record.workload} />
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
      <div className="w-fit">
        {/* select month */}
        <Select
          key={monthSelectKey}
          className="min-w-24 mb-4 font-semibold text-xl"
          defaultValue={`${dayjs().month() + 1}`}
          options={Array(12).fill(null).map((_, index) => 
            ({ label: dayjs.utc().month(index).format('MMM'), value: `${index + 1}` }))}
           variant="borderless"
           suffixIcon={<ArrowDownIcon className="text-gray-300" />}
           labelRender={(option) => <span className='text-xl'>{option.label}</span>}
           onChange={(value) => {             const month = value === '' ? undefined : value
              setValue('fromDate', month ? dayjs().month(Number(month) - 1).startOf('month').toISOString() : undefined)
              setValue('toDate', month ? dayjs().month(Number(month) - 1).endOf('month').toISOString() : undefined)
           }}
            />
      </div>
      <TeacherAttendanceStatistics fromDate={watch('fromDate')} toDate={watch('toDate')} />
      {/* Divider */}
      <Divider className="my-8" />

      {/* Filters Section */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-between gap-6">
          <SappSelectMultiple
              name="class_ids"
              control={control}
               classNameWrapper="w-full"
              heightCustom="flex-1 w-full h-10"
              size="middle"
              placeholder="Class"
              options={(teacherClassData || []).map((item) => ({
                  label: item.class.class_name,
                  value: item.class.class_id,
                }))}
              onSearch={(text) => {
                debounceSearchTeacherClass(text)
              }}
              onMenuScrollToBottom={hasNextPageTeacherClass ? fetchNextPageTeacherClass : undefined}
              onDropdownVisibleChange={(open) => {
                if (open && !teacherClassData) {
                  refetchTeacherClass()
                  return
                }
              }}
              onChange={() => {
                setValue('lesson_ids', [])
                clearErrors('lesson_ids')
              }}
              suffixIcon={<ArrowDownIcon className="text-gray-300" />}
            />
          <SappSelectMultiple
              name="lesson_ids"
              control={control}
              classNameWrapper={'w-full'}
              className={clsx("flex-1 w-full font-medium", {
                  "select-error": errors.lesson_ids,
              })}
              heightCustom="h-10"
              size="middle"
              placeholder="Lesson"
              open={!getValues('class_ids')?.length ? false : undefined}
              onFocus={() => {
                if (!getValues('class_ids')?.length) {
                  setError('lesson_ids', { message: 'Please select class first' })
                  return
                }
              }   
              }
              options={(teacherLessonData || []).map((lesson) => ({
                  label: lesson.teacher_schedule?.schedule_name,
                  value: lesson.teacher_schedule?.schedule_id,
                }))}
              onSearch={(text) => {
                debounceSearch(text)
              }}
              onMenuScrollToBottom={hasNextPageTeacherLesson ? fetchNextPageTeacherLesson : undefined}
              onDropdownVisibleChange={(open) => {
                if (open && !teacherLessonData) {
                  refetchTeacherLesson()
                  return
                } 
              }}
              suffixIcon={<ArrowDownIcon className="text-gray-300" />}
            />
          <SappSelectMultiple
            name="workload_status"
            control={control}
            classNameWrapper="w-full"
            className="flex-1 w-full font-medium"
            placeholder="Status"
            size="middle"
            heightCustom="h-10"
            options={[
              // { label: 'All', value: '' },
              { label: 'Attended', value: 'PRESENT' },
              { label: 'Absent', value: 'ABSENT' },
            ]}
            suffixIcon={<ArrowDownIcon className="text-gray-300" />}
          />
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
        data={teacherTeachingAttendanceData?.attendances || []}
        loading={isLoading}
        pagination={{
          current: queryParams.page_index,
          pageSize: queryParams.page_size,
          total: teacherTeachingAttendanceData?.metadata.total_records || 0,
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

export default TeachingAttendance
