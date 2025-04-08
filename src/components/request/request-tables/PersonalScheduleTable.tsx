import SAPPBadge from '@components/base/Badge/SAPPBadge'
import { formatDate, formatTime } from '@utils/common'
import { Table, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useMemo } from 'react'
import {
  DATE_TIME_FORMAT,
  REQUEST_STATUS,
  REQUEST_TYPE,
  requestStatusToBadge,
  requestTypeToTitle,
} from 'src/constants'
import { IUser } from 'src/redux/types/User/urser'
import {
  IRequest,
  isTeacherSchedule,
  isTeacherWeeklyNorm,
  ITeacherSchedule,
  ITeacherWeeklyNorm,
  TableColumn,
} from 'src/type'
import RequestActionCell from '../RequestActionCell'

interface PersonalScheduleTableProps {
  loading: boolean
  requests: IRequest[]
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setIsInspect: Dispatch<SetStateAction<boolean>>
}

const columnsTitles: TableColumn<IRequest>[] = [
  {
    title: '#',
    dataIndex: 'index',
  },
  {
    title: 'Request name',
    dataIndex: 'name',
  },
  {
    title: 'Request type',
    dataIndex: 'type',
    render: (value: REQUEST_TYPE) => requestTypeToTitle[value],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value: REQUEST_STATUS) => (
      <SAPPBadge
        key={value}
        label={requestStatusToBadge[value].label}
        type={requestStatusToBadge[value].type}
      />
    ),
  },
  {
    title: 'Time',
    dataIndex: 'time',
    render: (data: ITeacherSchedule[] | ITeacherWeeklyNorm[]) => {
      return (
        <ul className="flex flex-col gap-1">
          {data?.map((item, index) => {
            if (isTeacherSchedule(item)) {
              const startDate = dayjs(
                item.schedule.start_date + 'T' + item.schedule.start_time + 'Z',
              )
              const endDate = dayjs(
                item.schedule.end_date + 'T' + item.schedule.end_time + 'Z',
              )
              return (
                <li key={index}>
                  {startDate.isSame(endDate, 'day')
                    ? `${formatDate(startDate)} ${formatTime(startDate)} - ${formatTime(endDate)}`
                    : `${formatDate(startDate)} ${formatTime(startDate)} - ${formatDate(endDate)} ${formatTime(endDate)}`}
                </li>
              )
            }

            if (isTeacherWeeklyNorm(item)) {
              return (
                <li key={index}>
                  {formatDate(item.start_date) +
                    ' - ' +
                    formatDate(item.end_date)}
                </li>
              )
            }
          })}
        </ul>
      )
    },
  },
  {
    title: 'Reason',
    dataIndex: 'teacher_schedules',
    render: (teacherSchedules: ITeacherSchedule[]) => (
      <ul className="flex flex-col gap-1">
        {teacherSchedules.map(({ schedule: { description } }, index) =>
          description ? (
            <li key={index}>{description}</li>
          ) : (
            <li key={index} className="text-accent-default">
              _ _ _ _ _ _ _ _ _ _ _
            </li>
          ),
        )}
      </ul>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'teacher_weekly_norms',
    render: (teacher_weekly_norms: ITeacherWeeklyNorm[]) => (
      <ul className="flex flex-col gap-1 text-center">
        {teacher_weekly_norms.map(({ max_shift }, index) =>
          max_shift ? (
            <li key={index}>{max_shift}</li>
          ) : (
            <li key={index} className="text-accent-default">
              _ _ _ _ _ _
            </li>
          ),
        )}
      </ul>
    ),
  },
  {
    title: 'Approver',
    dataIndex: 'staff_assignee',
    render: (value: Partial<IUser>) => (
      <div className="text-secondary">{value?.detail?.full_name}</div>
    ),
  },
  {
    title: 'Creator',
    dataIndex: 'creator',
    render: (value: Partial<IUser>) => (
      <div className="text-secondary">{value?.detail?.full_name}</div>
    ),
  },
  {
    title: 'Create date',
    dataIndex: 'created_at',
    render: (value: string) => (
      <div className="text-secondary">
        {formatDate(value, DATE_TIME_FORMAT)}
      </div>
    ),
  },
  {
    title: 'Note',
    dataIndex: 'description',
    render: (value: string) => <div className="text-secondary">{value}</div>,
  },
  {
    title: '',
    dataIndex: 'method',
    render: (item: IRequest) => {
      return <RequestActionCell item={item} />
    },
    fixed: 'right',
  },
]

const PersonalScheduleTable = ({
  loading,
  requests,
  pagination,
  setPagination,
  setIsEdit,
  setIsInspect,
}: PersonalScheduleTableProps) => {
  const { current, pageSize } = pagination
  const tableColumns = columnsTitles.map((item, index) => {
    return {
      ...item,
      key: index,
    }
  })

  const tableData = useMemo(() => {
    return requests.map((item, index) => ({
      ...item,
      index: ((current || 1) - 1) * (pageSize || 10) + index + 1,
      creator: item.staff_request || item.user_request,
      time: item.teacher_schedules?.length
        ? item.teacher_schedules
        : item.teacher_weekly_norms?.length
          ? item.teacher_weekly_norms
          : [],
      method: item,
    }))
  }, [requests, current, pageSize])

  return (
    <Table
      loading={loading}
      rowKey={(record) => record.id}
      columns={tableColumns}
      dataSource={tableData}
      scroll={{ x: 'max-content' }}
      pagination={pagination}
      onChange={setPagination}
    />
  )
}

export default PersonalScheduleTable
