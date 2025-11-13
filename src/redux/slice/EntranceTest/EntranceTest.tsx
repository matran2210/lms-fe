import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { EntranceTestAPI } from 'src/pages/api/entrance-test'
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
export const getEntranceCount = createAsyncThunk(
  'entranceTestReducer/getEntranceCount',
  async ({}, thunkAPI) => {
    try {
      const res = await EntranceTestAPI.getEntranceCount()
      return res
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const entranceTestSlice = createSlice({
  name: 'entranceTestReducer',
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
    builder.addCase(getEntranceCount.pending, (state) => {
      // state.loading = true
    })
    builder.addCase(getEntranceCount.fulfilled, (state, action) => {
      state.count = action.payload.data.count
      if (action.payload.data.count >= 1) {
        state.shouldShowRemind = true
      }
    })
    builder.addCase(getEntranceCount.rejected, (state, action) => {})
  },
})

export const { active, closeShowRemind } = entranceTestSlice.actions
export const entranceTestReducer = (state: RootState) =>
  state.entranceTestReducer
export default entranceTestSlice.reducer
