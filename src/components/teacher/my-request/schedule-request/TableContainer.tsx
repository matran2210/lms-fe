import SappTable from '@components/table/SappTable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TablePaginationConfig } from 'antd'
import { formatDateFromUTC } from 'src/utils/index'
import { TeacherAPI } from '@pages/api/teacher'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import TableCell from 'src/components/teacher/my-request/schedule-request/TableCell'
import ActionCell from 'src/components/base/action/SappActionCell'
import DetailRequestModal from 'src/components/teacher/my-request/schedule-request/DetailRequestModal'
import ReasonModal from 'src/components/teacher/my-request/schedule-request/ReasonModal'
import SuccessModal from 'src/components/teacher/my-request/schedule-request/SuccessModal'
import {
  FilterRequestScheduleParams,
  IScheduleRequestItem,
  RequestScheduleParams,
  StatusRequestScheduleParams,
} from 'src/type/teachers/request-schedule.interface'
import { StatusRequestSchedule } from '@utils/constants/Teacher'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from 'src/constants'

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
export const defaultOpenReasonModal: IOpenReasonModal = {
  type: undefined,
  open: false,
  requestId: '',
}
export interface UpdateStatusParams {
  requestId: string
  type: StatusRequestSchedule
  reason?: string
  callback?: () => void
}
export interface IOpenReasonModal {
  requestId: string | undefined
  type: StatusRequestSchedule | undefined
  open: boolean
}
interface IProps {
  params: FilterRequestScheduleParams
}
export default function TableContainer({ params }: IProps) {
  const router = useRouter()
  const [openDetail, setOpenDetail] = useState(false)
  const [openReasonModal, setOpenReasonModal] = useState<IOpenReasonModal>(
    defaultOpenReasonModal,
  )
  const [openSuccessModal, setOpenSuccessModal] = useState(false)

  const [selectedRequest, setSelectedRequest] = useState<
    IScheduleRequestItem | undefined
  >()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: Number(router.query.page_index) || DEFAULT_PAGE_NUMBER,
    pageSize: Number(router.query.page_size) || DEFAULT_PAGE_SIZE,
    total: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: [pagination, params],
    queryFn: async () => {
      try {
        const payload: RequestScheduleParams = {
          page_index: pagination.current ?? DEFAULT_PAGE_NUMBER,
          page_size: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
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
            ((pagination?.current || 1) - DEFAULT_PAGE_NUMBER) *
              (pagination?.pageSize || DEFAULT_PAGE_SIZE)
          }
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Class code',
      render: (record: IScheduleRequestItem) => (
        <TableCell data={record?.class?.code} className="!text-gray-400" />
      ),
    },
    {
      title: 'Program',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={record?.subject?.course_category?.name}
          className="cursor-pointer hover:underline"
          onClick={() => Action(record)}
        />
      ),
    },
    {
      title: 'Subject',
      render: (record: IScheduleRequestItem) => (
        <TableCell data={record?.subject?.code} />
      ),
    },
    {
      title: 'Construction mode',
      render: (record: IScheduleRequestItem) => (
        <TableCell data={record?.mode} />
      ),
    },
    {
      title: 'Start Date - End Date',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={`${record?.schedule_time.start_date ? formatDateFromUTC(record?.schedule_time.start_date) : '-'} - ${
            record?.schedule_time.end_date
              ? formatDateFromUTC(record?.schedule_time.end_date)
              : '-'
          }`}
        />
      ),
    },
    {
      title: 'Sent Date',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={formatDateFromUTC(record?.created_at)}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'CX Admin',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={record?.staff_detail?.full_name}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Update Date',
      render: (record: IScheduleRequestItem) => (
        <TableCell
          data={formatDateFromUTC(record?.updated_at)}
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
                {record?.status}
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
        <ActionCell handleClickView={() => Action(record)} />
      ),
    },
  ]
  /**
   * Hàm cập nhật trạng thái yêu cầu lịch trình.
   * Gửi yêu cầu lên server để cập nhật trạng thái yêu cầu lịch trình.
   *
   * @param {object} params - Thông tin cập nhật trạng thái yêu cầu lịch trình.
   * @param {string} params.requestId - ID của yêu cầu lịch trình cần cập nhật trạng thái.
   * @param {string} params.type - Trạng thái yêu cầu lịch trình cần cập nhật.
   * @param {string} [params.reason] - Lý do cập nhật trạng thái yêu cầu lịch trình (không bắt buộc).
   * @param {function} [params.callback] - Hàm callback sẽ được gọi sau khi cập nhật trạng thái thành công (không bắt buộc).
   */
  const handleUpdateStatus = async ({
    requestId,
    type,
    reason = '',
    callback = () => {},
  }: UpdateStatusParams) => {
    try {
      /**
       * Tạo payload để gửi yêu cầu lên server.
       *
       * @param {object} payload - Thông tin cập nhật trạng thái yêu cầu lịch trình.
       * @param {string} payload.reason - Lý do cập nhật trạng thái yêu cầu lịch trình.
       * @param {string} payload.status - Trạng thái yêu cầu lịch trình cần cập nhật.
       */
      const payload: StatusRequestScheduleParams = {
        reason: reason,
        status: type,
      }
      /**
       * Gửi yêu cầu lên server để cập nhật trạng thái yêu cầu lịch trình.
       *
       * @param {string} requestId - ID của yêu cầu lịch trình cần cập nhật trạng thái.
       * @param {object} payload - Thông tin cập nhật trạng thái yêu cầu lịch trình.
       */
      await TeacherAPI.updateStatusRequestSchedule(requestId, payload)
      /**
       * Gọi hàm callback sau khi cập nhật trạng thái thành công.
       */
      callback()
      /**
       * Mở modal thành công sau khi cập nhật trạng thái thành công.
       */
      setOpenSuccessModal(true)
      /**
       * Refetch dữ liệu sau khi cập nhật trạng thái thành công.
       */
      other?.refetch()
    } catch (error) {
    } finally {
    }
  }
  return (
    <>
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.data?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        emptyText="No matching records found"
      />

      {openDetail && selectedRequest && (
        <DetailRequestModal
          open={openDetail}
          setOpen={setOpenDetail}
          selectedRequest={selectedRequest}
          setOpenReasonModal={setOpenReasonModal}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}

      {openReasonModal && openReasonModal.requestId && openReasonModal.type && (
        <ReasonModal
          open={openReasonModal}
          setOpen={setOpenReasonModal}
          setOpenSuccessModal={setOpenSuccessModal}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}

      {openSuccessModal && (
        <SuccessModal open={openSuccessModal} setOpen={setOpenSuccessModal} />
      )}
    </>
  )
}
