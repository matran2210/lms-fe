import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface GuideState {
  status: boolean
  step: number
}

const initialState: GuideState = {
  status: false,
  step: 0,
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
    reset: () => {
      // Đặt giá trị khi action 'reset' được gọi
      return initialState
    },
  },
})

export const { increment, active, reset } = userGuideSlice.actions
export const userGuideReducer = (state: RootState) => state.userGuideReducer
export default userGuideSlice.reducer
