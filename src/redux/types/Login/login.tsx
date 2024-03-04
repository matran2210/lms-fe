export interface ILoginData {
  userid: string
  password: string
}
export interface LoginReq {
  login: string
  password: string
  remember_me: boolean
  device_id: string | undefined
}

export interface ChangePasswordReq {
  oldpassword: string
  newpassword: string
}

export interface ChangePasswordRes {
  message: string
  code: number
}

export interface SendEmailReq {
  email: string
}
export interface VerifyOtpReq {
  code: string
  token: string
}
export interface ResetPassword {
  new_password: string
}

export interface data {
  'auth-token': string
}

export interface LoginRes {
  user: {
    email: string
    username: string
  }
  tokens: {
    act: string
    rft: string
  }
}

export interface LoginState {
  accessToken: string
  loading: boolean
  errors: object
  changePass: boolean
  user: {
    email: string
    username: string
  }
  unsavedChange?: boolean
}

export interface ErrorLogin {
  message: string
}
