import {
  ICreateSchedulePayload,
  IResponseSchedule,
  IWeeklyNorm,
} from '@lms/contexts'
import { IResponse } from '@lms/core'
import { fetcher } from '@services/request'

export class SchedulesAPI {
  static get(params: Object): Promise<IResponse<IResponseSchedule[]>> {
    return fetcher(`/schedules/teachers`, { params: params })
  }

  static create(
    data: ICreateSchedulePayload,
  ): Promise<IResponse<IResponseSchedule>> {
    return fetcher(`/schedules/busy-schedule`, {
      method: 'POST',
      data: data,
    })
  }

  static getWeeklyNorms(
    params: Record<string, any>,
  ): Promise<IResponse<IWeeklyNorm[]>> {
    return fetcher(`/schedules/weekly-norms`, { params })
  }
}
