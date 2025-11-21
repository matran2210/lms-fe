import { SAPPBadge } from '@lms/ui'
import { formatDate, formatTime } from '@lms/utils'
import { Table, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useMemo } from 'react'
import {
  DATE_TIME_FORMAT,
  E_REQUEST_STATUS,
  E_REQUEST_TYPE,
  REQUEST_STATUS,
  REQUEST_TYPE,
  requestStatusToBadge,
  requestTypeToTitle,
} from '@lms/core'
import { IUser } from '@lms/contexts'
import {
  IRequest,
  isTeacherSchedule,
  isTeacherWeeklyNorm,
  ITeacherSchedule,
  ITeacherWeeklyNorm,
  TableColumn,
} from '@lms/core'
import RequestActionCell from '../RequestActionCell'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRequestContext } from '@contexts/RequestContext'

interface PersonalScheduleTableProps {
  loading: boolean
  requests: IRequest[]
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setIsInspect: Dispatch<SetStateAction<boolean>>
  reloadPage: () => void
}

const PersonalScheduleTable = ({
  loading,
  requests,
  pagination,
  setPagination,
  reloadPage,
}: PersonalScheduleTableProps) => {
  const columnsTitles: TableColumn<IRequest>[] = [
    {
      title: '#',
      dataIndex: 'index',
    },
    {
      title: 'Request name',
      dataIndex: 'customName',
    },
    {
      title: 'Request type',
      dataIndex: 'type',
      render: (value: E_REQUEST_TYPE) => requestTypeToTitle[value],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: E_REQUEST_STATUS) => (
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
                  item.schedule.start_date +
                    'T' +
                    item.schedule.start_time +
                    'Z',
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
      dataIndex: 'reason',
      render: (data: ITeacherSchedule[]) =>
        data?.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {data.map(({ schedule: { description } }, index) => (
              <li
                key={index}
                className={clsx({ 'text-accent-default': !description })}
              >
                {description || '_ _ _ _ _ _ _ _ _ _ _'}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-accent-default">_ _ _ _ _ _ _ _ _ _ _</div>
        ),
    },
    {
      title: 'Quantity',
      dataIndex: 'teacher_weekly_norms',
      render: (teacher_weekly_norms: ITeacherWeeklyNorm[]) =>
        teacher_weekly_norms?.length > 0 ? (
          <ul className="flex flex-col gap-1 text-center">
            {teacher_weekly_norms.map(({ max_shift }, index) => (
              <li
                key={index}
                className={clsx({ 'text-accent-default': !max_shift })}
              >
                {max_shift || '_ _ _ _ _ _'}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-accent-default">_ _ _ _ _ _ _ _ _ _ _</div>
        ),
    },
    {
      title: 'Approver',
      dataIndex: 'staff_assignee',
      render: (value: Partial<IUser>) => (
        <div className="text-txt-secondary">{value?.detail?.full_name}</div>
      ),
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      render: (value: Partial<IUser>) => (
        <div className="text-txt-secondary">{value?.detail?.full_name}</div>
      ),
    },
    {
      title: 'Create date',
      dataIndex: 'created_at',
      render: (value: string) => (
        <div className="text-txt-secondary">
          {formatDate(value, DATE_TIME_FORMAT)}
        </div>
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      render: (value: string) => (
        <div className="text-txt-secondary">{value || '_ _ _ _ _ _'}</div>
      ),
    },
    {
      title: '',
      dataIndex: 'method',
      render: (item: IRequest) => {
        return <RequestActionCell item={item} reloadPage={reloadPage} />
      },
      fixed: 'right',
    },
  ]

  const { current, pageSize } = pagination
  const router = useRouter()
  const { setIsOpenViewModal } = useRequestContext()
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
      customName: (
        <Link href={`${router.pathname}?id=${item.id}`}>
          <div
            onClick={() => setIsOpenViewModal(true)}
            className="cursor-pointer"
          >
            {item.name}
          </div>
        </Link>
      ),
      time: item.teacher_schedules?.length
        ? item.teacher_schedules
        : item.teacher_weekly_norms?.length
          ? item.teacher_weekly_norms
          : [],
      reason:
        item.type === E_REQUEST_TYPE.TEACHER_SCHEDULE_BUSY
          ? item.teacher_schedules
          : [],
      note:
        item.type === E_REQUEST_TYPE.TEACHER_WEEKLY_NORMS
          ? item.description
          : '',
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
