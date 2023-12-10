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
  list_notifications: any[]
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  title: string
  type: string
  mode: string
  status: string
  action: string
  content: string
  send_time?: Date
  created_by: any
  created_from: any
  files: any
}

const initialState: NotificationState = {
  loading: false,
  list_notifications: [],
  created_at: null,
  updated_at: null,
  deleted_at: null,
  title: '',
  type: '',
  mode: '',
  status: '',
  action: '',
  content: '',
  send_time: null,
  created_by: null,
  created_from: null,
  files: [],
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
      return false
    }
  },
)

export const getNotification = createAsyncThunk(
  'notificationReducer/getNotification',
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

export const getNotificationDetail = createAsyncThunk(
  'courseActivityReducer/getNotificationDetail',
  async (id: string, thunkAPI) => {
    try {
      const res = await NotificationApi.getDetail(id)
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
  reducers: {
    setState: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },

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
      state.list_notifications = action.payload?.notifications
    })
    builder.addCase(getNotification.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getNotificationDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getNotificationDetail.fulfilled, (state, action) => {
      state.loading = false
      state.created_at = action.payload?.created_at
      state.updated_at = action.payload?.updated_at
      state.deleted_at = action.payload?.deleted_at
      state.title = action.payload?.title
      state.type = action.payload?.type
      state.mode = action.payload?.mode
      state.status = action.payload?.status
      state.action = action.payload?.action
      state.content = action.payload?.content
      state.send_time = action.payload?.send_time
      state.created_by = action.payload?.created_by
      state.created_from = action.payload?.created_from
      state.files = action.payload?.files
    })
    builder.addCase(getNotificationDetail.rejected, (state) => {
      state.loading = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const notificationReducer = (state: RootState) =>
  state.notificationReducer

export default notificationSlice.reducer
