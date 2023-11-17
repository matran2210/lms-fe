import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { RootState } from '../../store'
import {
  ErrorLogin,
  LoginReq,
  LoginRes,
  LoginState,
  ChangePasswordReq,
  ChangePasswordRes,
} from '../../types/Login/login'
import loginApi from '../../services/Authen/Login/login'

const initialState: LoginState = {
  accessToken: '',
  loading: false,
  changePass: false,
  errors: {},
}

export const getLoginUser = createAsyncThunk(
  'loginReducer/handleLogin',
  async (body: LoginReq, thunkAPI) => {
    try {
      const res: LoginRes = await loginApi.login(body)
      if (res.code !== 200) {
        toast.error(res.message)
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
      if (res.code !== 200) {
        toast.error(res.message)
      }
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
      state.accessToken = ''
      window.localStorage.removeItem('accessToken')
      window.localStorage.removeItem('refreshToken')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLoginUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getLoginUser.fulfilled, (state, action) => {
      state.loading = false
      state.changePass = false
      if (action?.payload?.data && action?.payload?.data['auth-token']) {
        const token = action?.payload?.data['auth-token']
        state.accessToken = token
        window.localStorage.setItem('accessToken', token)
        window.localStorage.setItem('refreshToken', token)
      }
      // navigate(ScreenNames.Inspection as never,{} as never)
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
