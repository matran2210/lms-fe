import { httpService } from 'src/redux/services/httpService'

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
  changeUserPassword: async (current_password: string): Promise<any> => {
    const response = await httpService.POST<any, any>({
      uri: `users/change-password/send-otp`,
      request: {
        type: 'CHANGE_PASSWORD',
        current_password: current_password,
      },
    })
    return response
  },
  verifyOTPPassword: async (
    current_password: string,
    new_password: string,
    otp_code: string,
  ): Promise<any> => {
    const response = await httpService.POST<any, any>({
      uri: `users/change-password`,
      request: {
        current_password: current_password,
        new_password: new_password,
        otp_code: otp_code,
      },
    })
    return response
  },
}

export default MyProfileAPI
