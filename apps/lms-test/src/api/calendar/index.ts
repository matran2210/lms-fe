import { fetcher } from "@services/requestV2";

export default class CalendarApi {
  static getEventSchedule = (params?: object) => {
    return fetcher(`/calendar-student`, {
      params: params,
    });
  };

  static getDetailEvent = (id: string, is_holiday: boolean) => {
    return fetcher(`/calendar-student/${id}`, {
      params: {
        is_holiday,
      },
    });
  };
}
