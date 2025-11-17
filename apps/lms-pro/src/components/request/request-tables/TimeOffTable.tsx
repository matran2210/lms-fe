import SAPPBadge from '@components/base/Badge/SAPPBadge'
import { formatDate } from '@utils/common'
import { Table, TablePaginationConfig } from 'antd'
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
import { IUser } from 'src/redux/types/User/urser'
import { IRequest, ITeacherSchedule, TableColumn } from '@lms/core'
import RequestActionCell from '../RequestActionCell'

interface TimeOffTableProps {
  loading: boolean
  requests: IRequest[]
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  reloadPage: () => void
}

const TimeOffTable = ({
  loading,
  requests,
  pagination,
  setPagination,
  reloadPage,
}: TimeOffTableProps) => {
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
      render: (value: E_REQUEST_TYPE) => requestTypeToTitle[value],
    },
    {
      title: 'Class code',
      dataIndex: 'teacher_schedules',
      render: (teacherSchedules: ITeacherSchedule[]) => (
        <ul className="flex flex-col gap-1">
          {teacherSchedules.map(({ schedule }, index) => (
            <li key={index}>{schedule?.class_schedule?.class?.code ?? ''}</li>
          ))}
        </ul>
      ),
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
      title: 'Timeoff Schedule',
      dataIndex: 'teacher_schedules',
      render: (teacherSchedules: ITeacherSchedule[]) => (
        <ul className="flex flex-col gap-1">
          {teacherSchedules.map(({ schedule }, index) => (
            <li key={index}>
              {formatDate(
                schedule.start_date + 'T' + schedule.start_time + 'Z',
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'teacher_schedules',
      render: (teacherSchedules: ITeacherSchedule[]) => (
        <ul className="flex flex-col gap-1">
          {teacherSchedules.map(({ request_reason }, index) => (
            <li key={index}>{request_reason}</li>
          ))}
        </ul>
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
      title: 'Update date',
      dataIndex: 'updated_at',
      render: (value: string) => (
        <div className="text-txt-secondary">
          {formatDate(value, DATE_TIME_FORMAT)}
        </div>
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
      title: '',
      dataIndex: 'method',
      render: (item: IRequest) => {
        return <RequestActionCell item={item} reloadPage={reloadPage} />
      },
      fixed: 'right',
    },
  ]

  const tableColumns = columnsTitles.map((item, index) => {
    return {
      ...item,
      key: index,
    }
  })

  const tableData = useMemo(() => {
    return requests.map((item, index) => ({
      ...item,
      index: index + 1,
      creator: item.staff_request || item.user_request,
      method: item,
    }))
  }, [requests])

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

export default TimeOffTable
