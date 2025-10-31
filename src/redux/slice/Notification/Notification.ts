import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LOCAL_STORAGE_KEYS } from 'src/constants'
import { NotificationAPI } from 'src/pages/api/notification'
import { RootState } from 'src/redux/store'

// Tạo một đối tượng Notification với giá trị mặc định
export interface INotifications {
  id: string
  created_at: Date | string
  updated_at: string
  deleted_at?: Date | string
  title: string
  content?: string
  notification_user_instances: {
    is_read: boolean
  }
  notifications: any
  meta: Object
  created_by?: string | null
  avatar: { [key: string]: string }
}
export interface NotificationState {
  loading: boolean
  list_notifications: INotifications[]
  meta: {
    total_records: number
    total_pages: number
    page_index: number
    page_size: number
  }
  id: string
  created_at: string
  updated_at: string
  deleted_at?: null
  title: string
  type: string
  mode: string
  status: string
  action: string
  content: string
  send_time?: string
  created_by: string
  avatar: { [key: string]: string }
  created_from: string
  files: any
  total_records: number
  notification_status: boolean
}

const initialState: NotificationState = {
  loading: false,
  meta: {
    total_records: 0,
    total_pages: 1,
    page_index: 1,
    page_size: 10,
  },
  list_notifications: [],
  id: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
  title: '',
  type: '',
  mode: '',
  status: '',
  action: '',
  content: '',
  send_time: '',
  created_by: '',
  created_from: '',
  files: [],
  total_records: 0,
  notification_status: false,
  avatar: {},
}

export const getCountUnRead = createAsyncThunk(
  'notificationReducer/getCountUnRead',
  async ({}) => {
    try {
      const res = await NotificationAPI.getCountUnRead()
      if (!res?.data) {
        return
      }

      if (
        res.data.total_records !== undefined &&
        res.data.total_records !== null
      ) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT,
          res.data.total_records.toString(),
        )

        window.dispatchEvent(new Event('storage'))
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
      const res = await NotificationAPI.getNotification(params)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const loadMoreNotification = createAsyncThunk(
  'notificationReducer/loadMoreNotification',
  async (params: Object, thunkAPI) => {
    try {
      const res = await NotificationAPI.getNotification(params)
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
      const res = await NotificationAPI.getDetail(id)
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const markAllNotifications = createAsyncThunk(
  'notificationReducer/markAll',
  async (thunkAPI) => {
    try {
      const res = await NotificationAPI.markAll()
      if (!res?.data) {
        return
      }
      return { ...res.data }
    } catch (error: any) {
      return false
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
    clearNotifications: (state) => {
      state.list_notifications = []
      state.meta = {
        total_records: 0,
        total_pages: 1,
        page_index: 1,
        page_size: 10,
      }
    },
    toggleStatusById: (state, action: PayloadAction<string>) => {
      const targetId = action.payload
      const newList = state.list_notifications.map((notification) => {
        if (notification.id === targetId) {
          const currentIsRead =
            !!notification.notification_user_instances?.is_read
          return {
            ...notification,
            notification_user_instances: {
              ...notification.notification_user_instances,
              is_read: !currentIsRead,
            },
          }
        }
        return { ...notification }
      })
      state.list_notifications = newList
    },
    deleteNotificationById: (state, action: PayloadAction<string>) => {
      const targetId = action.payload
      state.list_notifications = state.list_notifications.filter(
        (notification) => notification.id !== targetId,
      )
    },
    deleteAllNotifications: (state) => {
      state.list_notifications = []
    },
    updateStatus: (state, action: PayloadAction<any>) => {
      let new_list_notifications = []
      new_list_notifications = state.list_notifications.map((e) => {
        if (e.id == action.payload.id) {
          const obj = { ...e.notification_user_instances, is_read: true }
          return { ...e, notification_user_instances: obj }
        }
        return { ...e }
      })
      state.list_notifications = [...new_list_notifications]
    },
    updateStatusAll: (state) => {
      let new_list_notifications = []
      new_list_notifications = state.list_notifications.map((e) => {
        const obj = { ...e.notification_user_instances, is_read: true }
        return { ...e, notification_user_instances: obj }
      })
      state.list_notifications = [...new_list_notifications]
    },
    showNotification: (state) => {
      state.notification_status = true
    },
    hideNotification: (state) => {
      state.notification_status = false
    },
    updateTotalUnread: (state, action: PayloadAction<any>) => {
      state.total_records = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCountUnRead.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCountUnRead.fulfilled, (state, action) => {
      state.loading = false
      if (typeof action.payload === 'object' && action.payload !== null) {
        state.total_records = action.payload?.total_records
      }
    })
    builder.addCase(getCountUnRead.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getNotification.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getNotification.fulfilled, (state, action) => {
      state.loading = false
      state.meta = action.payload?.meta
      state.list_notifications = action.payload?.notifications
    })
    builder.addCase(loadMoreNotification.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loadMoreNotification.fulfilled, (state, action) => {
      state.loading = false
      state.meta = action.payload?.meta
      state.list_notifications = [
        ...state.list_notifications,
        ...(action.payload?.notifications || []),
      ]
    })
    builder.addCase(loadMoreNotification.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getNotificationDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getNotificationDetail.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.id = action.payload?.id
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
      }
    })
    builder.addCase(getNotificationDetail.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(markAllNotifications.pending, (state) => {
      state.loading = true
    })
    builder.addCase(markAllNotifications.fulfilled, (state, action) => {
      state.loading = false
    })
    builder.addCase(markAllNotifications.rejected, (state) => {
      state.loading = false
    })
    // builder.addCase(getDeviceToken.pending, (state) => {
    //   state.loading = true
    // })
    // builder.addCase(getDeviceToken.fulfilled, (state, action) => {
    //   state.loading = false
    // })
    // builder.addCase(getDeviceToken.rejected, (state) => {
    //   state.loading = false
    // })
  },
})

export const {
  updateStatus,
  updateStatusAll,
  showNotification,
  hideNotification,
  clearNotifications,
  toggleStatusById,
  deleteNotificationById,
  deleteAllNotifications,
} = notificationSlice.actions
export const notificationReducer = (state: RootState) =>
  state.notificationReducer

export default notificationSlice.reducer
