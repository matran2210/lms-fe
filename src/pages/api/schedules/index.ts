import { fetcher } from '@services/requestV2'
import { apiURL } from 'src/redux/services/httpService'
import { IResponse } from 'src/redux/types'
import {
  ICreateSchedulePayload,
  IResponseSchedule,
} from 'src/redux/types/Schedule/schedule'

export class SchedulesAPI {
  static get(params: Object): Promise<IResponse<IResponseSchedule[]>> {
    return fetcher(`${apiURL}/schedules/teachers`, { params: params })
  }

  static create(
    data: ICreateSchedulePayload,
  ): Promise<IResponse<IResponseSchedule>> {
    return fetcher(`${apiURL}/schedules/busy-schedule`, {
      method: 'POST',
      data: data,
    })
  }
}
