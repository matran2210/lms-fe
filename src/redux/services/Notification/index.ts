import axios from 'axios'
import { IResponse, IResponseMeta } from 'src/redux/types'
import { apiURL, httpService } from '../httpService'
import url from './url'
import { ICountUnread, INotification } from 'src/type/notification/notification'

const NotificationApi = {
  getCountUnread: async (): Promise<IResponse<ICountUnread>> => {
    const uri = url.getCountUnread
    const response = await httpService.GET<any, any>({
      uri,
      params,
    })
    return response
  },
  getNotification: async (
    params: Object,
  ): Promise<IResponse<INotification>> => {
    const uri = url.getNotifications
    const response = await httpService.GET<any, any>({
      uri,
      params,
    })
    return response
  },
}

export default NotificationApi
