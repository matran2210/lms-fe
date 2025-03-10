import SAPPBadge from '@components/base/Badge/SAPPBadge'
import { requestStatusToBadge, requestTypeToTitle } from '@utils/request'
import { Table, TablePaginationConfig } from 'antd'
import { useState } from 'react'
import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants'
import { IUserDetail } from 'src/redux/types/User/urser'
import { IRequest, TableColumn } from 'src/type'
import RequestActionCell from '../RequestActionCell'

const columnsTitles: TableColumn<IRequest>[] = [
  {
    title: '#',
    dataIndex: 'index',
  },
  {
    title: 'Request name',
    dataIndex: 'requestName',
  },
  {
    title: 'Request type',
    dataIndex: 'requestType',
    render: (value: REQUEST_TYPE) => requestTypeToTitle[value],
  },
  {
    title: 'Status',
    dataIndex: 'requestStatus',
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
    render: (value: string[]) => (
      <ul className="flex flex-col gap-1">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    render: (value: string[]) => (
      <ul className="flex flex-col gap-1">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    render: (value: number[]) => (
      <ul className="flex flex-col gap-1">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Approver',
    dataIndex: 'approver',
    render: (value: Partial<IUserDetail>) => (
      <div className="text-secondary">{value?.full_name}</div>
    ),
  },
  {
    title: 'Creator',
    dataIndex: 'creator',
    render: (value: Partial<IUserDetail>) => (
      <div className="text-secondary">{value?.full_name}</div>
    ),
  },
  {
    title: 'Create date',
    dataIndex: 'createDate',
    render: (value: string) => <div className="text-secondary">{value}</div>,
  },
  {
    title: '',
    dataIndex: 'method',
    render: () => <RequestActionCell />,
    fixed: 'right',
  },
]

const fakeData: IRequest[] = [
  {
    id: '1',
    requestName: 'Quỳnh Anh_ Busy Schedule 1024',
    requestType: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
    requestStatus: REQUEST_STATUS.PENDING,
    time: [
      '07/11/2024 - 09/11/2024',
      '20/11/2024 13:45-23:00',
      '30/11/2024 00:00 - 23:00',
    ],
    reason: ['Đi du lịch', 'Đi thi bằng Ô tô', 'Đi công tác'],
    quantity: [],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Ân Nguyễn Quỳnh Anh' },
    createDate: ['07/11/2023'],
  },
  {
    id: '2',
    requestName: 'Quỳnh Anh_ Busy Schedule 1024',
    requestType: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
    requestStatus: REQUEST_STATUS.REJECT,
    time: ['07/11/2024 - 07/12/2024', '08/12/2024 - 08/01/2025'],
    reason: [],
    quantity: [4, 3],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Mai Thu Huyền' },
    createDate: ['07/11/2023'],
  },
  {
    id: '3',
    requestName: 'Quỳnh Anh_ Busy Schedule 1024',
    requestType: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
    requestStatus: REQUEST_STATUS.CANCELLED,
    time: ['07/11/2024 - 09/11/2024', '20/11/2024 13:45-23:00'],
    reason: ['Đi du lịch', 'Đi học văn bằng 2'],
    quantity: [],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Mai Thu Huyền' },
    createDate: ['07/11/2023'],
  },
  {
    id: '4',
    requestName: 'Quỳnh Anh_ Busy Schedule 1024',
    requestType: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
    requestStatus: REQUEST_STATUS.PENDING,
    time: [
      '07/11/2024 - 09/11/2024',
      '20/11/2024 13:45-23:00',
      '30/11/2024 00:00 - 23:00',
    ],
    reason: ['Đi du lịch', 'Đi thi bằng Ô tô', 'Đi công tác'],
    quantity: [],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Mai Thu Huyền' },
    createDate: ['07/11/2023'],
  },
  {
    id: '5',
    requestName: 'Quỳnh Anh_ Weekly Norm 1024',
    requestType: REQUEST_TYPE.TEACHER_WEEKLY_NORMS,
    requestStatus: REQUEST_STATUS.APPROVED,
    time: ['07/11/2024 - 07/12/2024', '08/12/2024 - 08/01/2025'],
    reason: [],
    quantity: [5, 4],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Mai Thu Huyền' },
    createDate: ['07/11/2023'],
  },
  {
    id: '6',
    requestName: 'Quỳnh Anh_ Weekly Norm 1024',
    requestType: REQUEST_TYPE.TEACHER_WEEKLY_NORMS,
    requestStatus: REQUEST_STATUS.APPROVED,
    time: ['07/11/2024 - 07/12/2024', '08/12/2024 - 08/01/2025'],
    reason: [],
    quantity: [5, 4],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Mai Thu Huyền' },
    createDate: ['07/11/2023'],
  },
  {
    id: '7',
    requestName: 'Quỳnh Anh_ Busy Schedule 1024',
    requestType: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
    requestStatus: REQUEST_STATUS.APPROVED,
    time: ['07/11/2024 - 09/11/2024', '20/11/2024 13:45-23:00'],
    reason: ['Đi du lịch', 'Đi học văn bằng 2'],
    quantity: [],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Ân Nguyễn Quỳnh Anh' },
    createDate: ['07/11/2023'],
  },
  {
    id: '8',
    requestName: 'Quỳnh Anh_ Busy Schedule 1024',
    requestType: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
    requestStatus: REQUEST_STATUS.REJECT,
    time: [
      '07/11/2024 - 09/11/2024',
      '20/11/2024 13:45-23:00',
      '30/11/2024 00:00 - 23:00',
    ],
    reason: ['Đi du lịch', 'Đi thi bằng Ô tô', 'Đi công tác'],
    quantity: [],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Ân Nguyễn Quỳnh Anh' },
    createDate: ['07/11/2023'],
  },
  {
    id: '9',
    requestName: 'Quỳnh Anh_ Weekly Norm 1024',
    requestType: REQUEST_TYPE.TEACHER_WEEKLY_NORMS,
    requestStatus: REQUEST_STATUS.APPROVED,
    time: [
      '07/11/2024 - 09/11/2024',
      '20/11/2024 13:45-23:00',
      '30/11/2024 00:00 - 23:00',
    ],
    reason: [],
    quantity: [4, 5, 3],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Ân Nguyễn Quỳnh Anh' },
    createDate: ['07/11/2023'],
  },
  {
    id: '10',
    requestName: 'Quỳnh Anh_ Weekly Norm 1024',
    requestType: REQUEST_TYPE.TEACHER_WEEKLY_NORMS,
    requestStatus: REQUEST_STATUS.CANCELLED,
    time: ['07/11/2024 - 09/11/2024', '20/11/2024 13:45-23:00'],
    reason: [],
    quantity: [2, 3],
    approver: { id: '1', full_name: 'Nguyễn Hoàng Nguyên' },
    creator: { id: '2', full_name: 'Ân Nguyễn Quỳnh Anh' },
    createDate: ['07/11/2023'],
  },
]

const PersonalScheduleTable = () => {
  const [data, setData] = useState<IRequest[]>(fakeData)

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 10,
    showSizeChanger: true,
  })

  const getColumns = (): TableColumn<IRequest>[] => {
    return columnsTitles.map((item, index) => {
      return {
        ...item,
        key: index,
      }
    })
  }

  const getTableData = () => {
    return data.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      }
    })
  }

  return (
    <Table
      rowKey={(record) => record.id}
      columns={getColumns()}
      dataSource={getTableData()}
      scroll={{ x: 'max-content' }}
      pagination={pagination}
    />
  )
}

export default PersonalScheduleTable
