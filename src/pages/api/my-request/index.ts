import { fetcher } from '@services/requestV2'
import { IResponse } from 'src/redux/types'
import {
  IBusyRequestDetailResponse,
  IBusySchedule,
  IWeeklyNorm,
} from 'src/type/my-request'

export class MyRequestAPI {
  static createBusySchedule({
    request_name,
    request_type,
    time,
    note,
  }: {
    request_name: string
    request_type: string
    time?: IBusySchedule[]
    note?: string | null
  }): Promise<any> {
    return fetcher('/request-schedules/busy-schedule', {
      method: 'POST',
      data: {
        request_name: request_name,
        request_type: request_type,
        time: time,
        note: note,
      },
    })
  }
  static editBusySchedule(
    id: string,
    {
      request_name,
      request_type,
      status,
      time,
      note,
    }: {
      request_name: string
      request_type: string
      status: string | undefined
      time?: IBusySchedule[]
      note?: string | null
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/busy-schedules/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        request_type: request_type,
        status: status,
        time: time,
        note: note,
      },
    })
  }
  static createWeeklyNorms({
    request_name,
    request_type,
    time,
    note,
  }: {
    request_name: string
    request_type: string
    time?: IWeeklyNorm[]
    note?: string | null
  }): Promise<any> {
    return fetcher('/request-schedules/weekly-norm', {
      method: 'POST',
      data: {
        request_name: request_name,
        request_type: request_type,
        time: time,
        note: note,
      },
    })
  }
  static editWeeklyNorm(
    id: string,
    {
      request_name,
      request_type,
      status,
      time,
      note,
    }: {
      request_name: string
      request_type: string
      status: string | undefined
      time?: IWeeklyNorm[]
      note?: string | null
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/weekly-norm/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        request_type: request_type,
        status: status,
        time: time,
        note: note,
      },
    })
  }
  static createTimeoffRequest({
    request_name,
    teacher_id,
    scheduleAdjusments,
  }: {
    request_name: string
    teacher_id: string
    scheduleAdjusments?: { id: string; reason: string }[]
  }): Promise<any> {
    return fetcher('/request-schedules/time-off', {
      method: 'POST',
      data: {
        request_name: request_name,
        teacher_id: teacher_id,
        scheduleAdjusments: scheduleAdjusments,
      },
    })
  }
  static editTimeoffRequest(
    id: string,
    {
      request_name,
      status,
      scheduleAdjusments,
    }: {
      request_name: string
      status: string
      scheduleAdjusments?: { id: string; reason: string }[]
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/time-off/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        status: status,
        scheduleAdjusments: scheduleAdjusments,
      },
    })
  }
  static createChangeTeachingModeRequest({
    request_name,
    teacher_id,
    scheduleAdjusments,
  }: {
    request_name: string
    teacher_id: string
    scheduleAdjusments?: { id: string; reason: string }[]
  }): Promise<any> {
    return fetcher('/request-schedules/teaching-mode', {
      method: 'POST',
      data: {
        request_name: request_name,
        teacher_id: teacher_id,
        scheduleAdjusments: scheduleAdjusments,
      },
    })
  }
  static editTeachingModeRequest(
    id: string,
    {
      request_name,
      status,
      scheduleAdjusments,
    }: {
      request_name: string
      status: string
      scheduleAdjusments?: { id: string; reason: string }[]
    },
  ): Promise<any> {
    return fetcher(`/request-schedules/teaching-mode/${id}`, {
      method: 'PUT',
      data: {
        request_name: request_name,
        status: status,
        scheduleAdjusments: scheduleAdjusments,
      },
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
    return fetcher(`/schedules/teacher_schedules/class`, {
      params: {
        page_index: page_index,
        page_size: page_size,
        ...(teacher_id ? { teacher_id } : {}),
        ...(class_id ? { class_id } : {}),
      },
    })
  }
}
