import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { USER_STATUS, USER_TYPE } from '@utils/constants/User'
import toast from 'react-hot-toast'
import UserApi from 'src/redux/services/User/user'
import { RootState } from 'src/redux/store'
import { IUserStatus, IUserType, UserState } from 'src/redux/types/User/urser'

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
    type: USER_TYPE.STUDENT.key as IUserType,
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
      major: '',
      level: '',
      university: '',
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
  },
}

export const getMe = createAsyncThunk(
  'userReducer/getMe',
  async ({}, thunkAPI) => {
    try {
      const res = await UserApi.getMe()
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
export const updateUser = createAsyncThunk(
  'userReducer/updateUser',
  async (
    {
      full_name,
      avatar,
    }: { full_name: string; avatar?: { [key: string]: string } | null },
    thunkAPI,
  ) => {
    try {
      const res = await UserApi.updateUser(full_name?.trim(), avatar)
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
  async (avatar: File, thunkAPI) => {
    try {
      const res = await UserApi.updateUserAvatar(avatar)
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
        state.user = action.payload
      }
    })
    builder.addCase(getMe.rejected, (state) => {
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
  },
})

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const userReducer = (state: RootState) => state.userReducer

export default userSlice.reducer
