import { apiURL, httpService } from 'src/redux/services/httpService'

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
