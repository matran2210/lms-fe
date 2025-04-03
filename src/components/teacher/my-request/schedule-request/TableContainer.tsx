import { Typography } from 'antd'
import SappTable from '@components/table/SappTable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { formatDateFromUTC } from 'src/utils/index'
import { TeacherAPI } from '@pages/api/teacher'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import TableCell from './TableCell'
import ActionCell from '../../../base/action/SappActionCell'
import DetailRequestModal from './DetailRequestModal'
import ReasonModal from './ReasonModal'
import SuccessModal from './SuccessModal'

const { Title } = Typography

export interface IScheduleRequest {
  id: string
  classCode: string
  program: string
  subject: string
  startDate: string
  endDate: string
  sentDate: string
  cxAdmin: string
  updateDate: string
  status: string
  constructionMode: string
  processingDeadline: string
  address: string
  schedule: string[]
}
export const statusColor = (data: IScheduleRequest) => {
  switch (data?.status) {
    case 'Chờ Duyệt':
      return 'bg-orange-100 text-orange-800'
    case 'Đồng ý':
      return 'bg-green-100 text-green-800'
    case 'Từ chối':
      return 'bg-red-100 text-red-800'
    default:
      return ''
  }
}
interface FilterParams {
  text?: string
}

const initialValues: FilterParams = {
  text: '',
}

export default function TableContainer() {
  const router = useRouter()
  const studentId = router?.query?.id as string

  const [openDetail, setOpenDetail] = useState(false)
  const [openReasonModal, setOpenReasonModal] = useState(false)
  const [openSuccessModal, setOpenSuccessModal] = useState(false)

  const [params, setParams] = useState<FilterParams>(initialValues)
  const [selectedRequest, setSelectedRequest] = useState<
    IScheduleRequest | undefined
  >()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['student', studentId, pagination, params],
    queryFn: () =>
      TeacherAPI.getStudentById(
        studentId,
        pagination.current ?? 1,
        pagination.pageSize ?? 10,
        params,
      ),
    enabled: !!studentId,
  })

  useEffect(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page_index: pagination.current,
          page_size: pagination.pageSize,
          ...params,
        },
      },
      undefined,
      { shallow: true },
    )
  }, [pagination, params])

  const handleChangeParams = (currentPage: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: pageSize,
    }))
  }
  const Action = (data: IScheduleRequest) => {
    setOpenDetail(true)
    setSelectedRequest(data)
  }
  const columnsValue = [
    {
      title: '#',
      render: (
        _: IScheduleRequest,
        record: IScheduleRequest,
        index: number,
      ) => (
        <TableCell
          data={
            index +
            1 +
            ((pagination?.current || 1) - 1) * (pagination?.pageSize || 10)
          }
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Class code',
      render: (record: IScheduleRequest) => (
        <TableCell data={record?.classCode ?? ''} className="!text-gray-400" />
      ),
    },
    {
      title: 'Program',
      render: (record: IScheduleRequest) => (
        <TableCell
          data={record?.program ?? ''}
          className="cursor-pointer hover:underline"
          onClick={() => Action(record)}
        />
      ),
    },
    {
      title: 'Subject',
      render: (record: IScheduleRequest) => (
        <TableCell data={record?.subject ?? ''} />
      ),
    },
    {
      title: 'Construction mode',
      render: (record: IScheduleRequest) => (
        <TableCell data={record?.constructionMode ?? ''} />
      ),
    },
    {
      title: 'Start Date - End Date',
      render: (record: IScheduleRequest) => (
        <TableCell
          data={`${formatDateFromUTC(record?.startDate ?? '')} - ${formatDateFromUTC(
            record?.endDate ?? '',
          )}`}
        />
      ),
    },
    {
      title: 'Sent Date',
      render: (record: IScheduleRequest) => (
        <TableCell
          data={dayjs(record?.sentDate).format('DD/MM/YYYY')}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'CX Admin',
      render: (record: IScheduleRequest) => (
        <TableCell data={record?.cxAdmin ?? ''} className="!text-gray-400" />
      ),
    },
    {
      title: 'Update Date',
      render: (record: IScheduleRequest) => (
        <TableCell
          data={dayjs(record?.updateDate).format('DD/MM/YYYY')}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Status',
      render: (record: IScheduleRequest) => {
        return (
          <TableCell
            data={
              <span
                className={`text-12 rounded-[4px] px-2 py-1 font-semibold ${statusColor(record)}`}
              >
                {record?.status ?? ''}
              </span>
            }
          />
        )
      },
    },
    {
      title: '',
      fixed: 'right',
      render: (record: IScheduleRequest) => (
        <>
          <ActionCell handleClickView={() => Action(record)} />
        </>
      ),
    },
  ]

  const mockData = [
    {
      id: 1,
      classCode: '123456',
      program: 'Program 1',
      subject: 'Subject 1',
      constructionMode: 'Construction Mode 1',
      startDate: '2022-01-01',
      endDate: '2022-01-01',
      sentDate: '2024-01-01',
      cxAdmin: 'CX Admin 1',
      updateDate: 'Update Date 1',
      status: 'Chờ Duyệt',
      processingDeadline: '2024-01-04 20:00:00',
      address: 'Address 1',
      schedule: ['Thứ 2 | 18:00 - 21:00', 'Thứ 4 | 18:00 - 21:00'],
    },
    {
      id: 2,
      classCode: '12e456',
      program: 'Program 2',
      subject: 'Subject 2',
      constructionMode: 'Construction Mode 2',
      startDate: '2022-01-01',
      endDate: '2022-01-01',
      sentDate: '2024-01-01',
      cxAdmin: 'CX Admin 2',
      updateDate: 'Update Date 2',
      status: 'Đồng ý',
      processingDeadline: '2024-01-04 20:00:00',
      address: 'Address 2',
      schedule: ['Thứ 2 | 18:00 - 21:00', 'Thứ 4 | 18:00 - 21:00'],
    },
    {
      id: 3,
      classCode: '1234w6',
      program: 'Program 1',
      subject: 'Subject 1',
      constructionMode: 'Construction Mode 1',
      startDate: '2022-01-01',
      endDate: '2022-01-01',
      sentDate: '2024-01-01',
      cxAdmin: 'CX Admin 1',
      updateDate: 'Update Date 1',
      status: 'Từ chối',
      processingDeadline: '2024-01-04 20:00:00',
      address: 'Address 1',
      schedule: ['Thứ 2 | 18:00 - 21:00', 'Thứ 4 | 18:00 - 21:00'],
    },
  ]
  return (
    <>
      <SappTable
        handleChangeParams={handleChangeParams}
        filterParams={params}
        fetchData={() => {}}
        fetchTableData={() => {}}
        columns={columnsValue}
        data={mockData ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        showCheckbox={false}
        setSelection={() => {}}
        selections={new Map()}
      />

      {openDetail && selectedRequest && (
        <DetailRequestModal
          open={openDetail}
          setOpen={setOpenDetail}
          selectedRequest={selectedRequest}
          setOpenReasonModal={setOpenReasonModal}
        />
      )}

      {openReasonModal && (
        <ReasonModal
          open={openReasonModal}
          setOpen={setOpenReasonModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}

      {openSuccessModal && (
        <SuccessModal open={openSuccessModal} setOpen={setOpenSuccessModal} />
      )}
    </>
  )
}
