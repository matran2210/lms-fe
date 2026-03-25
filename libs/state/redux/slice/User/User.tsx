import { IAuthAPI, USER_STATUS, USER_TYPE } from '@lms/core'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import {
  ITemplateConfig,
  IUserAPI,
  IUserContextAPI,
  IUserStatus,
  UserState,
  UserType,
} from '../../types/User/urser'

const initialState: UserState = {
  loading: false,
  loadingEditName: false,
  loadingEditAvatar: false,
  errors: {},
  user: {
    id: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    key: '',
    invite_id: '',
    code: '',
    username: '',
    nick_name: '',
    type: USER_TYPE.STUDENT.key as UserType,
    status: USER_STATUS.ACTIVE.key as IUserStatus,
    ekyc_status: '',
    approved_date: '',
    reject_reason: '',
    confirmation_status: '',
    detail_id: '',
    detail: {
      id: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      country_code: '',
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      full_name: '',
      address: '',
      major: {},
      level: '',
      university: {},
      provinceCode: '',
      districtCode: '',
      wardCode: '',
      dob: '',
      avatar: {},
      sex: '',
      permanent_address: '',
      identity_card: '',
      date_of_issue: '',
      place_of_issue: '',
      identity_card_image_front: {},
      identity_card_image_back: {},
      tax_code: '',
      note: '',
      is_verify: false,
      is_default: false,
      learning_purpose: '',
      contact_detail: '',
      special_note: '',
      classification: '',
      company_type: '',
      company_position: '',
      company_rank: '',
      settings: null,
    },
    user_hubspot_program_infos: [],
    course_tab_groups: {},
    user_contacts: [],
    certificates: {
      template_full: 0,
      template_short_course: 0,
    },
    courses: {
      template_full: 0,
      template_short_course: 0,
    },
    keycloak_user_id: '',
  },
  loginHistory: {
    meta: {},
    userActivities: [],
  },
  loadHistory: false,
}

export const getMe = createAsyncThunk(
  'userReducer/getMe',
  async (api: IUserContextAPI, thunkAPI) => {
    try {
      const res = await api.getMe()
      if (!res) {
        // toast.error(res.error.message)
        return
      }
      return { ...res }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const getUserInformation = createAsyncThunk(
  'userReducer/getUserInformation',
  async (api: IUserContextAPI, thunkAPI) => {
    try {
      const res = await api.getUserInformation()
      if (!res) {
        // toast.error(res.error.message)
        return
      }
      return { ...res.data.data }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const updateUser = createAsyncThunk(
  'userReducer/updateUser',
  async (
    {
      api,
      full_name,
      avatar,
    }: { api: IUserContextAPI; full_name: string; avatar?: { [key: string]: string } | null },
    thunkAPI,
  ) => {
    try {
      const res = await api.updateUser(full_name?.trim(), avatar)
      if (!res) {
        // toast.error(res.error.message)
        return
      }
      if (res?.data?.message) {
        toast.success(res.data.message, { id: 'update_user_toast' })
      }

      return { full_name }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const updateUserAvatar = createAsyncThunk(
  'userReducer/updateUserAvatar',
  async ({ api, avatar }: { api: IUserContextAPI; avatar: File }, thunkAPI) => {
    try {
      const res = await api.updateUserAvatar(avatar)
      if (!res) {
        return
      }
      if (res?.data?.message) {
        toast.success(res.data.message, { id: 'update_user_toast' })
      }

      return { avatar }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const makeContactDefault = createAsyncThunk(
  'userReducer/makeContactDefault',
  async ({ api, id }: { api: IAuthAPI; id: string }, thunkAPI) => {
    try {
      const res = await api.makeContactDefault(id)
      if (!res) {
        return
      }
      toast.success('Cập nhật liên hệ mặc định thành công!')
      return {}
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const getLoginHistory = createAsyncThunk(
  'userReducer/getListHistory',
  async ({ api, page_index, page_size, type }: {
    api: IUserContextAPI;
    page_index: number;
    page_size: number;
    type: any
  }, thunkApi) => {
    try {
      const res = await api.getListHistory({ page_index, page_size, type })
      return res
    } catch (err) {
      thunkApi.rejectWithValue(err)
    }
  },
)
export const loadMoreLoginHistory = createAsyncThunk(
  'userReducer/loadMoreHistory',
  async ({ api, page_index, page_size, type }: {
    api: IUserContextAPI;
    page_index: number;
    page_size: number;
    type: any
  }, thunkApi) => {
    try {
      const res = await api.getListHistory({ page_index, page_size, type })
      return res
    } catch (err) {
      thunkApi.rejectWithValue(err)
    }
  },
)
export const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMe.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.user = { ...state.user, ...action.payload }
      }
    })
    builder.addCase(getMe.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getUserInformation.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      getUserInformation.fulfilled,
      (
        state,
        action: PayloadAction<{
          courses: ITemplateConfig
          certificates: ITemplateConfig
        }>,
      ) => {
        state.loading = false
        if (action.payload) {
          if (state.user.courses) {
            state.user.courses.template_full =
              action.payload.courses?.template_full
          }
          if (state.user.certificates) {
            state.user.certificates.template_full =
              action.payload.certificates?.template_full
          }
        }
      },
    )
    builder.addCase(getUserInformation.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(updateUser.pending, (state) => {
      state.loadingEditName = true
    })
    builder.addCase(updateUser.fulfilled, (state) => {
      state.loadingEditName = false
    })
    builder.addCase(updateUser.rejected, (state) => {
      state.loadingEditName = false
    })
    builder.addCase(updateUserAvatar.pending, (state) => {
      state.loadingEditAvatar = true
    })
    builder.addCase(updateUserAvatar.fulfilled, (state) => {
      state.loadingEditAvatar = false
    })
    builder.addCase(updateUserAvatar.rejected, (state) => {
      state.loadingEditAvatar = false
    })

    builder.addCase(makeContactDefault.pending, (state) => {
      state.loading = true
    })
    builder.addCase(makeContactDefault.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(makeContactDefault.rejected, (state) => {
      state.loading = false
    })

    builder.addCase(getLoginHistory.pending, (state) => {
      state.loadHistory = true
    })
    builder.addCase(getLoginHistory.fulfilled, (state, action) => {
      state.loginHistory = action.payload
      state.loadHistory = false
    })
    builder.addCase(getLoginHistory.rejected, (state) => {
      state.loadHistory = false
    })
    builder.addCase(loadMoreLoginHistory.pending, (state) => {
      state.loadHistory = true
    })
    builder.addCase(loadMoreLoginHistory.fulfilled, (state, action) => {
      const obj = { ...state.loginHistory }
      obj.meta = action.payload.meta
      obj.userActivities = obj.userActivities.concat(
        action.payload.userActivities,
      )
      state.loginHistory = obj
      state.loadHistory = false
    })
    builder.addCase(loadMoreLoginHistory.rejected, (state) => {
      state.loadHistory = false
    })
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const userReducer = <
  T extends {
    userReducer: UserState;
  },
>(
  state: T,
) => state.userReducer

export default userSlice.reducer
