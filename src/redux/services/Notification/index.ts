import { IResponse, IResponseMeta } from 'src/redux/types'
import { apiURL, httpService } from '../httpService'
import url from './url'
import {
  ICountUnread,
  INotifications,
  INotificationDetail,
} from 'src/type/notification/notification'
import { getMessagingToken } from 'src/utils/firebase'

const NotificationApi = {
  createDevice: async (): Promise<IResponse<any>> => {
    const token = await getMessagingToken()
    if (token) {
      const request = {
        token: `"${token}"`,
      }
      const uri = url.deviceToken
      const response = await httpService.POST<any, any>({
        uri,
        request: request,
      })
      return response
    } else {
      throw new Error('No token available')
    }
  },
}

export default NotificationApi
