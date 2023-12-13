import { IResponse } from 'src/redux/types'
import {
  LoginReq,
  LoginRes,
  ChangePasswordReq,
  ChangePasswordRes,
  SendEmailReq,
  VerifyOtpReq,
  ResetPassword,
} from '../../types/Login/login'
import { httpService } from '../httpService'
import url from './url'

const AuthApi = {
  login: (request: LoginReq): Promise<IResponse<LoginRes>> => {
    const uri = url.login
    return httpService.POST<LoginReq, IResponse<LoginRes>>({
      uri,
      request: {
        login: request.login?.trim(),
        password: request.password?.trim(),
        remember_me: request.remember_me,
        device_id: request?.device_id,
      },
    })
  },
  logout: (): Promise<IResponse<LoginRes>> => {
    const uri = url.logout
    return httpService.POST<any, any>({
      uri,
    })
  },
  changePassword: (request: ChangePasswordReq) => {
    const uri = url.changePassword
    return httpService.POST<ChangePasswordReq, ChangePasswordRes>({
      uri,
      request,
    })
  },
  sendEmail: (request: SendEmailReq) => {
    const uri = url.sendEmail
    return httpService.POST<SendEmailReq, IResponse<{ token: string }>>({
      uri,
      request: {
        email: request.email?.trim(),
      },
    })
  },
  verifyOtp: (request: VerifyOtpReq) => {
    const uri = url.verifyOtp
    return httpService.POST<
      VerifyOtpReq,
      IResponse<{ act: string; success: boolean }>
    >({
      uri,
      request,
    })
  },
  resetPassword: (request: ResetPassword) => {
    const uri = url.resetPassword
    return httpService.POST<ResetPassword, IResponse<any>>({
      uri,
      request: {
        new_password: request.new_password?.trim(),
      },
    })
  },
}

export default AuthApi
