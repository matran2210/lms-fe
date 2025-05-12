import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface GuideState {
  status: boolean
  step: number
  isActive: boolean
}

const initialState: GuideState = {
  status: false,
  step: 0,
  isActive: false,
}

export const userGuideSlice = createSlice({
  name: 'userGuideReducer',
  initialState,
  reducers: {
    active: (state) => {
      // Active user guide khi action 'active' được gọi
      state.status = true
    },
    increment: (state) => {
      // Tăng giá trị lên 1 khi action 'increment' được gọi
      state.step += 1
    },
    reset: (state) => {
      state.isActive = true
      state.status = false
    },
    clearGuideState: () => {
      // Đặt giá trị khi action 'reset' được gọi
      return initialState
    },
  },
})

export const { increment, active, reset, clearGuideState } =
  userGuideSlice.actions
export const userGuideReducer = (state: RootState) => state.userGuideReducer
export default userGuideSlice.reducer
