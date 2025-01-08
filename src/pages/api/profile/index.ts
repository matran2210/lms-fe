import { fetcher } from '@services/requestV2'
import { apiURL, httpService } from 'src/redux/services/httpService'
import {
  ChangePasswordReq,
  LoginReq,
  PostLoginReq,
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

  getSubjectOfhubspot: (courseCategoryName: string) => {
    return fetcher(
      `${apiURL}/users/subject-of-hubspot?course_category_name=${courseCategoryName}&sort=name%3DASC`,
    )
  },

  getExamBySubjectId: ({
    pageIndex,
    pageSize,
    params,
  }: {
    pageIndex: number
    pageSize: number
    params?: Object
  }) => {
    return fetcher(
      `${apiURL}/users/examination-subjects?page_index=${pageIndex}&page_size=${pageSize}`,
      {
        params,
      },
    )
  },

  updateProgram: (data: {
    course_category_id?: string
    user_hubspot_examination_subjects?: {
      examination_subject_id?: string
    }[]
  }) => {
    return fetcher(`${apiURL}/users/programs`, {
      data,
      method: 'PUT',
    })
  },
}

export default MyProfileAPI

export class AuthAPI {
  static me() {
    return fetcher(`me`)
  }

  static sendEmail(request: SendEmailReq) {
    return fetcher(`auth/forgot-password`, {
      method: 'POST',
      data: {
        email: request.email?.trim(),
      },
    })
  }

  static verifyOtp(data: VerifyOtpReq) {
    return fetcher(`auth/forgot-password/verify-otp`, {
      method: 'POST',
      data: data,
    })
  }

  static resetPassword(data: ResetPassword) {
    return fetcher(`auth/reset-password`, {
      method: 'POST',
      data: {
        new_password: data.new_password?.trim(),
      },
    })
  }

  static changePassword(data: ChangePasswordReq) {
    return fetcher(`changepassword`, {
      method: 'POST',
      data: data,
    })
  }

  static getUserInformation() {
    return fetcher(`users/course-certificate/count`)
  }

  static updateUser(
    full_name: string,
    avatar?: { [key: string]: string } | null,
  ) {
    return fetcher(`users`, {
      method: 'PUT',
      data: {
        full_name,
        avatar,
      },
    })
  }

  static makeContactDefault(id: string) {
    return fetcher(`users/contacts/${id}/make-this-default`, {
      method: 'POST',
    })
  }

  static getListDevices() {
    return fetcher(`users/devices`)
  }

  static getListHistory(params: Object) {
    return fetcher(`users/activities`, {
      params: params,
    })
  }

  static getCertificate(pageSize: number, pageIndex: number) {
    return fetcher(`certificate?page_size=${pageIndex}&page_index=${pageSize}`)
  }

  static changeUserPassword(current_password: string) {
    return fetcher(`users/change-password/send-otp`, {
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
    return fetcher(`users/change-password`, {
      data: {
        current_password: current_password,
        new_password: new_password,
        otp_code: otp_code,
      },
      method: 'POST',
    })
  }

  static getPinnedNotifications() {
    return fetcher(`notifications/pinned`)
  }
}
