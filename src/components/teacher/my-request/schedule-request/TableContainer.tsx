import SappTable from '@components/table/SappTable'
import { TeacherAPI } from '@pages/api/teacher'
import { StatusRequestSchedule } from '@utils/constants/Teacher'
import { TablePaginationConfig } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import ActionCell from 'src/components/base/action/SappActionCell'
import DetailRequestModal from 'src/components/teacher/my-request/schedule-request/DetailRequestModal'
import ReasonModal from 'src/components/teacher/my-request/schedule-request/ReasonModal'
import SuccessModal from 'src/components/teacher/my-request/schedule-request/SuccessModal'
import TableCell from 'src/components/teacher/my-request/schedule-request/TableCell'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from 'src/constants'
import {
  FilterRequestScheduleParams,
  IScheduleRequestItem,
  RequestScheduleParams,
  StatusRequestScheduleParams,
} from 'src/type/teachers/request-schedule.interface'
import {
  convertSlugToTitle,
  convertSnakeCaseToHumanReadable,
  formatDateFromUTC,
} from 'src/utils/index'
import StatusItem from './StatusItem'
import { ColumnsType } from 'antd/es/table'
import Tooltip from 'src/common/Tooltip'
import TooltipParagraph from 'src/common/TooltipParagraph'
import useSappPaging from 'src/hooks/useSappPaging'
import { TeacherKey } from '@pages/api/queryKey'

export const statusColor = (data: IScheduleRequestItem) => {
  switch (data?.status) {
    case StatusRequestSchedule.PENDING:
      return 'bg-orange-1 text-accent-warning'
    case StatusRequestSchedule.APPROVED:
      return 'bg-green-5 text-green-1'
    case StatusRequestSchedule.REJECT:
    case StatusRequestSchedule.CANCEL:
      return 'bg-danger-5 text-danger-3'
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
  const {
    data,
    pagination,
    isLoading,
    handleChangeParams,
    setPagination,
    other,
  } = useSappPaging({
    uniqueKey: TeacherKey.ScheduleRequest,
    queryFn: () =>
      TeacherAPI.getListRequestSchedule({
        page_index: pagination.current ?? DEFAULT_PAGE_NUMBER,
        page_size: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
        ...params,
      }),
    params,
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

  const Action = (data: IScheduleRequestItem) => {
    setOpenDetail(true)
    setSelectedRequest(data)
  }
  const columnsValue: ColumnsType<IScheduleRequestItem> = [
    {
      title: '#',
      render: (_, record: IScheduleRequestItem, index: number) => (
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
      render: (_, record: IScheduleRequestItem) => (
        <TableCell data={record?.class?.code} className="!text-gray-400" />
      ),
    },
    {
      title: 'Program',
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={record?.subject?.course_category?.name}
          className="cursor-pointer hover:underline"
          onClick={() => Action(record)}
        />
      ),
    },
    {
      title: 'Subject',
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap"
          data={
            <TooltipParagraph className="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {`${convertSlugToTitle(record?.subject?.code)}_${record?.course_section?.name}`}
            </TooltipParagraph>
          }
        />
      ),
    },
    {
      title: 'Construction mode',
      render: (_, record: IScheduleRequestItem) => (
        <TableCell data={convertSnakeCaseToHumanReadable(record?.mode)} />
      ),
    },
    {
      title: 'Start Date - End Date',
      render: (_, record: IScheduleRequestItem) => (
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
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={formatDateFromUTC(record?.created_at)}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'CX Admin',
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={record?.staff_detail?.full_name}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Update Date',
      render: (_, record: IScheduleRequestItem) => (
        <TableCell
          data={formatDateFromUTC(record?.updated_at)}
          className="!text-gray-400"
        />
      ),
    },
    {
      title: 'Status',
      render: (_, record: IScheduleRequestItem) => {
        return (
          <TableCell
            data={
              <StatusItem
                status={record?.status?.toLowerCase()}
                className={statusColor(record)}
              />
            }
          />
        )
      },
    },
    {
      title: '',
      fixed: 'right',
      render: (_, record: IScheduleRequestItem) => (
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

  useEffect(() => {
    if (router.query.showRequestDetail === 'true') {
      setOpenDetail(true)
    }
  }, [])

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

      {openDetail && (selectedRequest || router.query.request_id) && (
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
