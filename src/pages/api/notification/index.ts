import { apiURL } from '@components/mycourses/LearningResource'
import { fetcher } from '@services/requestV2'

export class NotificationAPI {
  static getCountUnRead(): Promise<any> {
    return fetcher(`${apiURL}/notifications/count-unread`)
  }

  static getNotification(params: Object): Promise<any> {
    return fetcher(`${apiURL}/notifications`, {
      params: params,
    })
  }

  static getDetail(id: string): Promise<any> {
    return fetcher(`${apiURL}/notifications/${id}`)
  }

  static markAll(): Promise<any> {
    return fetcher(`${apiURL}/notifications/mark-all-read`, {
      method: 'POST',
    })
  }
}
