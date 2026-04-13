import { zodResolver } from '@hookform/resolvers/zod'
import { AlertIcon } from '@lms/assets'
import { SappModalV3 } from '@lms/ui'
import { VALIDATE_REQUIRED } from '@lms/utils'
import { isEmpty } from 'lodash'
import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { defaultOpenReasonModal, IOpenReasonModal, UpdateStatusParams } from './TableContainer'
import SappTeacherTextField from '../../sapp-textfield/SappTeacherTextField'
import { IScheduleRequestItem, PROGRAM } from '@lms/core'
interface IProps {
  open: IOpenReasonModal
  setOpen: React.Dispatch<React.SetStateAction<IOpenReasonModal>>
  setOpenSuccessModal: Dispatch<SetStateAction<boolean>>
  selectedRequest: IScheduleRequestItem | undefined
  handleUpdateStatus: ({
    request_ids,
    requestId,
    type,
    reason,
    callback,
  }: UpdateStatusParams) => Promise<void>
}
const ReasonModal = ({
  open,
  setOpen,
  setOpenSuccessModal,
  selectedRequest,
  handleUpdateStatus,
}: IProps) => {
  const schema = z.object({
    request_reject_reason: z.string({ required_error: VALIDATE_REQUIRED }),
  })
  const { control, reset, handleSubmit } = useForm<{
    request_reject_reason: string
  }>({
    resolver: zodResolver(schema),
  })

  /**
   * Hàm xử lý khi người dùng hủy yêu cầu cập nhật trạng thái.
   * Reset giá trị của form và đóng modal hiện tại.
   */
  const handleCancel = () => {
    /**
     * Reset giá trị của form.
     *
     * @param {object} options - Thông tin reset giá trị của form.
     * @param {string} options.request_reject_reason - Giá trị của trường request_reject_reason sẽ được reset về rỗng.
     */
    reset({ request_reject_reason: '' })
    /**
     * Đóng modal hiện tại.
     */
    setOpen(defaultOpenReasonModal)
  }
  /**
   * Hàm xử lý khi người dùng submit yêu cầu cập nhật trạng thái.
   * Gửi yêu cầu cập nhật trạng thái lên server.
   *
   * @description
   * Hàm này sẽ kiểm tra xem requestId và type có được định nghĩa hay không.
   * Nếu không, sẽ trả về ngay lập tức.
   * Sau đó, sẽ gọi hàm handleUpdateStatus để cập nhật trạng thái lên server.
   * Nếu cập nhật thành công, sẽ gọi callback để đóng modal hiện tại và mở modal thành công.
   */
  const onSubmit = (data: { request_reject_reason: string }) => {
    /**
     * Kiểm tra xem requestId có được định nghĩa hay không.
     * Nếu không, sẽ trả về ngay lập tức.
     */
    if (open.requestId === undefined) return

    /**
     * Kiểm tra xem type có được định nghĩa hay không.
     * Nếu không, sẽ trả về ngay lập tức.
     */
    if (open.type === undefined) return
    /**
     * Gọi hàm handleUpdateStatus để cập nhật trạng thái lên server.
     *
     * @param {object} options - Thông tin yêu cầu cập nhật trạng thái.
     * @param {string} options.requestId - ID của yêu cầu cần cập nhật trạng thái.
     * @param {string} options.type - Trạng thái yêu cầu cần cập nhật.
     * @param {string} options.reason - Lý do cập nhật trạng thái.
     * @param {function} options.callback - Hàm callback sẽ được gọi sau khi cập nhật trạng thái thành công.
     */

    if (isEmpty(data.request_reject_reason)) return
    const isACCAProgram = selectedRequest?.subject?.course_category?.name === PROGRAM.ACCA

    handleUpdateStatus({
      ...(isACCAProgram && { request_ids: selectedRequest?.request_ids || [] }),
      requestId: open.requestId,
      type: open.type,
      reason: data.request_reject_reason,
      callback: () => {
        /**
         * Đóng modal hiện tại.
         */
        setOpen(defaultOpenReasonModal)
        /**
         * Mở modal thành công.
         */
        setOpenSuccessModal(true)
      },
    })
  }
  return (
    <SappModalV3
      handleClose={handleCancel}
      open={open.open}
      handleCancel={handleCancel}
      onOk={handleSubmit(onSubmit)}
      icon={<AlertIcon />}
      header={'Please enter a reason for denying this request!'}
      showCancelButton
      cancelButtonCaption={'Cancel'}
      okButtonCaption={'Submit'}
      footerButtonClassName="flex flex-row-reverse justify-center gap-4"
      okButtonClass="rounded-md !px-5 !py-3 text-sm  !font-normal bg-[#f01919]"
      cancelButtonClass="bg-gray-100 hover:bg-gay-6 text-accent !no-underline rounded-md !px-5 !py-3 text-sm !font-normal"
      buttonSize="medium"
      color="danger"
      headerClassName="!text-sm !font-normal"
      classNameModal={`sapp-custom-modal success-modal`}
      isValidated
    >
      <SappTeacherTextField
        label="Reason"
        name={'request_reject_reason'}
        control={control}
        placeholder="Input Text"
        required
        className="rounded-lg"
      />
    </SappModalV3>
  )
}

export default ReasonModal
