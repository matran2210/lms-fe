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

  static getUserInformation() {
    return fetcher(`${apiURL}/users/course-certificate/count`)
  }

  static updateUser(
    full_name: string,
    avatar?: { [key: string]: string } | null,
  ) {
    return fetcher(`${apiURL}/users`, {
      method: 'PUT',
      data: {
        full_name,
        avatar,
      },
    })
  }

  static makeContactDefault(id: string) {
    return fetcher(`${apiURL}/users/contacts/${id}/make-this-default`, {
      method: 'POST',
    })
  }

  static getListDevices() {
    return fetcher(`${apiURL}/users/devices`)
  }

  static getListHistory(params: Object) {
    return fetcher(`${apiURL}/users/activities`, {
      params: params,
    })
  }

  static getCertificate(pageSize: number, pageIndex: number) {
    return fetcher(
      `${apiURL}/certificate?page_size=${pageIndex}&page_index=${pageSize}`,
    )
  }

  static changeUserPassword(current_password: string) {
    return fetcher(`${apiURL}/users/change-password/send-otp`, {
      data: {
        type: 'CHANGE_PASSWORD',
        current_password: current_password,
      },
      method: 'POST',
    })
  }

  static verifyOTPPassword(
    current_password: string,
    new_password: string,
    otp_code: string,
  ) {
    return fetcher(`${apiURL}/users/change-password`, {
      data: {
        current_password: current_password,
        new_password: new_password,
        otp_code: otp_code,
      },
      method: 'POST',
    })
  }

  static getPinnedNotifications() {
    return fetcher(`${apiURL}/notifications/pinned`)
  }

}
