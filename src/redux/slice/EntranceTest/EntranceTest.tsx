import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface Iprops {
  status: boolean
}

const initialState: Iprops = {
  status: false,
}

export const entranceTestSlice = createSlice({
  name: 'entranceTestReducer',
  initialState,
  reducers: {
    active: (state) => {
      // Active user guide khi action 'active' được gọi
      state.status = true
    },
  },
})

export const { active } = entranceTestSlice.actions
export const entranceTestReducer = (state: RootState) =>
  state.entranceTestReducer
export default entranceTestSlice.reducer
