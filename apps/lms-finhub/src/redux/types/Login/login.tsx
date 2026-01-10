export interface ChangePasswordReq {
  oldpassword: string
  newpassword: string
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
