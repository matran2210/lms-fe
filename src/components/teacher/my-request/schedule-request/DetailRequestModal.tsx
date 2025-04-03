/* eslint-disable react-hooks/exhaustive-deps */
import { DownloadIcon, InfoIcon, NotificationIcon } from '@assets/icons'
import SappDrawer from '@components/base/SappDrawer'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { bytesToKilobyte } from '@utils/index'
import getConfig from 'next/config'
import React, { Dispatch, SetStateAction, useState } from 'react'
const { publicRuntimeConfig } = getConfig()
export const { apiURL } = publicRuntimeConfig
import TextSkeleton from '@components/base/skeleton/TextSkeleton'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { IScheduleRequest, statusColor } from './TableContainer'
import dayjs from 'dayjs'
import { Collapse, CollapseProps } from 'antd'
import Panel from 'antd/es/splitter/Panel'
import PrimaryInformation from './PrimaryInformation'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  selectedRequest?: IScheduleRequest
  setOpenReasonModal: Dispatch<SetStateAction<boolean>>
}

const DetailRequestModal = ({
  open,
  setOpen,
  selectedRequest,
  setOpenReasonModal,
}: IProps) => {
  const isPending = selectedRequest?.status === 'Chờ Duyệt'
  const isOverdue = dayjs(selectedRequest?.processingDeadline).isBefore(dayjs())
  const onClose = () => {
    setOpen(false)
  }

  const handleClickCancel = () => {
    setOpenReasonModal(true)
    setOpen(false)
  }
  const handleClickApprove = () => {}
  return (
    <SappDrawer
      handleClickCancelButton={handleClickCancel}
      handleSubmit={handleClickApprove}
      isOpen={open}
      message="Bạn có chắc chán muốn hủy không?"
      onClose={onClose}
      title="View Request"
      footer
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
          <div>{selectedRequest?.classCode}</div>
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
                {dayjs(selectedRequest?.processingDeadline).format(
                  'HH:mm | DD/MM/YYYY',
                )}
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
          <PrimaryInformation selectedRequest={selectedRequest} />
        </div>
      </div>
    </SappDrawer>
  )
}

export default DetailRequestModal
