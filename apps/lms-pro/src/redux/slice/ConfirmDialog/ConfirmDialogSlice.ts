import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

type ConfirmDialogState = {
  open?: boolean
  message: string
  cancelButtonTitle?: string
  okButtonTitle?: string
  onCancel: () => void
  onConfirm: () => void
}

const initialState: ConfirmDialogState = {
  open: false,
  message: '',
  cancelButtonTitle: 'No',
  okButtonTitle: 'Yes',
  onCancel: () => {},
  onConfirm: () => {},
}

const confirmDialogSlice = createSlice({
  name: 'confirmDialog',
  initialState,
  reducers: {
    /**
     * Một action để yêu cầu một xác nhận với tiêu đề, nội dung và các hàm gọi lại đã cho
     * @param {ConfirmDialogState} state - Trạng thái hiện tại của hộp thoại xác nhận
     * @param {PayloadAction<ConfirmDialogState>} action - Hành động có chứa các thông tin cần thiết cho hộp thoại xác nhận
     */
    requestConfirmation: (state, action: PayloadAction<ConfirmDialogState>) => {
      const { message, onCancel, onConfirm, okButtonTitle, cancelButtonTitle } =
        action.payload
      state.open = true
      state.message = message
      state.cancelButtonTitle = cancelButtonTitle
      state.okButtonTitle = okButtonTitle
      state.onCancel = onCancel
      state.onConfirm = onConfirm
    },
    /**
     * Một action để đóng hộp thoại xác nhận và khôi phục trạng thái ban đầu
     */
    closeConfirmation: () => {
      return initialState
    },
    /**
     * Một action để đặt trạng thái loading thành true
     * @param {ConfirmDialogState} state - Trạng thái hiện tại của hộp thoại xác nhận
     */
    setLoadingTrue: (state) => {
      return { ...state }
    },
  },
})

export const confirmDialogActions = confirmDialogSlice.actions
export const confirmDialogReducer = (state: RootState) =>
  state.confirmDialogReducer
export default confirmDialogSlice.reducer
