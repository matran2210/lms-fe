import { EventTestAPI } from '@pages/api/event-test'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface Iprops {
  status: boolean
  count: any
  shouldShowRemind?: boolean
}

const initialState: Iprops = {
  status: false,
  count: 0,
  shouldShowRemind: undefined,
}
export const getEventCount = createAsyncThunk(
  'eventTestReducer/getEventCount',
  async ({}, thunkAPI) => {
    try {
      const res = await EventTestAPI.getCount()
      return res
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const eventTestSlice = createSlice({
  name: 'eventTestReducer',
  initialState,
  reducers: {
    active: (state) => {
      // Active user guide khi action 'active' được gọi
      state.status = true
    },
    closeShowRemind: (state) => {
      state.shouldShowRemind = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEventCount.pending, (state) => {
      // state.loading = true
    })
    builder.addCase(getEventCount.fulfilled, (state, action) => {
      state.count = action.payload.data.count
      if (action.payload.data.count >= 1) {
        state.shouldShowRemind = true
      }
    })
    builder.addCase(getEventCount.rejected, (state, action) => {})
  },
})

export const { active, closeShowRemind } = eventTestSlice.actions
export const eventTestReducer = (state: RootState) => state.eventTestReducer
export default eventTestSlice.reducer
