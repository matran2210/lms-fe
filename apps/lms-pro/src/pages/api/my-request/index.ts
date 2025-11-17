import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import {
  IBusyRequestDetailResponse,
  ICreateBusyScheduleData,
  ICreateEditWeeklyNorm,
  ICreateTimeoffRequestData,
  ICreateWeeklyNormData,
  IEditBusyScheduleData,
  IEditTimeoffRequestData,
  IEditWeeklyNormData,
} from '@lms/core'

export class MyRequestAPI {
  static createBusySchedule(
    data: ICreateBusyScheduleData,
  ): Promise<IResponse<null>> {
    return fetcher('/schedules/busy-schedule', {
      method: 'POST',
      data,
    })
  }
  static editBusySchedule(
    id: string,
    data: IEditBusyScheduleData,
  ): Promise<IResponse<null>> {
    return fetcher(`/request-schedules/busy-schedules/${id}`, {
      method: 'PUT',
      data,
    })
  }
  static createWeeklyNorms(
    data: ICreateWeeklyNormData,
  ): Promise<IResponse<ICreateEditWeeklyNorm>> {
    return fetcher('/request-schedules/weekly-norm', {
      method: 'POST',
      data,
    })
  }
  static editWeeklyNorm(
    id: string,
    data: IEditWeeklyNormData,
  ): Promise<IResponse<null>> {
    return fetcher(`/request-schedules/weekly-norm/${id}`, {
      method: 'PUT',
      data,
    })
  }
  static createTimeoffRequest(
    data: ICreateTimeoffRequestData,
  ): Promise<IResponse<string>> {
    return fetcher('/request-schedules/time-off', {
      method: 'POST',
      data,
    })
  }
  static editTimeoffRequest(
    id: string,
    data: IEditTimeoffRequestData,
  ): Promise<IResponse<string>> {
    return fetcher(`/request-schedules/time-off/${id}`, {
      method: 'PUT',
      data,
    })
  }

  static createChangeTeachingModeRequest(
    data: ICreateTimeoffRequestData,
  ): Promise<IResponse<string>> {
    return fetcher('/request-schedules/teaching-mode', {
      method: 'POST',
      data,
    })
  }
  static editTeachingModeRequest(
    id: string,
    data: IEditTimeoffRequestData,
  ): Promise<IResponse<string>> {
    return fetcher(`/request-schedules/teaching-mode/${id}`, {
      method: 'PUT',
      data,
    })
  }

  static getRequestDetail(
    id: string,
  ): Promise<IResponse<IBusyRequestDetailResponse>> {
    return fetcher(`/request-schedules/${id}`)
  }

  static getClass(
    page_index: number,
    page_size: number | undefined,
    teacher_id?: string,
  ) {
    return fetcher(`/classes/teachers`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...(teacher_id ? { teacher_id } : {}),
      },
    })
  }

  static getLesson(
    page_index: number,
    page_size: number | undefined,
    teacher_id: string,
    class_id: string,
  ) {
    return fetcher(`/schedules/teacher-schedules/class`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...(teacher_id ? { teacher_id } : {}),
        ...(class_id ? { class_id } : {}),
      },
    })
  }
}
