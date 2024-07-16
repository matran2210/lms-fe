import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { RootState } from '../../store'
import { getKeycloakInstance } from 'src/utils/helpers/keycloak'

import {
  ChangePasswordReq,
  ChangePasswordRes,
  LoginReq,
  PostLoginReq,
  LoginState,
} from '../../types/Login/login'
import {
  removeJwtToken,
  removeLocalStorageJwtToken,
  setActToken,
  setRefreshToken,
} from '@utils/index'
import { PageLink } from 'src/constants'
import { AuthAPI } from 'src/pages/api/profile'

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

export const getLoginUser = createAsyncThunk(
  'loginReducer/handleLogin',
  async (body: PostLoginReq, thunkAPI) => {
    try {
      const res = await AuthAPI.postLogin(body)

      if (!res.success) {
        return
      }

      return { ...res }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)
export const getLogoutUser = createAsyncThunk(
  'loginReducer/handleLogout',
  async ({}, thunkAPI) => {
    try {
      const keycloak = getKeycloakInstance()
      keycloak.logout({ redirectUri: window.location.origin }).then(() => {
        removeLocalStorageJwtToken()
      })
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
    builder.addCase(getLoginUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getLoginUser.fulfilled, (state, action) => {
      state.loading = false
      state.changePass = false
    })
    builder.addCase(getLoginUser.rejected, (state, action) => {
      state.loading = false
      state.accessToken = ''
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

      const keycloak = getKeycloakInstance()
      keycloak.logout({ redirectUri: window.location.origin }).then(() => {
        removeLocalStorageJwtToken()
      })
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
      const keycloak = getKeycloakInstance()
      keycloak.logout({ redirectUri: window.location.origin }).then(() => {
        removeLocalStorageJwtToken()
      })
    })

    builder.addCase(changePassword.pending, (state) => {
      state.loading = true
    })
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.code === 200) {
        state.changePass = true
        removeJwtToken()
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
