export interface ILoginData {
  userid: string
  password: string
}
export interface LoginReq {
  userid: string
  password: string
}

export interface ChangePasswordReq {
  oldpassword: string
  newpassword: string
}

export interface ChangePasswordRes {
  message: string
  code: number
}

export interface data {
  'auth-token': string
}

export interface LoginRes {
  message: string
  code: number
  data: data
}

export interface LoginState {
  accessToken: string
  loading: boolean
  errors: object
  changePass: boolean
}

export interface ErrorLogin {
  message: string
}
