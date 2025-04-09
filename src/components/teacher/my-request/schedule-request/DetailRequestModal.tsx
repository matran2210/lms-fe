import { InfoIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import getConfig from 'next/config'
import React, { Dispatch, SetStateAction } from 'react'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import {
  IOpenReasonModal,
  statusColor,
  UpdateStatusParams,
} from 'src/components/teacher/my-request/schedule-request/TableContainer'
import dayjs from 'dayjs'
import PrimaryInformation from 'src/components/teacher/my-request/schedule-request/PrimaryInformation'
import { IScheduleRequestItem } from 'src/type/teachers/request-schedule.interface'
import { StatusRequestSchedule } from '@utils/constants/Teacher'
import { useQuery } from 'react-query'
import { TeacherAPI } from '@pages/api/teacher'
import clsx from 'clsx'
import { sappFormatDate } from '@utils/index'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  selectedRequest: IScheduleRequestItem
  setOpenReasonModal: React.Dispatch<React.SetStateAction<IOpenReasonModal>>
  handleUpdateStatus: ({
    requestId,
    type,
    reason,
    callback,
  }: UpdateStatusParams) => Promise<void>
}

const DetailRequestModal = ({
  open,
  setOpen,
  selectedRequest,
  setOpenReasonModal,
  handleUpdateStatus,
}: IProps) => {
  const requestId = selectedRequest.id
  const isPending = selectedRequest?.status === StatusRequestSchedule.PENDING
  const isCancel = selectedRequest?.status === StatusRequestSchedule.CANCEL
  const isOverdue = dayjs(selectedRequest?.due_date).isBefore(dayjs())
  const onClose = () => {
    setOpen(false)
  }
  /**
   * Hàm lấy dữ liệu lịch trình yêu cầu của giáo viên.
   * Sử dụng hook useQuery để lấy dữ liệu từ API.
   *
   * @param {string} requestId - ID của yêu cầu lịch trình.
   *
   * @returns {object} - Dữ liệu lịch trình yêu cầu của giáo viên.
   */
  const { data, isLoading, refetch } = useQuery({
    queryKey: [requestId],
    queryFn: async () => {
      try {
        /**
         * Gọi API để lấy dữ liệu lịch trình yêu cầu của giáo viên.
         *
         * @returns {object} - Dữ liệu lịch trình yêu cầu của giáo viên.
         */
        return await TeacherAPI.getRequestScheduleById(requestId)
      } catch (error) {
        /**
         * Xử lý lỗi khi gọi API.
         *
         * @returns {null} - Trả về null nếu có lỗi.
         */
        return null
      }
    },
    retry: false,
  })

  /**
   * Hàm xử lý khi người dùng click vào nút Cancel.
   * Mở modal Reason để người dùng nhập lý do hủy yêu cầu.
   *
   * @description
   * Nếu yêu cầu đang trong trạng thái pending, sẽ gửi yêu cầu hủy với trạng thái REJECT.
   * Nếu yêu cầu không trong trạng thái pending, sẽ gửi yêu cầu hủy với trạng thái CANCEL.
   */
  const handleClickCancel = () => {
    /**
     * Mở modal Reason với thông tin yêu cầu hủy.
     *
     * @param {object} options - Thông tin yêu cầu hủy.
     * @param {boolean} options.open - Trạng thái mở modal.
     * @param {string} options.requestId - ID của yêu cầu hủy.
     * @param {string} options.type - Trạng thái yêu cầu hủy (REJECT hoặc CANCEL).
     */
    setOpenReasonModal({
      open: true,
      requestId: requestId,
      type: isPending
        ? StatusRequestSchedule.REJECT
        : StatusRequestSchedule.CANCEL,
    })
    /**
     * Đóng modal hiện tại.
     */
    setOpen(false)
  }

  /**
   * Hàm xử lý khi người dùng submit yêu cầu phê duyệt.
   * Gửi yêu cầu cập nhật trạng thái yêu cầu lên server.
   *
   * @description
   * Hàm này sẽ gọi hàm handleUpdateStatus để cập nhật trạng thái yêu cầu lên server.
   * Sau khi cập nhật trạng thái thành công, sẽ gọi hàm onClose để đóng modal hiện tại.
   */
  const handleSubmit = () => {
    /**
     * Gọi hàm handleUpdateStatus để cập nhật trạng thái yêu cầu lên server.
     *
     * @param {object} options - Thông tin yêu cầu cập nhật trạng thái.
     * @param {string} options.requestId - ID của yêu cầu cần cập nhật trạng thái.
     * @param {string} options.type - Trạng thái yêu cầu cần cập nhật (APPROVED).
     * @param {string} options.reason - Lý do cập nhật trạng thái (APPROVED).
     * @param {function} options.callback - Hàm callback sẽ được gọi sau khi cập nhật trạng thái thành công.
     */
    handleUpdateStatus({
      requestId: requestId,
      type: StatusRequestSchedule.APPROVED,
      reason: StatusRequestSchedule.APPROVED,
      callback: onClose,
    })
  }
  return (
    <SappDrawer
      handleClickCancelButton={handleClickCancel}
      handleSubmit={handleSubmit}
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="View Request"
      footer={!isCancel}
      confirmOnClose={false}
      btnSubmitTile="Đồng ý"
      btnCancelTitle={isPending ? 'Từ chối' : 'Cancel'}
      footerClassName={clsx('flex !justify-end gap-4', {
        'px-8': !isPending,
      })}
      headerClassName="!bg-white !text-black border border-b-solid border-gray-3"
      sizeTextBtn="medium"
      cancelButtonClassName={clsx('font-medium rounded-md no-underline', {
        'bg-gray-4 hover:bg-gay-6 text-gray-12': isPending,
        'bg-state-cancel text-white': !isPending,
      })}
      submitButtonClassName="rounded-md"
      showSubmitButton={isPending}
    >
      <div className="px-8 py-6">
        <div className="mb-6 flex flex-col gap-4">
          <div>{selectedRequest?.class?.code}</div>
          <div className="flex items-center gap-[10px]">
            <div className="text-14 text-gray-12">Processing deadline:</div>
            <div
              className={clsx('flex items-center gap-[10px]', {
                'text-state-cancel': isOverdue,
              })}
            >
              {isOverdue && (
                <div className="flex items-center gap-2">
                  <InfoIcon
                    color="#F01919"
                    bgColor="#F01919"
                    width="18"
                    height="18"
                  />
                  <div>Overdue</div>
                </div>
              )}
              {sappFormatDate(selectedRequest?.due_date, 'HH:mm | DD/MM/YYYY')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-14 text-gray-12">Status:</div>
            <div
              className={clsx(
                'text-12 rounded-[4px] px-2 py-1 font-semibold',
                `${selectedRequest && statusColor(selectedRequest)}`,
              )}
            >
              {selectedRequest?.status}
            </div>
          </div>
        </div>
        <PrimaryInformation
          selectedRequest={selectedRequest}
          dataDetail={data?.data}
          isLoading={isLoading}
        />
      </div>
    </SappDrawer>
  )
}

export default DetailRequestModal
