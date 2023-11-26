import { createAsyncThunk } from '@reduxjs/toolkit'
import { confirmDialogActions } from './ConfirmDialogSlice'

// định nghĩa các hành động thunk cho hộp thoại xác nhận
const confirmDialogThunk = {
  /**
   * Một hàm tạo ra một thunk trả về một promise giải quyết thành một giá trị boolean
   * cho biết người dùng đã xác nhận hay hủy bỏ hành động
   * @param {object} arg - Đối tượng đối số cho thunk
   * @param {string} arg.title - Tiêu đề của hộp thoại xác nhận
   * @param {string} arg.message - Nội dung của hộp thoại xác nhận
   * @param {function} arg.onConfirm - Hàm thực thi khi người dùng xác nhận hành động
   * @param {function} arg.onCancel - Hàm thực thi khi người dùng hủy bỏ hành động
   * @returns {Promise<boolean>} Một promise giải quyết thành một giá trị boolean
   */
  open: createAsyncThunk<
    boolean,
    {
      title?: string
      message: string
      onConfirm: () => Promise<void> | void
      onCancel?: () => Promise<void> | void
    },
    any
  >(
    'confirmDialog/open',
    async (
      { title, message, onConfirm, onCancel },
      { dispatch, rejectWithValue, fulfillWithValue },
    ) => {
      try {
        dispatch(
          confirmDialogActions.requestConfirmation({
            title,
            message,
            // Hàm này được gọi khi người dùng nhấn nút hủy
            onCancel: async () => {
              if (onCancel && onCancel.constructor.name === 'AsyncFunction') {
                dispatch(confirmDialogActions.setLoadingTrue())
                await onCancel()
              }
            },
            // Hàm này được gọi khi người dùng nhấn nút xác nhận
            onConfirm: async () => {
              if (onConfirm.constructor.name === 'AsyncFunction') {
                dispatch(confirmDialogActions.setLoadingTrue())
              }

              await onConfirm()
            },
          }),
        )
        return fulfillWithValue(true)
      } catch (error: any) {
        // xử lý lỗi
        return rejectWithValue(error)
      }
    },
  ),
}

export default confirmDialogThunk
