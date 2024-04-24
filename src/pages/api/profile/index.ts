import { fetcher } from '@services/requestV2'
import { apiURL, httpService } from 'src/redux/services/httpService'
import {
  ChangePasswordReq,
  LoginReq,
  ResetPassword,
  SendEmailReq,
  VerifyOtpReq,
} from 'src/redux/types/Login/login'

const MyProfileAPI = {
  getProfile: async (params?: Object): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `users/profile`,
    })
    return response
  },
  getCertificate: async (pageSize: number, pageIndex: number): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `certificate?page_size=${pageIndex}&page_index=${pageSize}`,
    })
    return response
  },
}

export default MyProfileAPI

export class AuthAPI {
  static me() {
    return fetcher(`${apiURL}/me`)
  }

  static login(request: LoginReq) {
    return fetcher(`${apiURL}/auth/login`, {
      data: {
        login: request.login?.trim(),
        password: request.password?.trim(),
        remember_me: request.remember_me,
        device_id: request?.device_id,
      },
      method: 'POST',
    })
  }

  static logout() {
    return fetcher(`${apiURL}/auth/logout`, {
      method: 'POST',
    })
  }

  static sendEmail(request: SendEmailReq) {
    return fetcher(`${apiURL}/auth/forgot-password`, {
      method: 'POST',
      data: {
        email: request.email?.trim(),
      },
    })
  }

  static verifyOtp(data: VerifyOtpReq) {
    return fetcher(`${apiURL}/auth/forgot-password/verify-otp`, {
      method: 'POST',
      data: data,
    })
  }

  static resetPassword(data: ResetPassword) {
    return fetcher(`${apiURL}/auth/reset-password`, {
      method: 'POST',
      data: {
        new_password: data.new_password?.trim(),
      },
    })
  }

  static changePassword(data: ChangePasswordReq) {
    return fetcher(`${apiURL}/changepassword`, {
      method: 'POST',
      data: data,
    })
  }
}
