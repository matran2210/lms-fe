import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import UserApi from 'src/redux/services/User/user'
import { UserState } from 'src/redux/types/User/urser'

const initialState: UserState = {
  loading: false,
  errors: {},
  user: {
    updated_at: '',
    code: '',
    username: '',
    status: '',
    detail: {
      phone: '',
      full_name: '',
      avatar: {},
      settings: null,
    },
    course_user_certificate_instances: [],
  },
}

export const getUser = createAsyncThunk(
  'userReducer/getUser',
  async ({}, thunkAPI) => {
    try {
      const res = await UserApi.getUser()
      if (!res) {
        // toast.error(res.error.message)
        return
      }
      return { ...res }
    } catch (error: any) {
      toast.error(error.message)
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const loginSlice = createSlice({
  name: 'loginReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.user = action.payload
      }
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false
    })
  },
})
