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

  const { data, isLoading, refetch } = useQuery({
    queryKey: [requestId],
    queryFn: async () => {
      try {
        return await TeacherAPI.getRequestScheduleById(requestId)
      } catch (error) {
        return null
      }
    },
    retry: false,
  })

  const handleClickCancel = () => {
    setOpenReasonModal({
      open: true,
      requestId: requestId,
      type: isPending
        ? StatusRequestSchedule.REJECT
        : StatusRequestSchedule.CANCEL,
    })
    setOpen(false)
  }

  return (
    <SappDrawer
      handleClickCancelButton={handleClickCancel}
      handleSubmit={() =>
        handleUpdateStatus({
          requestId: requestId,
          type: StatusRequestSchedule.APPROVED,
          reason: StatusRequestSchedule.APPROVED,
          callback: onClose,
        })
      }
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="View Request"
      footer={!isCancel}
      confirmOnClose={false}
      btnSubmitTile="Đồng ý"
      btnCancelTitle={isPending ? 'Từ chối' : 'Cancel'}
      footerClassName={`flex !justify-end gap-4 ${isPending ? '' : 'px-8'}`}
      headerClassName="!bg-white !text-black border border-b-solid border-gray-3"
      sizeTextBtn="medium"
      cancelButtonClassName={`${isPending ? 'bg-gray-4 hover:bg-gay-6 text-[#9CA3AF]' : 'bg-[#D20306] text-white'} font-medium rounded-md no-underline`}
      submitButtonClassName="rounded-md"
      showSubmitButton={isPending}
    >
      <div className="px-8 py-6">
        <div className="mb-6 flex flex-col gap-4">
          <div>{selectedRequest?.class.code}</div>
          <div className="flex items-center gap-[10px]">
            <div className="text-14 text-[#78829D]">Processing deadline:</div>
            <div
              className={`flex items-center gap-[10px] ${isOverdue ? 'text-[#D20306]' : ''}`}
            >
              {isOverdue && (
                <div className="flex items-center gap-2">
                  <div>
                    <InfoIcon
                      color="#F01919"
                      bgColor="#F01919"
                      width="18"
                      height="18"
                    />
                  </div>
                  <div>Overdue</div>
                </div>
              )}
              <div>
                {dayjs(selectedRequest?.due_date).format('HH:mm | DD/MM/YYYY')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-14 text-[#9CA3AF]">Status:</div>
            <div
              className={`text-12 rounded-[4px] px-2 py-1 font-semibold ${selectedRequest && statusColor(selectedRequest)}`}
            >
              {selectedRequest?.status}
            </div>
          </div>
        </div>

        <div>
          <PrimaryInformation
            selectedRequest={selectedRequest}
            dataDetail={data?.data}
            isLoading={isLoading}
          />
        </div>
      </div>
    </SappDrawer>
  )
}

export default DetailRequestModal
