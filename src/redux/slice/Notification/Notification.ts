import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import NotificationApi from 'src/redux/services/Notification'
import { RootState } from 'src/redux/store'
import {
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  IDiscussion,
} from 'src/redux/types/Course/MyCourse/Activity/activity'
import { IActivity } from 'src/type/course/my-course/Activity'

// Tạo một đối tượng Notification với giá trị mặc định
export interface NotificationState {
  loading: boolean
}

const initialState: NotificationState = {
  loading: false,
  status: false,
}

export const getCountUnRead = createAsyncThunk(
  'notificationReducer/getCountUnRead',
  async (thunkAPI) => {
    try {
      const res = await NotificationApi.getCountUnRead()
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const getNotification = createAsyncThunk(
  'notificationReducer/getNotifications',
  async (params: Object, thunkAPI) => {
    try {
      const res = await NotificationApi.getNotification(params)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const notificationSlice = createSlice({
  name: 'notificationReducer',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getCountUnRead.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCountUnRead.fulfilled, (state, action) => {
      state.loading = false
    })
    builder.addCase(getCountUnRead.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getNotification.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getNotification.fulfilled, (state, action) => {
      state.loading = false
      /*return {...action.payload || {}, loading: false}*/
      state.status = action.payload?.status
    })
    builder.addCase(getNotification.rejected, (state) => {
      state.loading = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const notificationReducer = (state: RootState) =>
  state.notificationReducer

export default notificationSlice.reducer
