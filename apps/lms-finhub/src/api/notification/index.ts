import { fetcher } from '@services/requestV2'
import getConfig from 'next/config'

export class NotificationAPI {
  static getCountUnRead(): Promise<any> {
    return fetcher(`/notifications/count-unread`)
  }

  static getNotification(params: Object): Promise<any> {
    return fetcher(`/notifications`, {
      params: params,
    })
  }

  static getDetail(id: string): Promise<any> {
    return fetcher(`/notifications/${id}`)
  }

  static markAll(): Promise<any> {
    return fetcher(`/notifications/mark-all-read`, {
      method: 'POST',
    })
  }

  static markById(ids: string[], markRead: boolean): Promise<any> {
    return fetcher(`/notifications/mark-read`, {
      method: 'POST',
      data: {
        notification_ids: ids,
        mark_read: markRead,
      },
    })
  }
}
