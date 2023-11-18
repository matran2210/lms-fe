import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  removeJwtToken,
  setAccessToken,
  setRefreshToken,
} from '@utils/helpers/authen'
import { toast } from 'react-hot-toast'
import loginApi from '../../services/Authen/Login/login'
import { RootState } from '../../store'

import {
  ChangePasswordReq,
  ChangePasswordRes,
  LoginReq,
  LoginState,
} from '../../types/Login/login'
import { getUser } from '../User/User'

const initialState: LoginState = {
  accessToken: '',
  loading: false,
  changePass: false,
  errors: {},
  user: {
    email: '',
    username: '',
  },
}

export const getLoginUser = createAsyncThunk(
  'loginReducer/handleLogin',
  async (body: LoginReq, thunkAPI) => {
    try {
      const res = await loginApi.login(body)
      if (!res.success) {
        toast.error(res.error.message)
        return
      }
      return { ...res }
    } catch (error: any) {
      toast.error(error.message)
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const changePassword = createAsyncThunk(
  'loginReducer/changePassword',
  async (body: ChangePasswordReq, thunkAPI) => {
    try {
      const res: ChangePasswordRes = await loginApi.changePassword(body)
      return { ...res }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const loginSlice = createSlice({
  name: 'loginReducer',
  initialState,
  reducers: {
    resetLoginState: (state: LoginState) => {
      state.errors = {}
      state.loading = false
    },
    resetAuthUserState: (state: LoginState, action) => {},
    logout: (state: LoginState) => {
      state = { ...initialState }
      removeJwtToken()
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLoginUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getLoginUser.fulfilled, (state, action) => {
      state.loading = false
      state.changePass = false

      if (action?.payload?.data?.tokens?.act) {
        const accessToken = action.payload?.data.tokens.act
        const refreshToken = action.payload?.data.tokens.rft
        state.accessToken = accessToken
        state.user = action.payload.data.user
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
      }
    })
    builder.addCase(getLoginUser.rejected, (state, action) => {
      state.loading = false
      state.accessToken = ''
    })
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true
    })
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.code === 200) {
        state.changePass = true
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('refreshToken')
      }
    })
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false
    })
  },
})

export const { logout } = loginSlice.actions

// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const loginReducer = (state: RootState) => state.loginReducer

export default loginSlice.reducer
