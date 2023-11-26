import { Modal } from 'antd'
import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import ButtonCancelSubmit from '../button/ButtonCancelSubmit'

interface IProps {
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  children: ReactNode

  cancelButtonCaption?: string | undefined
  okButtonCaption?: string | undefined

  handleCancel?: () => Promise<void> | void
  handleSubmit?: () => Promise<void> | void

  disabled?: boolean

  title: string
  showTitle?: boolean
  customTitle?: ReactNode

  showFooter?: boolean
  customFooter?: ReactNode

  confirmOnclose?: boolean | string[]
  width?: number
}
/**
 * Hàm này tạo một modal component bằng React
 * @param open: boolean - biến xác định modal có được mở hay không
 * @param setOpen: function - hàm xác định modal có được mở hay không
 * @param children: ReactNode - biến chứa các phần tử con của modal
 * @param cancelButtonCaption: string - biến xác định nội dung của nút hủy
 * @param okButtonCaption: string - biến xác định nội dung của nút xác nhận
 * @param handleCancel: function - hàm xử lý khi người dùng nhấn nút hủy
 * @param handleSubmit: function - hàm xử lý khi người dùng nhấn nút xác nhận
 * @param disabled: boolean - biến xác định modal có bị vô hiệu hóa hay không
 * @param title: string - biến xác định tiêu đề của modal
 * @param showTitle: boolean - biến xác định modal có hiển thị tiêu đề hay không
 * @param customTitle: ReactNode - biến chứa phần tử tùy chỉnh cho tiêu đề
 * @param showFooter: boolean - biến xác định modal có hiển thị footer hay không
 * @param customFooter: ReactNode - biến chứa phần tử tùy chỉnh cho footer
 * @param confirmOnclose: boolean - biến xác định modal có yêu cầu xác nhận khi đóng hay không
 * @param width: number - biến xác định modal width
 */
const SappModal: React.FC<IProps> = ({
  open,
  setOpen,
  children,
  cancelButtonCaption = 'Cancel',
  okButtonCaption = 'Submit',

  handleCancel,
  handleSubmit,

  disabled,

  title,
  showTitle = true,
  customTitle,

  showFooter = true,
  customFooter,

  confirmOnclose,
  width,
}) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Hàm này xử lý khi người dùng nhấn nút xác nhận
   * @return void
   */
  const onOk = async () => {
    // Nếu handleSubmit là một hàm bất đồng bộ, thì gọi hàm đó và đợi kết quả
    if (handleSubmit && handleSubmit.constructor.name === 'AsyncFunction') {
      setLoading(true)
      await handleSubmit()
      setLoading(false)
      setOpen && setOpen(false)
      return
    }
    // Nếu handleSubmit là một hàm thường, thì gọi hàm đó
    else if (handleSubmit) {
      handleSubmit()
    }
    setOpen && setOpen(false)
  }

  /**
   * Hàm này xử lý khi người dùng nhấn nút hủy
   * @return void
   */
  const onCancel = async () => {
    /**
     * Hàm này gọi hàm handleCancel theo loại hàm
     * @return void
     */
    const callHandleCancel = async () => {
      // Nếu handleCancel là một hàm bất đồng bộ, thì gọi hàm đó và đợi kết quả
      if (handleCancel && handleCancel.constructor.name === 'AsyncFunction') {
        setLoading(true)
        await handleCancel()
        setLoading(false)
        setOpen && setOpen(false)
        return
      }
      // Nếu handleCancel là một hàm thường, thì gọi hàm đó
      else if (handleCancel) {
        handleCancel()
      }
    }
    // Nếu confirmOnclose là true, thì mở một hộp thoại xác nhận

    if (confirmOnclose) {
      dispatch(
        confirmDialog.open({
          // Nội dung của hộp thoại xác nhận
          message: 'Bạn có chắc chắn muốn hủy không?',
          // Hàm thực thi khi người dùng xác nhận hành động
          onConfirm: callHandleCancel,
        }),
      )
    } else {
      // Nếu confirmOnclose là false, thì không cần xác nhận
      // Gọi hàm callHandleCancel
      callHandleCancel()
      setOpen && setOpen(false)
    }
  }

  return (
    <>
      <Modal
        open={open}
        title={showTitle ? customTitle || title || <> &nbsp;</> : <> &nbsp;</>}
        onOk={onOk}
        onCancel={onCancel}
        destroyOnClose
        focusTriggerAfterClose
        centered
        classNames={{
          content: 'flex flex-col max-h-screen max-h-[calc(100vh-4rem)]',
          body: 'overflow-y-scroll snap-y -mr-5 flex-1',
        }}
        width={width}
        footer={
          <>
            {showFooter &&
              (customFooter || (
                <ButtonCancelSubmit
                  className="justify-center sm:justify-end flex"
                  submit={{
                    title: okButtonCaption,
                    size: 'medium',
                    loading: loading,
                    disabled: disabled,
                    onClick: onOk,
                  }}
                  cancel={{
                    title: cancelButtonCaption,
                    size: 'medium',
                    onClick: onCancel,
                    loading: loading,
                  }}
                ></ButtonCancelSubmit>
              ))}
          </>
        }
      >
        <div className="pr-6.5">{children}</div>
      </Modal>
    </>
  )
}

export default SappModal
