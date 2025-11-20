import { TablePaginationConfig } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'
import { calculateHoursDifference, formatDate} from '@lms/utils'
import {SappTable} from '@lms/ui'
import {
  IProgress,
  IProgressList,
  IProgressUser,
  LearningMode,
} from '@lms/core'
import { SAPPDropdown } from '@lms/ui'
import { TableColumn } from '@lms/core'
import { round } from 'lodash'
import { useSelector } from 'react-redux'
import { userReducer } from 'src/redux/slice/User/User'

interface ProgressTableProps {
  loading: boolean
  progress: IProgressList | undefined
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setIsInspect: Dispatch<SetStateAction<boolean>>
  setIsView: Dispatch<SetStateAction<boolean>>
  setIdProgress: Dispatch<SetStateAction<string | null>>
  handleChangeParams?: (currentPage: number, pageSize: number) => void
  allowSection?: boolean
  allowCreateProgress?: boolean
}

const ProgressTable = ({
  loading,
  progress,
  pagination,
  setPagination,
  handleChangeParams,
  setIsEdit,
  setIsInspect,
  setIdProgress,
  setIsView,
  allowSection,
  allowCreateProgress,
}: ProgressTableProps) => {
  const { user } = useSelector(userReducer)
  let columnsTitles: TableColumn<IProgress>[] = [
    {
      title: '#',
      dataIndex: 'index',
      render: (value: IProgress, record: IProgress, index: number) => {
        return (
          index +
          1 +
          (Number(progress?.metadata?.page_index) - 1) *
            Number(progress?.metadata?.page_size || 0)
        )
      },
    },
    {
      title: 'Lesson',
      dataIndex: 'lesson_name',
    },
    {
      title: 'Time',
      render: (value: Date, record: IProgress, index: number) => {
        return record.mode !== LearningMode.ONLINE
          ? record.start_time &&
              record.end_time &&
              calculateHoursDifference(record.start_time, record.end_time) +
                ' hour'
          : '--'
      },
    },
    {
      title: 'Section',
      dataIndex: 'section',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      render: (value: number, record: IProgress, index: number) => {
        return (
          <span
            style={{
              color: record?.progress * 100 >= 90 ? '#176CDD' : '#F01919',
            }}
          >
            {round((record?.progress ?? 0) * 100, 2)} %
          </span>
        )
      },
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      render: (teacher: IProgressUser, record: IProgress) => {
        return record.mode !== LearningMode.ONLINE ? teacher?.full_name : '--'
      },
    },
    {
      title: 'Creator',
      render: (_, record: IProgress) => {
        return record.mode !== LearningMode.ONLINE
          ? record?.staff_creator?.full_name || record?.user_creator?.full_name
          : '--'
      },
    },
    {
      title: 'Create date',
      dataIndex: 'created_at',
      render: (value: Date) => {
        return formatDate(value, 'DD/MM/YYYY | HH:mm')
      },
    },
    {
      title: 'Note',
      dataIndex: 'description',
    },
    {
      title: '',
      dataIndex: 'method',
      render: (value: string, record: IProgress) => {
        return (
          <SAPPDropdown>
            <div
              onClick={() => {
                setIsView(true)
                setIsEdit(true)
                setIdProgress(record.id)
              }}
            >
              View
            </div>
            {record.mode !== LearningMode.ONLINE &&
              record.teacher?.id === user?.id && (
                <div
                  onClick={() => {
                    setIsView(false)
                    setIsInspect(true)
                    setIdProgress(record.id)
                  }}
                >
                  Edit
                </div>
              )}
          </SAPPDropdown>
        )
      },
      fixed: 'right',
    },
  ]
  if (!allowSection) {
    columnsTitles = columnsTitles.filter((item) => item.dataIndex !== 'section')
  }
  return (
    <SappTable
      handleChangeParams={handleChangeParams}
      columns={columnsTitles}
      data={progress?.formattedClassTeachingProgresses || []}
      pagination={pagination}
      setPagination={setPagination}
      loading={loading}
    />
  )
}

export default ProgressTable
