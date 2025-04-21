import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { AuthAPI } from 'src/pages/api/profile'
import { RootState } from '../../store'
import {
  ChangePasswordReq,
  ChangePasswordRes,
  LoginState,
} from '../../types/Login/login'

const initialState: LoginState = {
  accessToken: '',
  loading: false,
  changePass: false,
  errors: {},
  user: {
    email: '',
    username: '',
  },
  unsavedChange: false,
}

export const getLogoutUser = createAsyncThunk(
  'loginReducer/handleLogout',
  async ({}, thunkAPI) => {
    try {
      const authenticationManager = new AuthenticationManager()
      localStorage.clear()
      await authenticationManager.logout(window.location.origin)
      return {}
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const changePassword = createAsyncThunk(
  'loginReducer/changePassword',
  async (body: ChangePasswordReq, thunkAPI) => {
    try {
      const res: ChangePasswordRes = await AuthAPI.changePassword(body)
      return { ...res }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const disableUnsavedChange = createAsyncThunk(
  'loginReducer/disableUnsavedChange',
  async ({}, thunkAPI) => {
    return false
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
    enableUnsavedChange: (state: LoginState) => {
      state.unsavedChange = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(disableUnsavedChange.fulfilled, (state, action) => {
      state.unsavedChange = false
    })
    builder.addCase(getLogoutUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getLogoutUser.fulfilled, (state, action) => {
      state.accessToken = ''
      state.loading = false
      state.changePass = false
      state.errors = {}
      state.user = {
        email: '',
        username: '',
      }
    })
    builder.addCase(getLogoutUser.rejected, (state, action) => {
      state.accessToken = ''
      state.loading = false
      state.changePass = false
      state.errors = {}
      state.user = {
        email: '',
        username: '',
      }
    })

    builder.addCase(changePassword.pending, (state) => {
      state.loading = true
    })
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.code === 200) {
        state.changePass = true
      }
    })
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false
    })
  },
})
// export const selectAuthUser = (state: RootState) => state.loginReducer.authUser;
export const loginReducer = (state: RootState) => state.loginReducer

export default loginSlice.reducer
