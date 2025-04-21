import { apiURL } from '@components/mycourses/LearningResource'
import { fetcher } from '@services/requestV2'

export default class CalendarApi {
  static getEventSchedule = (params?: object) => {
    return fetcher(`${apiURL}/calendar-student`, {
      params: params,
    })
  }

  static getDetailEvent = (id: string, is_holiday: boolean) => {
    return fetcher(`${apiURL}/calendar-student/${id}`, {
      params: {
        is_holiday,
      },
    })
  }
}
