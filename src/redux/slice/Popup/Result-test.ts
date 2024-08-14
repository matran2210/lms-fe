import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ICourseScore } from 'src/type'
import { RootState } from 'src/redux/store'
export interface ResultTestState {
  is_open: boolean
  content: ICourseScore
}

const initialState: ResultTestState = {
  is_open: false,
  content: {} as ICourseScore,
}

export const popupSlice = createSlice({
  name: 'popupReducer',
  initialState,
  reducers: {
    showPopup: (state, action: PayloadAction<ICourseScore>) => {
      state.is_open = true
      state.content = action.payload
    },
    hidePopup: (state) => {
      state.is_open = false
    },
  },
})
export const { showPopup, hidePopup } = popupSlice.actions
export const notificationReducer = (state: RootState) =>
  state.notificationReducer

export default popupSlice.reducer
