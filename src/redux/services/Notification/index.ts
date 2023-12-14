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
  getDetail: async (id: string): Promise<IResponse<INotificationDetail>> => {
    const uri = url.getNotifications
    const response = await httpService.GET<any, any>({
      uri: `${uri}/${id}`,
    })
    return response
  },
  markAll: async (): Promise<IResponse<any>> => {
    const uri = url.markAll
    const response = await httpService.POST<any, any>({
      uri,
    })
    return response
  },
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
