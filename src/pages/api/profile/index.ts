import { apiURL, httpService } from 'src/redux/services/httpService'

const MyProfileAPI = {
  getProfile: async (params?: Object): Promise<any> => {
    const response = await httpService.GET<any, any>({
      uri: `users/profile`,
      params: params,
    })
    return response
  },
}

export default MyProfileAPI
