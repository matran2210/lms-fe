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
import {
  FilterRequestScheduleParams,
  IScheduleRequestItem,
  RequestScheduleParams,
} from 'src/type/teachers/request-schedule.interface'
import { StatusRequestSchedule } from '@utils/constants/Teacher'

export const statusColor = (data: IScheduleRequestItem) => {
  switch (data?.status) {
    case StatusRequestSchedule.PENDING:
      return 'bg-orange-100 text-orange-800'
    case StatusRequestSchedule.APPROVED:
      return 'bg-green-100 text-green-800'
    case StatusRequestSchedule.REJECT:
    case StatusRequestSchedule.CANCEL:
      return 'bg-red-100 text-red-800'
    default:
      return ''
  }
}
interface IProps {
  params: FilterRequestScheduleParams
}
export default function TableContainer({ params }: IProps) {
  const router = useRouter()
  const studentId = router?.query?.id as string

  const [openDetail, setOpenDetail] = useState(false)
  const [openReasonModal, setOpenReasonModal] = useState(false)
  const [openSuccessModal, setOpenSuccessModal] = useState(false)

  const [selectedRequest, setSelectedRequest] = useState<
    IScheduleRequestItem | undefined
  >()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || 1,
    pageSize: Number(router.query.page_size) || 10,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: [pagination, params],
    queryFn: async () => {
      try {
        const payload: RequestScheduleParams = {
          page_index: pagination.current ?? 1,
          page_size: pagination.pageSize ?? 10,
          ...params,
        }
        return await TeacherAPI.getListRequestSchedule(payload)
      } catch (error) {
        return null
      }
    },
    retry: false,
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
  const Action = (data: IScheduleRequestItem) => {
    setOpenDetail(true)
    setSelectedRequest(data)
  }
  const columnsValue = [
    {
      title: '#',
      render: (
        _: IScheduleRequestItem,
        record: IScheduleRequestItem,
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
      render: (record: IScheduleRequestItem) => (
        <TableCell data={record?.class.code ?? ''} className="!text-gray-400" />
      ),
    },
    {
      title: 'Program',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={record?.subject.course_category.name ?? ''}
          className="cursor-pointer hover:underline"
          onClick={() => Action(record)}
        />
      ),
    },
    {
      title: 'Subject',
      render: (record: IScheduleRequestItem) => (
        <TableCell data={record?.subject.code ?? ''} />
      ),
    },
    {
      title: 'Construction mode',
      render: (record: IScheduleRequestItem) => (
        <TableCell data={record?.type ?? ''} />
      ),
    },
    {
      title: 'Start Date - End Date',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={`${record?.schedule_time.start_date ? formatDateFromUTC(record?.schedule_time.start_date) : '-'} - ${
            record?.schedule_time.end_date
              ? formatDateFromUTC(record?.schedule_time.end_date ?? '')
              : '-'
          }`}
        />
      ),
    },
    {
      title: 'Sent Date',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={dayjs(record?.created_at).format('DD/MM/YYYY')}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'CX Admin',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={record?.staff_detail.full_name ?? ''}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Update Date',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={dayjs(record?.updated_at).format('DD/MM/YYYY')}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Status',
      render: (record: IScheduleRequestItem) => {
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
      render: (record: IScheduleRequestItem) => (
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
        data={data?.data?.data ?? []}
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
