import { IResponse, IResponseMeta } from 'src/redux/types'
import { apiURL, httpService } from '../httpService'
import url from './url'
import {
  ICountUnread,
  INotifications,
  INotificationDetail,
} from 'src/type/notification/notification'

const NotificationApi = {
  getCountUnRead: async (): Promise<IResponse<ICountUnread>> => {
    const uri = url.getCountUnread
    const response = await httpService.GET<any, any>({
      uri,
    })
    return response
  },
  getNotification: async (
    params: Object,
  ): Promise<IResponse<INotifications>> => {
    const uri = url.getNotifications
    const response = await httpService.GET<any, any>({
      uri,
      params,
    })
    return response
  },
  getDetail: async (id: string): Promise<IResponse<INotificationDetail[]>> => {
    const uri = url.getNotifications
    const response = await httpService.GET<any, any>({
      uri: `${uri}/${id}`,
    })
    return response
  },
}

export default NotificationApi
